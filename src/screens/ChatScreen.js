import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatScreen.css';
import StorageService from '../services/StorageService';
import NotificationService from '../services/NotificationService';
import StatsService from '../services/StatsService';

function ChatScreen({ chat, user, onBack, onToggleTheme, theme }) {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [stats, setStats] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const messagesEndRef = useRef(null);

  const reactions = ['👍', '❤️', '😂', '😮', '😢', '🔥'];

  // Загрузка сообщений при открытии чата
  useEffect(() => {
    const savedMessages = StorageService.getMessages(chat.id);
    if (savedMessages.length === 0) {
      const defaultMessages = [
        {
          id: '1',
          senderId: 'other',
          senderName: chat.name,
          content: 'Привет! 👋',
          type: 'text',
          timestamp: '12:00',
          reactions: {}
        },
        {
          id: '2',
          senderId: 'me',
          senderName: user.name,
          content: 'Привет! Как дела?',
          type: 'text',
          timestamp: '12:01',
          reactions: {}
        },
        {
          id: '3',
          senderId: 'other',
          senderName: chat.name,
          content: 'Хорошо! А у тебя?',
          type: 'text',
          timestamp: '12:02',
          reactions: {}
        }
      ];
      StorageService.saveMessages(chat.id, defaultMessages);
      setMessages(defaultMessages);
    } else {
      // Убедиться что у всех сообщений есть reactions
      const messagesWithReactions = savedMessages.map(msg => ({
        ...msg,
        reactions: msg.reactions || {}
      }));
      setMessages(messagesWithReactions);
    }

    const currentStats = StatsService.getFormattedStats();
    setStats(currentStats);

    NotificationService.requestPermission();
  }, [chat.id, user.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const simulateReply = () => {
    setIsTyping(true);
    setTimeout(() => {
      const replies = [
        'Ок! 👍',
        'Спасибо!',
        'Согласен 😊',
        'Интересно!',
        'Давай!',
        'Хорошо, спасибо за информацию',
        'Я согласен с тобой',
        'Это отличная идея!'
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const replyMessage = {
        id: Date.now().toString(),
        senderId: 'other',
        senderName: chat.name,
        content: randomReply,
        type: 'text',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        reactions: {}
      };
      const updatedMessages = [...messages, replyMessage];
      setMessages(updatedMessages);
      StorageService.saveMessages(chat.id, updatedMessages);
      setIsTyping(false);

      NotificationService.notifyNewMessage(chat.name, randomReply);
      NotificationService.playSound();
    }, 2000);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: user.name,
        content: messageText,
        type: 'text',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        reactions: {}
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      StorageService.saveMessages(chat.id, updatedMessages);
      setMessageText('');

      StatsService.addMessage('text');
      setStats(StatsService.getFormattedStats());

      StorageService.updateChat(chat.id, {
        lastMessage: messageText,
        lastMessageTime: 'сейчас'
      });

      simulateReply();
    }
  };

  const handleAddReaction = (messageId, reaction) => {
    const updatedMessages = messages.map(msg => {
      if (msg.id === messageId) {
        const msgReactions = msg.reactions || {};
        const newReactions = { ...msgReactions };
        if (newReactions[reaction]) {
          newReactions[reaction]++;
        } else {
          newReactions[reaction] = 1;
        }
        return { ...msg, reactions: newReactions };
      }
      return msg;
    });
    setMessages(updatedMessages);
    StorageService.saveMessages(chat.id, updatedMessages);
    setSelectedMessageId(null);
  };

  const handlePickImage = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: user.name,
        content: 'https://via.placeholder.com/300x300?text=Photo',
        type: 'image',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        reactions: {}
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      StorageService.saveMessages(chat.id, updatedMessages);
      setIsLoading(false);

      StatsService.addMessage('image');
      setStats(StatsService.getFormattedStats());

      simulateReply();
    }, 1000);
  };

  const handlePickAudio = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        senderName: user.name,
        content: '🎵 Голосовое сообщение (0:15)',
        type: 'audio',
        timestamp: new Date().toLocaleTimeString('ru-RU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        reactions: {}
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      StorageService.saveMessages(chat.id, updatedMessages);
      setIsLoading(false);

      StatsService.addMessage('audio');
      setStats(StatsService.getFormattedStats());

      simulateReply();
    }, 1000);
  };

  return (
    <div className="chat-screen-container">
      {/* Шапка */}
      <div className="chat-screen-header">
        <button onClick={onBack} className="back-btn">← Назад</button>
        <div className="chat-header-info">
          <img src={chat.avatar} alt={chat.name} className="chat-avatar-small" />
          <div>
            <h2>{chat.name}</h2>
            {isTyping && <p className="typing-indicator">печатает...</p>}
          </div>
        </div>
        <button 
          onClick={() => setShowStats(!showStats)}
          className="stats-btn"
          title="Статистика"
        >
          📊
        </button>
        <button 
          onClick={onToggleTheme}
          className="theme-btn-chat"
          title={theme === 'light' ? 'Тёмный режим' : 'Светлый режим'}
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>

      {/* Модальное окно статистики */}
      {showStats && stats && (
        <div className="stats-modal">
          <div className="stats-card">
            <h3>📊 Статистика</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">Всего сообщений</span>
                <span className="stat-value">{stats.totalMessages}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Всего чатов</span>
                <span className="stat-value">{stats.totalChats}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Фото</span>
                <span className="stat-value">{stats.totalImages}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Аудио</span>
                <span className="stat-value">{stats.totalAudio}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Дней активности</span>
                <span className="stat-value">{stats.daysActive}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Сообщений в день</span>
                <span className="stat-value">{stats.averageMessagesPerDay}</span>
              </div>
            </div>
            <p className="stat-info">
              📅 Первое сообщение: {stats.firstMessageDateFormatted}<br/>
              📅 Последнее сообщение: {stats.lastMessageDateFormatted}
            </p>
            <button 
              onClick={() => setShowStats(false)}
              className="close-stats-btn"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Сообщения */}
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-messages">
            <p>📭 Нет сообщений</p>
            <p>Начни разговор!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`message ${msg.senderId === 'me' ? 'sent' : 'received'}`}
            >
              <div 
                className="message-bubble"
                onMouseEnter={() => setSelectedMessageId(msg.id)}
                onMouseLeave={() => setSelectedMessageId(null)}
              >
                {msg.type === 'text' && <p>{msg.content}</p>}
                {msg.type === 'image' && (
                  <img src={msg.content} alt="фото" className="message-image" />
                )}
                {msg.type === 'audio' && (
                  <div className="message-audio">
                    {msg.content}
                  </div>
                )}
                <span className="message-time">{msg.timestamp}</span>

                {/* Реакции - с проверкой */}
                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                  <div className="message-reactions">
                    {Object.entries(msg.reactions).map(([reaction, count]) => (
                      <span key={reaction} className="reaction-badge">
                        {reaction} {count > 1 ? count : ''}
                      </span>
                    ))}
                  </div>
                )}

                {/* Кнопка добавления реакции */}
                {selectedMessageId === msg.id && (
                  <div className="reaction-picker">
                    {reactions.map(reaction => (
                      <button
                        key={reaction}
                        onClick={() => handleAddReaction(msg.id, reaction)}
                        className="reaction-btn"
                      >
                        {reaction}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="message received">
            <div className="message-bubble typing-bubble">
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
              <span className="typing-dot">.</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <div className="input-container">
        <button onClick={handlePickImage} className="action-btn" title="Фото">
          🖼️
        </button>
        <button onClick={handlePickAudio} className="action-btn" title="Аудио">
          🎤
        </button>
        
        <input
          type="text"
          placeholder="Сообщение..."
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="message-input"
        />
        
        <button onClick={handleSendMessage} className="send-btn">
          ➤
        </button>

        {isLoading && <span className="loading">⏳</span>}
      </div>
    </div>
  );
}

export default ChatScreen;