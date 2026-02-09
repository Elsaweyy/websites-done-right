import { useState, useEffect } from "react";

export interface PrayerTime {
  name: string;
  nameAr: string;
  time: string;
  icon: string;
}

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
  hijriDate: string;
  location: string;
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);

  const fetchPrayerTimes = async (latitude: number, longitude: number) => {
    try {
      const today = new Date();
      const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
      
      const response = await fetch(
        `https://api.aladhan.com/v1/timings/${dateStr}?latitude=${latitude}&longitude=${longitude}&method=5`
      );
      const data = await response.json();
      
      if (data.code === 200) {
        const timings = data.data.timings;
        const hijri = data.data.date.hijri;
        const readable = data.data.date.readable;
        
        // Get location name from coordinates
        let locationName = "موقعك الحالي";
        try {
          const geoResponse = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar`
          );
          const geoData = await geoResponse.json();
          locationName = geoData.city || geoData.locality || geoData.countryName || locationName;
        } catch {
          // Keep default location name
        }
        
        setPrayerTimes({
          fajr: timings.Fajr,
          sunrise: timings.Sunrise,
          dhuhr: timings.Dhuhr,
          asr: timings.Asr,
          maghrib: timings.Maghrib,
          isha: timings.Isha,
          date: readable,
          hijriDate: `${hijri.day} ${hijri.month.ar} ${hijri.year}`,
          location: locationName,
        });
      }
    } catch (err) {
      setError("فشل في تحميل أوقات الصلاة");
    } finally {
      setLoading(false);
    }
  };

  const requestLocation = () => {
    setLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission(true);
          fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setLocationPermission(false);
          // Default to Mecca coordinates
          fetchPrayerTimes(21.4225, 39.8262);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationPermission(false);
      // Default to Mecca coordinates
      fetchPrayerTimes(21.4225, 39.8262);
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const getNextPrayer = (): { name: string; time: string; remaining: string } | null => {
    if (!prayerTimes) return null;

    const now = new Date();
    const prayers = [
      { name: "الفجر", time: prayerTimes.fajr },
      { name: "الشروق", time: prayerTimes.sunrise },
      { name: "الظهر", time: prayerTimes.dhuhr },
      { name: "العصر", time: prayerTimes.asr },
      { name: "المغرب", time: prayerTimes.maghrib },
      { name: "العشاء", time: prayerTimes.isha },
    ];

    for (const prayer of prayers) {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerDate = new Date();
      prayerDate.setHours(hours, minutes, 0, 0);

      if (prayerDate > now) {
        const diff = prayerDate.getTime() - now.getTime();
        const hoursRemaining = Math.floor(diff / (1000 * 60 * 60));
        const minutesRemaining = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        return {
          name: prayer.name,
          time: prayer.time,
          remaining: hoursRemaining > 0 
            ? `${hoursRemaining} ساعة و ${minutesRemaining} دقيقة`
            : `${minutesRemaining} دقيقة`,
        };
      }
    }

    // If all prayers passed, next is Fajr tomorrow
    return {
      name: "الفجر",
      time: prayerTimes.fajr,
      remaining: "غداً",
    };
  };

  return { prayerTimes, loading, error, locationPermission, requestLocation, getNextPrayer };
}
