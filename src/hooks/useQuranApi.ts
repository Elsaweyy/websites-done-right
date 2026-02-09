import { useState, useEffect } from "react";

export interface Ayah {
  number: number;
  numberInSurah: number;
  text: string;
  audio: string;
  audioSecondary?: string[];
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface SurahWithAyahs extends Surah {
  ayahs: Ayah[];
}

export interface Tafsir {
  ayah: number;
  text: string;
}

// Fetch all surahs list
export function useSurahsList() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurahs = async () => {
      try {
        const response = await fetch("https://api.alquran.cloud/v1/surah");
        const data = await response.json();
        if (data.code === 200) {
          setSurahs(data.data);
        }
      } catch (err) {
        setError("فشل في تحميل قائمة السور");
      } finally {
        setLoading(false);
      }
    };
    fetchSurahs();
  }, []);

  return { surahs, loading, error };
}

// Fetch single surah with ayahs and audio
export function useSurah(surahNumber: number, reciter: string = "ar.alafasy") {
  const [surah, setSurah] = useState<SurahWithAyahs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurah = async () => {
      setLoading(true);
      try {
        // Fetch surah text and audio together
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/${reciter}`
        );
        const data = await response.json();
        if (data.code === 200) {
          setSurah(data.data);
        }
      } catch (err) {
        setError("فشل في تحميل السورة");
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [surahNumber, reciter]);

  return { surah, loading, error };
}

// Fetch tafsir for a surah
export function useTafsir(surahNumber: number) {
  const [tafsir, setTafsir] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTafsir = async () => {
    setLoading(true);
    try {
      // Using ar.muyassar tafsir
      const response = await fetch(
        `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.muyassar`
      );
      const data = await response.json();
      if (data.code === 200) {
        const tafsirData = data.data.ayahs.map((ayah: any) => ({
          ayah: ayah.numberInSurah,
          text: ayah.text,
        }));
        setTafsir(tafsirData);
      }
    } catch (err) {
      setError("فشل في تحميل التفسير");
    } finally {
      setLoading(false);
    }
  };

  return { tafsir, loading, error, fetchTafsir };
}

// Available reciters
export const reciters = [
  { id: "ar.alafasy", name: "مشاري العفاسي" },
  { id: "ar.abdurrahmaansudais", name: "عبدالرحمن السديس" },
  { id: "ar.abdulbasitmurattal", name: "عبدالباسط عبدالصمد" },
  { id: "ar.husary", name: "محمود خليل الحصري" },
  { id: "ar.minshawi", name: "محمد صديق المنشاوي" },
];
