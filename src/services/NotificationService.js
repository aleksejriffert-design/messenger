// Сервис для работы с уведомлениями

export const NotificationService = {
  // Проверить поддержку уведомлений
  isSupported: () => {
    return 'Notification' in window;
  },

  // Запросить разрешение на уведомления
  requestPermission: async () => {
    if (!NotificationService.isSupported()) {
      console.log('Уведомления не поддерживаются');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  // Отправить уведомление
  sendNotification: (title, options = {}) => {
    if (!NotificationService.isSupported()) return;

    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23667eea" width="192" height="192"/><text x="50%" y="50%" font-size="120" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">💬</text></svg>',
        badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192"><rect fill="%23667eea" width="192" height="192"/><text x="50%" y="50%" font-size="120" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">💬</text></svg>',
        tag: 'messenger-notification',
        requireInteraction: false,
        ...options
      });

      // Закрыть уведомление через 5 секунд
      setTimeout(() => notification.close(), 5000);

      return notification;
    }
  },

  // Уведомление о новом сообщении
  notifyNewMessage: (senderName, messageText) => {
    NotificationService.sendNotification(`Новое сообщение от ${senderName}`, {
      body: messageText.substring(0, 100),
      tag: `message-${Date.now()}`
    });
  },

  // Звук уведомления
  playSound: () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }
};

export default NotificationService;