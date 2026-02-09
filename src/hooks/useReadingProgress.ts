import { useState, useEffect, useCallback } from "react";

interface ReadingProgress {
  surahNumber: number;
  ayahNumber: number;
  reciter: string;
  timestamp: number;
}

const STORAGE_KEY = "quran_reading_progress";

export function useReadingProgress() {
  const [lastPosition, setLastPosition] = useState<ReadingProgress | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const saveProgress = useCallback((surahNumber: number, ayahNumber: number, reciter: string) => {
    const progress: ReadingProgress = {
      surahNumber,
      ayahNumber,
      reciter,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    setLastPosition(progress);
  }, []);

  const clearProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setLastPosition(null);
  }, []);

  const getTimeAgo = useCallback(() => {
    if (!lastPosition) return "";
    
    const diff = Date.now() - lastPosition.timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `منذ ${days} يوم`;
    if (hours > 0) return `منذ ${hours} ساعة`;
    if (minutes > 0) return `منذ ${minutes} دقيقة`;
    return "الآن";
  }, [lastPosition]);

  return {
    lastPosition,
    saveProgress,
    clearProgress,
    getTimeAgo,
  };
}
