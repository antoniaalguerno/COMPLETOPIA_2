# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .logic import CompletoBot 

class ChatBotView(APIView):
    permission_classes = [] 

    def post(self, request):
        user_message = request.data.get('message', '')
        
        if not user_message:
            return Response({'error': 'Mensaje vacío'}, status=status.HTTP_400_BAD_REQUEST)

        # RECUPERAMOS EL ESTADO DE LA SESIÓN (Si no existe, iniciamos vacío)
        # session_data será un diccionario: {'state': 'IDLE', 'order': {}}
        session_data = request.session.get('bot_context', {})

        # Inicializamos el bot con la memoria de la sesión
        bot = CompletoBot(context=session_data)
        
        # Obtenemos la respuesta
        response_text = bot.handle_message(user_message)

        # GUARDAMOS EL NUEVO ESTADO EN LA SESIÓN
        request.session['bot_context'] = bot.get_context()

        return Response({
            'response': response_text,
            'sender': 'bot'
        })