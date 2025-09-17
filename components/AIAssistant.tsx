
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from '@google/genai';
import { Bot, X, Send, CornerDownLeft } from 'lucide-react';
import Spinner from './Spinner';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatRef.current) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: "You are a helpful AI assistant named 'Limra AI' for the admin of the Limra InfoNet blog. Your goal is to help the admin create, edit, improve, and manage blog posts. You can suggest catchy titles, write paragraphs on a given topic, improve existing text, check for grammar and spelling, and provide ideas for new blog posts. Use markdown for formatting when appropriate. Be concise, helpful, and professional.",
          },
        });
        setMessages([{ role: 'model', text: "Hello! I'm Limra AI. How can I help you with your blog posts today?" }]);
      } catch (error) {
        console.error("Failed to initialize AI Assistant:", error);
        setMessages([{ role: 'model', text: "Sorry, I couldn't connect to the AI service." }]);
      }
    }
  }, [isOpen]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
        if (!chatRef.current) throw new Error("Chat not initialized");

        const responseStream = await chatRef.current.sendMessageStream({ message: input });
        
        let modelResponse = '';
        setMessages(prev => [...prev, { role: 'model', text: '' }]);

        for await (const chunk of responseStream) {
            modelResponse += chunk.text;
            setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { role: 'model', text: modelResponse };
                return newMessages;
            });
        }
    } catch (error) {
        console.error("AI Assistant Error:", error);
        setMessages(prev => [...prev, { role: 'model', text: "Sorry, something went wrong. Please try again." }]);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 z-50 transition-transform hover:scale-110"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-full max-h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
          <header className="p-4 border-b dark:border-gray-700 flex items-center">
            <Bot className="text-primary-500 mr-2" />
            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Limra AI Assistant</h2>
          </header>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>
                  <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }}></div>
                </div>
              </div>
            ))}
             {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <div className="flex justify-start">
                    <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        <Spinner />
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <footer className="p-4 border-t dark:border-gray-700">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full p-2 pr-20 border rounded-md dark:bg-gray-700 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500 resize-none"
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading || !input.trim()} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50">
                <Send size={20} />
              </button>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
