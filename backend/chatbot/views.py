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

        is_waiting = request.session.get('bot_waiting', False)

        bot = CompletoBot(waiting_order_state=is_waiting)
        response_text = bot.handle_message(user_message)

        request.session['bot_waiting'] = bot.new_state

        return Response({
            'response': response_text,
            'sender': 'bot'
        })