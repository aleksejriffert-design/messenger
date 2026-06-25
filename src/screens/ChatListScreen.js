import React, { useState, useEffect } from 'react';
import '../styles/ChatListScreen.css';
import { db } from '../config/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

export const ChatListScreen = ({ user, onSelectChat, onLogout }) => {
  const [chats, setChats] = useState([]);
  const [newChatEmail, setNewChatEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загружаем чаты пользователя в реальном времени
  useEffect(() => {
    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedChats = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(loadedChats);
    }, (err) => {
      console.error('Ошибка загрузки чатов:', err);
    });

    return unsubscribe;
  }, [user.email]);

  const handleCreateChat = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!newChatEmail.trim()) {
      setError('Введи email');
      return;
    }

    if (newChatEmail === user.email) {
      setError('Не можешь создать чат с собой');
      return;
    }

    setLoading(true);

    try {
      // Проверяем существует ли уже чат
      const existingChat = chats.find(chat => 
        chat.participants.includes(newChatEmail)
      );

      if (existingChat) {
        setError('Чат с этим пользователем уже существует');
        setLoading(false);
        return;
      }

      // Создаём новый чат
      await addDoc(collection(db, 'chats'), {
        name: newChatEmail,
        participants: [user.email, newChatEmail],
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageTime: serverTimestamp()
      });

      setNewChatEmail('');
    } catch (err) {
      console.error('Ошибка создания чата:', err);
      setError('Ошибка при создании чата');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-list-screen">
      <div className="chat-list-header">
        <h1>💬 Мои чаты</h1>
        <div className="user-info">
          <span>👤 {user.name}</span>
          <button onClick={onLogout} className="logout-button">
            🚪 Выход
          </button>
        </div>
      </div>

      <form onSubmit={handleCreateChat} className="new-chat-form">
        <input
          type="email"
          placeholder="Email друга..."
          value={newChatEmail}
          onChange={(e) => setNewChatEmail(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? '⏳' : '➕'}
        </button>
      </form>

      {error && <div className="error-message">❌ {error}</div>}

      <div className="chats-list">
        {chats.length === 0 ? (
          <div className="empty-state">
            <p>📭 Нет чатов</p>
            <p>Добавь друга чтобы начать!</p>
          </div>
        ) : (
          chats.map(chat => (
            <div
              key={chat.id}
              className="chat-item"
              onClick={() => onSelectChat(chat)}
            >
              <div className="chat-info">
                <h3>👤 {chat.name}</h3>
                <p>{chat.lastMessage || '📭 Нет сообщений'}</p>
              </div>
              <span className="chat-time">
                {chat.lastMessageTime?.toDate?.()?.toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit'
                }) || ''}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};