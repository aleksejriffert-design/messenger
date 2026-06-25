import React, { useState } from 'react';
import '../styles/AuthScreen.css';

function AuthScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Вход
      if (!email || !password) {
        setError('Заполни все поля');
        return;
      }
      onLogin({
        id: '1',
        name: 'Пользователь',
        email: email,
        avatar: 'https://via.placeholder.com/40'
      });
    } else {
      // Регистрация
      if (!name || !email || !password) {
        setError('Заполни все поля');
        return;
      }
      onLogin({
        id: '1',
        name: name,
        email: email,
        avatar: 'https://via.placeholder.com/40'
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>📱 Messenger</h1>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Твоё имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="auth-input"
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
          />
          
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" className="auth-button">
            {isLogin ? 'Вход' : 'Регистрация'}
          </button>
        </form>

        <p className="toggle-auth">
          {isLogin ? 'Нет аккаунта? ' : 'Уже есть аккаунт? '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="toggle-button"
          >
            {isLogin ? 'Зарегистрируйся' : 'Войди'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthScreen;