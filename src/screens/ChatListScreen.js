import React, { useState, useEffect } from 'react';
import '../styles/ChatListScreen.css';
import StorageService from '../services/StorageService';

function ChatListScreen({ user, onSelectChat, onLogout, onToggleTheme, theme }) {
  const [chats, setChats] = useState([]);
  const [newChatName, setNewChatName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  // Загрузка чатов при открытии
  useEffect(() => {
    const savedChats = StorageService.getChats();
    if (savedChats.length === 0) {
      const defaultChats = [
        {
          id: '1',
          name: 'Маша',
          avatar: 'https://via.placeholder.com/50?text=M',
          lastMessage: 'Привет! Как дела?',
          lastMessageTime: '12:30',
          unreadCount: 2
        },
        {
          id: '2',
          name: 'Группа друзей',
          avatar: 'https://via.placeholder.com/50?text=G',
          lastMessage: 'Завтра встречаемся?',
          lastMessageTime: '11:15',
          unreadCount: 0
        },
        {
          id: '3',
          name: 'Иван',
          avatar: 'https://via.placeholder.com/50?text=I',
          lastMessage: 'Спасибо!',
          lastMessageTime: 'вчера',
          unreadCount: 0
        }
      ];
      StorageService.saveChats(defaultChats);
      setChats(defaultChats);
    } else {
      setChats(savedChats);
    }
  }, []);

  // Фильтрация чатов по поиску
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateChat = () => {
    if (newChatName.trim()) {
      const newChat = {
        id: Date.now().toString(),
        name: newChatName,
        avatar: `https://via.placeholder.com/50?text=${newChatName[0]}`,
        lastMessage: 'Новый чат',
        lastMessageTime: 'сейчас',
        unreadCount: 0
      };
      const updatedChats = [newChat, ...chats];
      StorageService.saveChats(updatedChats);
      setChats(updatedChats);
      setNewChatName('');
    }
  };

  const handleSelectChat = (chat) => {
    const updatedChat = { ...chat, unreadCount: 0 };
    const updatedChats = chats.map(c => c.id === chat.id ? updatedChat : c);
    StorageService.saveChats(updatedChats);
    setChats(updatedChats);
    onSelectChat(chat);
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    if (window.confirm('Удалить этот чат?')) {
      const updatedChats = chats.filter(c => c.id !== chatId);
      StorageService.saveChats(updatedChats);
      setChats(updatedChats);
    }
  };

  const handleSaveProfile = () => {
    if (editName.trim()) {
      const updatedUser = { ...user, name: editName };
      StorageService.saveUser(updatedUser);
      setShowSettings(false);
      window.location.reload();
    }
  };

  return (
    <div className="chat-list-container">
      {/* Шапка */}
      <div className="chat-list-header">
        <div className="header-content">
          <h1>Чаты</h1>
          <div className="header-actions">
            <button 
              onClick={onToggleTheme}
              className="theme-btn"
              title={theme === 'light' ? 'Тёмный режим' : 'Светлый режим'}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="settings-btn"
              title="Профиль"
            >
              ⚙️
            </button>
            <button onClick={onLogout} className="logout-btn">Выход</button>
          </div>
        </div>
      </div>

      {/* Модальное окно настроек */}
      {showSettings && (
        <div className="settings-modal">
          <div className="settings-card">
            <h3>Профиль</h3>
            <input
              type="text"
              placeholder="Твоё имя"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="settings-input"
            />
            <div className="settings-buttons">
              <button onClick={handleSaveProfile} className="save-btn">
                Сохранить
              </button>
              <button 
                onClick={() => setShowSettings(false)}
                className="cancel-btn"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Поле поиска */}
      <div className="search-section">
        <input
          type="text"
          placeholder="🔍 Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Поле для нового чата */}
      <div className="new-chat-section">
        <input
          type="text"
          placeholder="Новый чат..."
          value={newChatName}
          onChange={(e) => setNewChatName(e.target.value)}
          className="new-chat-input"
        />
        <button onClick={handleCreateChat} className="create-chat-btn">
          ➕
        </button>
      </div>

      {/* Список чатов */}
      <div className="chats-list">
        {filteredChats.length === 0 ? (
          <div className="empty-state">
            <p>📭 {searchQuery ? 'Чатов не найдено' : 'Нет чатов'}</p>
            <p>{searchQuery ? 'Попробуй другой поиск' : 'Создай новый чат выше'}</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div 
              key={chat.id}
              className="chat-item"
              onClick={() => handleSelectChat(chat)}
            >
              <img src={chat.avatar} alt={chat.name} className="chat-avatar" />
              
              <div className="chat-info">
                <div className="chat-header">
                  <h3>{chat.name}</h3>
                  <span className="chat-time">{chat.lastMessageTime}</span>
                </div>
                <p className="chat-last-message">{chat.lastMessage}</p>
              </div>

              {chat.unreadCount > 0 && (
                <div className="unread-badge">{chat.unreadCount}</div>
              )}

              <button 
                onClick={(e) => handleDeleteChat(chat.id, e)}
                className="delete-chat-btn"
                title="Удалить"
              >
                ✕
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChatListScreen;