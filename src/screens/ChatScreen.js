import React, { useState, useEffect, useRef } from 'react';
import '../styles/ChatScreen.css';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

export const ChatScreen = ({ chat, user, onBack }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Загружаем сообщения в реальном времени
  useEffect(() => {
    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chat.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(loadedMessages);
      scrollToBottom();
    }, (err) => {
      console.error('Ошибка загрузки сообщений:', err);
    });

    return unsubscribe;
  }, [chat.id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      // Добавляем сообщение в БД
      await addDoc(collection(db, 'messages'), {
        chatId: chat.id,
        sender: user.email,
        senderName: user.name,
        text: messageText,
        timestamp: serverTimestamp()
      });

      // Обновляем последнее сообщение в чате
      await updateDoc(doc(db, 'chats', chat.id), {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp()
      });
    } catch (err) {
      console.error('Ошибка отправки:', err);
      setNewMessage(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-screen">
      <div className="chat-header">
        <button className="back-button" onClick={onBack}>
          ← Назад
        </button>
        <h2>💬 {chat.name}</h2>
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
              className={`message ${msg.sender === user.email ? 'user' : 'bot'}`}
            >
              <div className="message-content">
                <p>{msg.text}</p>
                <span className="message-time">
                  {msg.timestamp?.toDate?.()?.toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  }) || ''}
                </span>
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