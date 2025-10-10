
import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../types';
import { createChatSession } from '../services/geminiService';
import type { Chat as ChatSession } from '@google/genai';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatProps {
  language: Language;
  onQuit: () => void;
}

const Chat: React.FC<ChatProps> = ({ language, onQuit }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const chatSessionRef = useRef<ChatSession | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatSessionRef.current = createChatSession(language);
    
    const welcomeMessages: { [key in Language]?: string } = {
        [Language.English]: "Hello! Ready to chat? Tell me about your day.",
        [Language.Spanish]: "¡Hola! ¿Listo para charlar? Cuéntame sobre tu día.",
        [Language.French]: "Bonjour! Prêt à discuter? Raconte-moi ta journée.",
        [Language.German]: "Hallo! Bereit zu plaudern? Erzähl mir von deinem Tag.",
        [Language.Portuguese]: "Olá! Pronto para conversar? Me conte sobre o seu dia."
    };

    setMessages([{ sender: 'ai', text: welcomeMessages[language] || "Hello! Let's start chatting." }]);
    setIsLoading(false);
  }, [language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading || !chatSessionRef.current) return;

    const userMessage: ChatMessage = { sender: 'user', text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await chatSessionRef.current.sendMessage({ message: trimmedInput });
      const aiMessage: ChatMessage = { sender: 'ai', text: response.text };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = { sender: 'ai', text: "Desculpe, ocorreu um erro. Por favor, tente novamente." };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900">
      <div className="w-full max-w-2xl mx-auto flex flex-col h-[90vh] sm:h-[95vh]">
        <header className="flex-shrink-0 flex justify-between items-center mb-0 p-4 bg-white dark:bg-slate-800 rounded-t-2xl shadow-md z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Conversa em {language}</h1>
          </div>
          <button
            onClick={onQuit}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-semibold transition-colors"
          >
            Sair
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-lg space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl whitespace-pre-wrap break-words ${
                  msg.sender === 'user'
                    ? 'bg-blue-500 text-white rounded-br-lg'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-bl-lg'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && messages.length > 0 && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-700 rounded-bl-lg">
                <div className="flex items-center space-x-1">
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </main>
        
        <footer className="flex-shrink-0 p-4 bg-white dark:bg-slate-800 rounded-b-2xl shadow-md">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isLoading}
              className="flex-1 p-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white transition-shadow"
              aria-label="Chat input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-500 text-white p-3 rounded-xl disabled:bg-slate-400 dark:disabled:bg-slate-600 hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:ring-offset-slate-800"
              aria-label="Send message"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Chat;