import { useState, useEffect, useCallback } from "react";

export interface WirdConfig {
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  pagesPerDay: number;
  reminderEnabled: boolean;
  reminderTime: string; // HH:mm
}

export interface WirdProgress {
  currentSurah: number;
  currentAyah: number;
  completedToday: boolean;
  lastReadDate: string;
  streak: number;
  totalDaysCompleted: number;
}

const DEFAULT_CONFIG: WirdConfig = {
  startSurah: 1,
  startAyah: 1,
  endSurah: 2,
  endAyah: 141,
  pagesPerDay: 2,
  reminderEnabled: false,
  reminderTime: "08:00",
};

const DEFAULT_PROGRESS: WirdProgress = {
  currentSurah: 1,
  currentAyah: 1,
  completedToday: false,
  lastReadDate: "",
  streak: 0,
  totalDaysCompleted: 0,
};

export function useDailyWird() {
  const [config, setConfig] = useState<WirdConfig>(() => {
    const saved = localStorage.getItem("wird-config");
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  const [progress, setProgress] = useState<WirdProgress>(() => {
    const saved = localStorage.getItem("wird-progress");
    if (saved) {
      const parsed = JSON.parse(saved);
      const today = new Date().toDateString();
      if (parsed.lastReadDate !== today) {
        return { ...parsed, completedToday: false };
      }
      return parsed;
    }
    return DEFAULT_PROGRESS;
  });

  useEffect(() => {
    localStorage.setItem("wird-config", JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem("wird-progress", JSON.stringify(progress));
  }, [progress]);

  // Schedule reminder notification
  useEffect(() => {
    if (!config.reminderEnabled || !("Notification" in window)) return;

    const checkReminder = () => {
      const now = new Date();
      const [hours, minutes] = config.reminderTime.split(":").map(Number);
      if (
        now.getHours() === hours &&
        now.getMinutes() === minutes &&
        !progress.completedToday
      ) {
        if (Notification.permission === "granted") {
          new Notification("📖 تذكير بالورد اليومي", {
            body: "حان وقت قراءة وردك اليومي من القرآن الكريم",
            icon: "/favicon.ico",
          });
        }
      }
    };

    const interval = setInterval(checkReminder, 60000);
    return () => clearInterval(interval);
  }, [config.reminderEnabled, config.reminderTime, progress.completedToday]);

  const updateConfig = useCallback((newConfig: Partial<WirdConfig>) => {
    setConfig((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const markTodayComplete = useCallback(() => {
    const today = new Date().toDateString();
    setProgress((prev) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const isConsecutive = prev.lastReadDate === yesterday.toDateString();
      return {
        ...prev,
        completedToday: true,
        lastReadDate: today,
        streak: isConsecutive ? prev.streak + 1 : 1,
        totalDaysCompleted: prev.totalDaysCompleted + 1,
      };
    });
  }, []);

  const updateCurrentPosition = useCallback((surah: number, ayah: number) => {
    setProgress((prev) => ({
      ...prev,
      currentSurah: surah,
      currentAyah: ayah,
    }));
  }, []);

  const enableReminder = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        updateConfig({ reminderEnabled: true });
        return true;
      }
    }
    return false;
  }, [updateConfig]);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return {
    config,
    progress,
    updateConfig,
    markTodayComplete,
    updateCurrentPosition,
    enableReminder,
    resetProgress,
  };
}
