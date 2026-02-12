import { useState, useCallback } from "react";

const KHATMA_KEY = "noor_khatma_data";

export interface Khatma {
  id: number;
  startDate: string;
  completedDate: string;
  daysToComplete: number;
  targetMonths?: number;
}

interface KhatmaData {
  currentPage: number;
  totalPages: number;
  khatmaList: Khatma[];
  currentStartDate: string;
  targetMonths: number;
}

const DEFAULT_DATA: KhatmaData = {
  currentPage: 0,
  totalPages: 604,
  khatmaList: [],
  currentStartDate: new Date().toISOString().split("T")[0],
  targetMonths: 1,
};

export function useKhatma() {
  const [data, setData] = useState<KhatmaData>(() => {
    const saved = localStorage.getItem(KHATMA_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_DATA, ...parsed };
    }
    return DEFAULT_DATA;
  });

  const save = useCallback((newData: KhatmaData) => {
    localStorage.setItem(KHATMA_KEY, JSON.stringify(newData));
    setData(newData);
  }, []);

  const setTargetMonths = useCallback((months: number) => {
    save({ ...data, targetMonths: months });
  }, [data, save]);

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
          targetMonths: prev.targetMonths,
        };

        const updated: KhatmaData = {
          currentPage: 0,
          totalPages: 604,
          khatmaList: [...prev.khatmaList, newKhatma],
          currentStartDate: today,
          targetMonths: prev.targetMonths,
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
  const dailyTarget = Math.ceil(data.totalPages / (data.targetMonths * 30));

  return {
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    khatmaList: data.khatmaList,
    progress,
    addPages,
    resetCurrent,
    targetMonths: data.targetMonths,
    setTargetMonths,
    dailyTarget,
  };
}
