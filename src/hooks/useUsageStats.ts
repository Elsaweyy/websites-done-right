import { useState, useCallback } from "react";

const STATS_KEY = "noor_usage_stats";

interface DailyStats {
  date: string;
  quranPages: number;
  tasbihCount: number;
  azkarCompleted: number;
  salatNabiCount: number;
  minutesSpent: number;
}

interface UsageStats {
  totalQuranPages: number;
  totalTasbih: number;
  totalAzkar: number;
  totalSalatNabi: number;
  streak: number;
  lastActiveDate: string;
  dailyStats: DailyStats[];
}

const getToday = () => new Date().toISOString().split("T")[0];

const defaultStats: UsageStats = {
  totalQuranPages: 0,
  totalTasbih: 0,
  totalAzkar: 0,
  totalSalatNabi: 0,
  streak: 0,
  lastActiveDate: "",
  dailyStats: [],
};

export function useUsageStats() {
  const [stats, setStats] = useState<UsageStats>(() => {
    const saved = localStorage.getItem(STATS_KEY);
    return saved ? JSON.parse(saved) : defaultStats;
  });

  const saveStats = useCallback((newStats: UsageStats) => {
    localStorage.setItem(STATS_KEY, JSON.stringify(newStats));
    setStats(newStats);
  }, []);

  const getTodayStats = useCallback((): DailyStats => {
    const today = getToday();
    return stats.dailyStats.find(d => d.date === today) || {
      date: today,
      quranPages: 0,
      tasbihCount: 0,
      azkarCompleted: 0,
      salatNabiCount: 0,
      minutesSpent: 0,
    };
  }, [stats]);

  const updateStreak = useCallback((currentStats: UsageStats): UsageStats => {
    const today = getToday();
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    
    if (currentStats.lastActiveDate === today) return currentStats;
    if (currentStats.lastActiveDate === yesterday) {
      return { ...currentStats, streak: currentStats.streak + 1, lastActiveDate: today };
    }
    return { ...currentStats, streak: 1, lastActiveDate: today };
  }, []);

  const incrementStat = useCallback((type: "quranPages" | "tasbihCount" | "azkarCompleted" | "salatNabiCount", amount: number = 1) => {
    const today = getToday();
    const totalKey = type === "quranPages" ? "totalQuranPages" 
      : type === "tasbihCount" ? "totalTasbih"
      : type === "azkarCompleted" ? "totalAzkar" 
      : "totalSalatNabi";

    setStats(prev => {
      const todayIndex = prev.dailyStats.findIndex(d => d.date === today);
      const dailyStats = [...prev.dailyStats];
      
      if (todayIndex >= 0) {
        dailyStats[todayIndex] = { ...dailyStats[todayIndex], [type]: dailyStats[todayIndex][type] + amount };
      } else {
        dailyStats.push({ date: today, quranPages: 0, tasbihCount: 0, azkarCompleted: 0, salatNabiCount: 0, minutesSpent: 0, [type]: amount });
      }

      // Keep only last 30 days
      const recentStats = dailyStats.slice(-30);

      const updated = updateStreak({
        ...prev,
        [totalKey]: prev[totalKey] + amount,
        dailyStats: recentStats,
      });
      
      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
      return updated;
    });
  }, [updateStreak]);

  const getWeeklyStats = useCallback(() => {
    const last7Days: DailyStats[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
      const found = stats.dailyStats.find(d => d.date === date);
      last7Days.push(found || { date, quranPages: 0, tasbihCount: 0, azkarCompleted: 0, salatNabiCount: 0, minutesSpent: 0 });
    }
    return last7Days;
  }, [stats]);

  const resetStats = useCallback(() => {
    saveStats(defaultStats);
  }, [saveStats]);

  return {
    stats,
    getTodayStats,
    incrementStat,
    getWeeklyStats,
    resetStats,
  };
}
