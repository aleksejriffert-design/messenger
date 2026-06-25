import React, { useState } from 'react';
import '../styles/AuthScreen.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

export const AuthScreen = ({ onAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const user = userCredential.user;
      onAuth({
        id: user.uid,
        email: user.email,
        name: user.email.split('@')[0]
      });
    } catch (err) {
      let errorMessage = 'Ошибка авторизации';
      
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'Этот email уже зарегистрирован';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Пароль слишком слабый (минимум 6 символов)';
      } else if (err.code === 'auth/user-not-found') {
        errorMessage = 'Пользователь не найден';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Неверный пароль';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Неверный email';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        <h1>💬 Messenger</h1>
        
        <form onSubmit={handleAuth} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {error && <div className="error-message">❌ {error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? '⏳ Загрузка...' : (isLogin ? '🔓 Вход' : '📝 Регистрация')}
          </button>
        </form>

        <button 
          className="toggle-button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          disabled={loading}
        >
          {isLogin ? '📝 Нет аккаунта? Зарегистрируйся' : '🔓 Уже есть аккаунт? Войди'}
        </button>

        <div className="auth-info">
          <p>🧪 Тестовые данные:</p>
          <p>Email: test@example.com</p>
          <p>Пароль: 123456</p>
        </div>
      </div>
    </div>
  );
};