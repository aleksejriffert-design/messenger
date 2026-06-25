// Сервис для управления темой (светлая/тёмная)

const THEME_KEY = 'messenger_theme';

export const ThemeService = {
  // Получить текущую тему
  getTheme: () => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    
    // Если не сохранено, проверить предпочтение системы
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  // Сохранить тему
  setTheme: (theme) => {
    localStorage.setItem(THEME_KEY, theme);
    applyTheme(theme);
  },

  // Переключить тему
  toggleTheme: () => {
    const current = ThemeService.getTheme();
    const newTheme = current === 'light' ? 'dark' : 'light';
    ThemeService.setTheme(newTheme);
    return newTheme;
  }
};

// Применить тему к документу
function applyTheme(theme) {
  const root = document.documentElement;
  
  if (theme === 'dark') {
    root.style.setProperty('--bg-primary', '#1a1a1a');
    root.style.setProperty('--bg-secondary', '#2d2d2d');
    root.style.setProperty('--bg-tertiary', '#3a3a3a');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#b0b0b0');
    root.style.setProperty('--border-color', '#404040');
    root.style.setProperty('--message-sent', '#667eea');
    root.style.setProperty('--message-received', '#3a3a3a');
    root.style.setProperty('--accent', '#667eea');
  } else {
    root.style.setProperty('--bg-primary', '#ffffff');
    root.style.setProperty('--bg-secondary', '#f5f5f5');
    root.style.setProperty('--bg-tertiary', '#f0f0f0');
    root.style.setProperty('--text-primary', '#000000');
    root.style.setProperty('--text-secondary', '#666666');
    root.style.setProperty('--border-color', '#eeeeee');
    root.style.setProperty('--message-sent', '#667eea');
    root.style.setProperty('--message-received', '#f0f0f0');
    root.style.setProperty('--accent', '#667eea');
  }
}

export default ThemeService;