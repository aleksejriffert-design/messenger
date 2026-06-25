// Сервис для работы с локальным хранилищем

const STORAGE_KEYS = {
  USER: 'messenger_user',
  CHATS: 'messenger_chats',
  MESSAGES: 'messenger_messages'
};

export const StorageService = {
  // Пользователь
  saveUser: (user) => {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
  },

  // Чаты
  saveChats: (chats) => {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  getChats: () => {
    const chats = localStorage.getItem(STORAGE_KEYS.CHATS);
    return chats ? JSON.parse(chats) : [];
  },

  addChat: (chat) => {
    const chats = StorageService.getChats();
    chats.unshift(chat);
    StorageService.saveChats(chats);
  },

  updateChat: (chatId, updates) => {
    const chats = StorageService.getChats();
    const index = chats.findIndex(c => c.id === chatId);
    if (index !== -1) {
      chats[index] = { ...chats[index], ...updates };
      StorageService.saveChats(chats);
    }
  },

  // Сообщения
  saveMessages: (chatId, messages) => {
    const allMessages = StorageService.getAllMessages();
    allMessages[chatId] = messages;
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(allMessages));
  },

  getMessages: (chatId) => {
    const allMessages = StorageService.getAllMessages();
    return allMessages[chatId] || [];
  },

  getAllMessages: () => {
    const messages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return messages ? JSON.parse(messages) : {};
  },

  addMessage: (chatId, message) => {
    const messages = StorageService.getMessages(chatId);
    messages.push(message);
    StorageService.saveMessages(chatId, messages);
  },

  clearAllData: () => {
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CHATS);
    localStorage.removeItem(STORAGE_KEYS.MESSAGES);
  }
};

export default StorageService;