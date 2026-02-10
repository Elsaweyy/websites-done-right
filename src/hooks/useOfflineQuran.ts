import { useState, useEffect, useCallback } from "react";

const CACHE_KEY = "quran_offline_cache";
const CACHE_META_KEY = "quran_offline_meta";

interface CachedSurah {
  number: number;
  name: string;
  ayahs: { number: number; numberInSurah: number; text: string }[];
}

interface CacheMeta {
  cachedSurahs: number[];
  lastUpdated: number;
  totalSize: number;
}

export function useOfflineQuran() {
  const [cacheMeta, setCacheMeta] = useState<CacheMeta>(() => {
    const saved = localStorage.getItem(CACHE_META_KEY);
    return saved ? JSON.parse(saved) : { cachedSurahs: [], lastUpdated: 0, totalSize: 0 };
  });
  const [isCaching, setIsCaching] = useState(false);
  const [cacheProgress, setCacheProgress] = useState(0);

  const isSurahCached = useCallback((surahNumber: number) => {
    return cacheMeta.cachedSurahs.includes(surahNumber);
  }, [cacheMeta]);

  const getCachedSurah = useCallback((surahNumber: number): CachedSurah | null => {
    try {
      const data = localStorage.getItem(`${CACHE_KEY}_${surahNumber}`);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }, []);

  const cacheSurah = useCallback(async (surahNumber: number) => {
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
      const data = await response.json();
      if (data.code === 200) {
        const surahData: CachedSurah = {
          number: data.data.number,
          name: data.data.name,
          ayahs: data.data.ayahs.map((a: any) => ({
            number: a.number,
            numberInSurah: a.numberInSurah,
            text: a.text,
          })),
        };
        localStorage.setItem(`${CACHE_KEY}_${surahNumber}`, JSON.stringify(surahData));
        
        const newMeta: CacheMeta = {
          cachedSurahs: [...new Set([...cacheMeta.cachedSurahs, surahNumber])],
          lastUpdated: Date.now(),
          totalSize: cacheMeta.totalSize + JSON.stringify(surahData).length,
        };
        localStorage.setItem(CACHE_META_KEY, JSON.stringify(newMeta));
        setCacheMeta(newMeta);
        return true;
      }
    } catch {
      return false;
    }
    return false;
  }, [cacheMeta]);

  const cacheAllSurahs = useCallback(async () => {
    setIsCaching(true);
    setCacheProgress(0);
    for (let i = 1; i <= 114; i++) {
      if (!isSurahCached(i)) {
        await cacheSurah(i);
        // Small delay to not overload the API
        await new Promise(r => setTimeout(r, 200));
      }
      setCacheProgress(Math.round((i / 114) * 100));
    }
    setIsCaching(false);
  }, [cacheSurah, isSurahCached]);

  const clearCache = useCallback(() => {
    for (let i = 1; i <= 114; i++) {
      localStorage.removeItem(`${CACHE_KEY}_${i}`);
    }
    localStorage.removeItem(CACHE_META_KEY);
    setCacheMeta({ cachedSurahs: [], lastUpdated: 0, totalSize: 0 });
  }, []);

  const getCacheSize = useCallback(() => {
    const bytes = cacheMeta.totalSize;
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }, [cacheMeta]);

  return {
    cacheMeta,
    isCaching,
    cacheProgress,
    isSurahCached,
    getCachedSurah,
    cacheSurah,
    cacheAllSurahs,
    clearCache,
    getCacheSize,
  };
}
