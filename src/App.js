import React, { useState, useEffect } from 'react';
import './App.css';
import { AuthScreen } from './screens/AuthScreen';
import { ChatListScreen } from './screens/ChatListScreen';
import { ChatScreen } from './screens/ChatScreen';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  // Проверяем авторизацию при загрузке
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.email.split('@')[0]
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setSelectedChat(null);
    } catch (err) {
      console.error('Ошибка выхода:', err);
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        ⏳ Загрузка...
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuth={setUser} />;
  }

  if (selectedChat) {
    return (
      <ChatScreen 
        chat={selectedChat} 
        user={user}
        onBack={() => setSelectedChat(null)} 
      />
    );
  }

  return (
    <ChatListScreen 
      user={user} 
      onSelectChat={setSelectedChat}
      onLogout={handleLogout}
    />
  );
}

export default App;