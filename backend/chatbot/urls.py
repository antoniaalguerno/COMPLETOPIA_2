from django.urls import path
from .views import ChatBotView

urlpatterns = [
    # La ruta vacía '' significa que responderá a la raíz que le asignemos en el archivo principal
    path('', ChatBotView.as_view(), name='chatbot_view'),
]