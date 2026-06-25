import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatScreen.css';
import { NotificationService } from '../services/NotificationService';
import { StatsService } from '../services/StatsService';

export const ChatScreen = ({ chat, onBack, onDeleteChat }) => {
  const [messages, setMessages] = useState(chat.messages || []);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ ИСПРАВЛЕНО: Добавлена зависимость chat.name
  useEffect(() => {
    document.title = `${chat.name} - Messenger`;
    return () => {
      document.title = 'Messenger';
    };
  }, [chat.name]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      date: new Date().toLocaleDateString('ru-RU'),
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // Имитация задержки ответа
    setTimeout(() => {
      const botMessage = {
        id: Date.now() + 1,
        text: generateBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: new Date().toLocaleDateString('ru-RU'),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);

      // Отправляем уведомление
      NotificationService.sendNotification(
        `${chat.name}`,
        botMessage.text
      );

      // Обновляем статистику
      StatsService.addMessage(chat.id);
    }, 500 + Math.random() * 1500);
  };

  const generateBotResponse = (userMessage) => {
    const responses = [
      'Интересно! 🤔',
      'Согласен с тобой! 👍',
      'Это очень важно! ⭐',
      'Спасибо за информацию! 📝',
      'Отлично сказано! 💯',
      'Я тебя понимаю! 😊',
      'Это имеет смысл! ✨',
      'Продолжай в том же духе! 🚀',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleDeleteChat = () => {
    if (window.confirm(`Удалить чат "${chat.name}"?`)) {
      onDeleteChat(chat.id);
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
        <h2>{chat.name}</h2>
        <button 
          className="delete-button" 
          onClick={handleDeleteChat}
          title="Удалить чат"
        >
          🗑️
        </button>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">
            <p>📭 Нет сообщений</p>
            <p>Начни разговор!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`message ${msg.sender}`}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">{msg.timestamp}</span>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="message-input"
          placeholder="Напиши сообщение..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className="send-button"
          disabled={isLoading || !newMessage.trim()}
        >
          {isLoading ? '⏳' : '➤'}
        </button>
      </form>
    </div>
  );
};