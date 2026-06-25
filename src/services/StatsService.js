// Сервис для сбора статистики

const STATS_KEY = 'messenger_stats';

export const StatsService = {
  // Получить статистику
  getStats: () => {
    const stats = localStorage.getItem(STATS_KEY);
    return stats ? JSON.parse(stats) : {
      totalMessages: 0,
      totalChats: 0,
      totalImages: 0,
      totalAudio: 0,
      firstMessageDate: new Date().toISOString(),
      lastMessageDate: new Date().toISOString()
    };
  },

  // Добавить сообщение в статистику
  addMessage: (type = 'text') => {
    const stats = StatsService.getStats();
    stats.totalMessages++;
    stats.lastMessageDate = new Date().toISOString();

    if (type === 'image') stats.totalImages++;
    if (type === 'audio') stats.totalAudio++;

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  },

  // Добавить чат в статистику
  addChat: () => {
    const stats = StatsService.getStats();
    stats.totalChats++;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  },

  // Получить красивую статистику
  getFormattedStats: () => {
    const stats = StatsService.getStats();
    const firstDate = new Date(stats.firstMessageDate);
    const lastDate = new Date(stats.lastMessageDate);
    const daysActive = Math.floor((lastDate - firstDate) / (1000 * 60 * 60 * 24)) + 1;

    return {
      ...stats,
      daysActive,
      averageMessagesPerDay: Math.round(stats.totalMessages / daysActive),
      firstMessageDateFormatted: firstDate.toLocaleDateString('ru-RU'),
      lastMessageDateFormatted: lastDate.toLocaleDateString('ru-RU')
    };
  },

  // Очистить статистику
  clearStats: () => {
    localStorage.removeItem(STATS_KEY);
  }
};

export default StatsService;