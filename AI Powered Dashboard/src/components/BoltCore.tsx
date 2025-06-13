import React, { useState, useRef, useEffect } from 'react';
import { Send, Download, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Message } from '../types';
import { AIService } from '../services/aiService';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface BoltCoreProps {
  theme: 'light' | 'dark';
}

const BoltCore: React.FC<BoltCoreProps> = ({ theme }) => {
  const [messages, setMessages] = useLocalStorage<Message[]>('bolt-ai-messages', []);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState('developer');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roles = [
    { id: 'developer', label: 'Developer', color: 'from-blue-500 to-cyan-500' },
    { id: 'therapist', label: 'Therapist', color: 'from-green-500 to-emerald-500' },
    { id: 'finance', label: 'Finance Guru', color: 'from-yellow-500 to-orange-500' },
    { id: 'student', label: 'Student Helper', color: 'from-purple-500 to-pink-500' },
    { id: 'custom', label: 'Custom', color: 'from-gray-500 to-slate-500' }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await AIService.getChatResponse(input, currentRole);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMessageCollapse = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, collapsed: !msg.collapsed } : msg
    ));
  };

  const exportChat = () => {
    const chatContent = messages.map(msg => 
      `[${msg.timestamp.toLocaleString()}] ${msg.role.toUpperCase()}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bolt-ai-chat-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    if (confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
    }
  };

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Header */}
      <div className={`border-b p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            BoltCore AI Assistant
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={exportChat}
              disabled={messages.length === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Role Selector */}
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className={`px-4 py-2 rounded-full transition-all duration-200 ${
                currentRole === role.id
                  ? `bg-gradient-to-r ${role.color} text-white shadow-lg`
                  : theme === 'dark'
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className={`text-center py-12 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">Start a conversation with BoltCore AI</p>
            <p className="text-sm">Choose a role above and ask me anything!</p>
          </div>
        ) : (
          <>
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-3xl rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 border border-gray-700 text-gray-100'
                      : 'bg-gray-100 border border-gray-200 text-gray-900'
                  } transition-all duration-200`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium opacity-80">
                      {message.role === 'user' ? 'You' : 'BoltCore AI'}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <button
                        onClick={() => toggleMessageCollapse(message.id)}
                        className="opacity-60 hover:opacity-100 transition-opacity"
                      >
                        {message.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {!message.collapsed && (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className={`max-w-3xl rounded-lg p-4 ${
                  theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-gray-100 border border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      BoltCore AI is thinking...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`border-t p-4 ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className={`flex-1 px-4 py-3 rounded-lg border transition-colors duration-200 ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-purple-500'
            } focus:ring-2 focus:border-transparent`}
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-5 h-5" />
            <span>Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BoltCore;