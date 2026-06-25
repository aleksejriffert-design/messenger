import React, { useState, useEffect } from 'react';
import './App.css';
import AuthScreen from './screens/AuthScreen';
import ChatListScreen from './screens/ChatListScreen';
import ChatScreen from './screens/ChatScreen';
import StorageService from './services/StorageService';
import ThemeService from './services/ThemeService';

function App() {
  const [currentScreen, setCurrentScreen] = useState('auth');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState('light');

  // Загрузка данных при старте
  useEffect(() => {
    // Загрузить тему
    const savedTheme = ThemeService.getTheme();
    setTheme(savedTheme);
    ThemeService.setTheme(savedTheme);

    // Загрузить пользователя
    const savedUser = StorageService.getUser();
    if (savedUser) {
      setCurrentUser(savedUser);
      setCurrentScreen('chatList');
    }
    setIsLoading(false);
  }, []);

  // Авторизация
  const handleLogin = (user) => {
    StorageService.saveUser(user);
    setCurrentUser(user);
    setCurrentScreen('chatList');
  };

  // Выход
  const handleLogout = () => {
    StorageService.clearUser();
    setCurrentUser(null);
    setCurrentScreen('auth');
  };

  // Открыть чат
  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
    setCurrentScreen('chat');
  };

  // Вернуться к списку чатов
  const handleBackToChats = () => {
    setSelectedChat(null);
    setCurrentScreen('chatList');
  };

  // Переключить тему
  const handleToggleTheme = () => {
    const newTheme = ThemeService.toggleTheme();
    setTheme(newTheme);
  };

  if (isLoading) {
    return <div className="loading-screen">⏳ Загрузка...</div>;
  }

  return (
    <div className="App" data-theme={theme}>
      {currentScreen === 'auth' && (
        <AuthScreen onLogin={handleLogin} />
      )}
      {currentScreen === 'chatList' && (
        <ChatListScreen 
          user={currentUser}
          onSelectChat={handleSelectChat}
          onLogout={handleLogout}
          onToggleTheme={handleToggleTheme}
          theme={theme}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatScreen 
          chat={selectedChat}
          user={currentUser}
          onBack={handleBackToChats}
          onToggleTheme={handleToggleTheme}
          theme={theme}
        />
      )}
    </div>
  );
}

export default App;