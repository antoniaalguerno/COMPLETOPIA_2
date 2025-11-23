import api from './client';

export interface ChatResponse {
    response: string;
    sender: 'bot' | 'user';
}

export async function sendMessageToBot(message: string): Promise<ChatResponse> {
    // Esto llamará a http://127.0.0.1:8000/api/chat/
    const response = await api.post('/chat/', { message });
    return response.data;
}