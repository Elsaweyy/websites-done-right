import { useState, useCallback } from "react";

const KHATMA_KEY = "noor_khatma_data";

export interface Khatma {
  id: number;
  startDate: string;
  completedDate: string;
  daysToComplete: number;
}

interface KhatmaData {
  currentPage: number;
  totalPages: number;
  khatmaList: Khatma[];
  currentStartDate: string;
}

const DEFAULT_DATA: KhatmaData = {
  currentPage: 0,
  totalPages: 604,
  khatmaList: [],
  currentStartDate: new Date().toISOString().split("T")[0],
};

export function useKhatma() {
  const [data, setData] = useState<KhatmaData>(() => {
    const saved = localStorage.getItem(KHATMA_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_DATA;
  });

  const save = useCallback((newData: KhatmaData) => {
    localStorage.setItem(KHATMA_KEY, JSON.stringify(newData));
    setData(newData);
  }, []);

  const addPages = useCallback((pages: number) => {
    setData(prev => {
      const newPage = Math.min(prev.currentPage + pages, prev.totalPages);
      const today = new Date().toISOString().split("T")[0];

      if (newPage >= prev.totalPages) {
        const startDate = prev.currentStartDate || today;
        const start = new Date(startDate);
        const end = new Date(today);
        const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);

        const newKhatma: Khatma = {
          id: prev.khatmaList.length + 1,
          startDate,
          completedDate: today,
          daysToComplete: days,
        };

        const updated: KhatmaData = {
          currentPage: 0,
          totalPages: 604,
          khatmaList: [...prev.khatmaList, newKhatma],
          currentStartDate: today,
        };
        localStorage.setItem(KHATMA_KEY, JSON.stringify(updated));
        return updated;
      }

      const updated = { ...prev, currentPage: newPage };
      localStorage.setItem(KHATMA_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetCurrent = useCallback(() => {
    save({
      ...data,
      currentPage: 0,
      currentStartDate: new Date().toISOString().split("T")[0],
    });
  }, [data, save]);

  const progress = Math.round((data.currentPage / data.totalPages) * 100);

  return {
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    khatmaList: data.khatmaList,
    progress,
    addPages,
    resetCurrent,
  };
}
