import React, { useState, useRef, useEffect } from 'react';
import { MdClose, MdSend, MdChat } from 'react-icons/md'; // Usamos react-icons para coherencia
import '../../css/ChatWidget.css'; // Crearemos este CSS abajo

interface ChatWidgetProps {
    isOpen: boolean;      // Viene del Layout
    onToggle: () => void; // Viene del Layout
}

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ isOpen, onToggle }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text: '¡Hola! Soy el asistente de Completopia. ¿En qué puedo ayudarte con el inventario o usuarios?',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    // Referencia para el scroll automático al final del chat
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 1. Agregar mensaje del usuario
        const newMessage: Message = {
            id: Date.now(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);
        const userInput = input;
        setInput('');

        // 2. Llamar al backend para obtener respuesta real
        try {
            // Ajustado a la ruta que registra Django: /api/chat/
            const res = await fetch('/api/chat/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userInput })
            });

            console.log('Chatbot status:', res.status);
            const text = await res.text();
            console.log('Chatbot raw body:', text);

            if (!res.ok) throw new Error(`HTTP ${res.status}: ${text}`);

            const data = JSON.parse(text); // backend devuelve { response: '...' }
            const botText = data.response ?? 'No se obtuvo respuesta del bot.';

            const botResponse: Message = {
                id: Date.now() + 1,
                text: botText,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (err) {
            const errorMsg: Message = {
                id: Date.now() + 2,
                text: 'Error al conectar con el servicio de chat.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
            console.error('Chatbot fetch error:', err);
        }
    };

    return (
        <div className={`chat-widget-container ${isOpen ? 'open' : ''}`}>
            
            {/* Ventana del Chat */}
            {isOpen && (
                <div className="chat-window">
                    {/* Cabecera */}
                    <div className="chat-header">
                        <div className="chat-title">
                            <h4>Asistente Completopia</h4>
                            <span className="status-indicator">● En línea</span>
                        </div>
                        <button onClick={onToggle} className="close-btn">
                            <MdClose size={24} />
                        </button>
                    </div>

                    {/* Cuerpo de mensajes */}
                    <div className="chat-body">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`message-row ${msg.sender}`}>
                                <div className="message-bubble">
                                    <p>{msg.text}</p>
                                    <span className="message-time">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Footer / Input */}
                    <div className="chat-footer">
                        <form onSubmit={handleSendMessage}>
                            <input 
                                type="text" 
                                placeholder="Escribe aquí..." 
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <button type="submit" disabled={!input.trim()}>
                                <MdSend size={20} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Botón flotante (opcional, si quieres que aparezca siempre abajo a la derecha) */}
            {/* Si prefieres que SOLO se abra desde el logo del sidebar, puedes comentar este botón */}
            {!isOpen && (
                <button className="chat-launcher" onClick={onToggle}>
                    <MdChat size={28} />
                </button>
            )}
        </div>
    );
};