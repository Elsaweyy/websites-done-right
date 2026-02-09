import { useState, useEffect } from "react";
import { Clock, MapPin, Sunrise, Sun, CloudSun, Sunset, Moon, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePrayerTimes } from "@/hooks/usePrayerTimes";

const prayerIcons: Record<string, React.ReactNode> = {
  الفجر: <Sunrise className="h-6 w-6" />,
  الشروق: <Sun className="h-6 w-6" />,
  الظهر: <Sun className="h-6 w-6" />,
  العصر: <CloudSun className="h-6 w-6" />,
  المغرب: <Sunset className="h-6 w-6" />,
  العشاء: <Moon className="h-6 w-6" />,
};

export function PrayerTimesSection() {
  const { prayerTimes, loading, error, locationPermission, requestLocation, getNextPrayer } = usePrayerTimes();
  const [currentTime, setCurrentTime] = useState(new Date());
  const nextPrayer = getNextPrayer();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const prayers = prayerTimes
    ? [
        { name: "الفجر", time: prayerTimes.fajr },
        { name: "الشروق", time: prayerTimes.sunrise },
        { name: "الظهر", time: prayerTimes.dhuhr },
        { name: "العصر", time: prayerTimes.asr },
        { name: "المغرب", time: prayerTimes.maghrib },
        { name: "العشاء", time: prayerTimes.isha },
      ]
    : [];

  const isPrayerPassed = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const prayerDate = new Date();
    prayerDate.setHours(hours, minutes, 0, 0);
    return currentTime > prayerDate;
  };

  if (loading) {
    return (
      <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="text-center">
              <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground font-arabic">جاري تحميل أوقات الصلاة...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <Clock className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">أوقات الصلاة</h2>
            <p className="text-muted-foreground">مواقيت الصلاة حسب موقعك</p>
          </div>
        </div>

        {/* Location & Date Card */}
        <Card className="mb-6 bg-gradient-to-l from-primary/10 to-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-bold text-lg font-arabic">{prayerTimes?.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {prayerTimes?.hijriDate} | {prayerTimes?.date}
                  </p>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-4xl font-bold text-primary">
                  {currentTime.toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={requestLocation}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                تحديث الموقع
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Prayer Card */}
        {nextPrayer && (
          <Card className="mb-6 bg-primary text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">الصلاة القادمة</p>
                  <p className="text-3xl font-bold font-arabic">{nextPrayer.name}</p>
                </div>
                <div className="text-left">
                  <p className="text-3xl font-bold">{nextPrayer.time}</p>
                  <p className="text-sm opacity-80">متبقي: {nextPrayer.remaining}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Prayer Times Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {prayers.map((prayer) => {
            const isPassed = isPrayerPassed(prayer.time);
            const isNext = nextPrayer?.name === prayer.name;
            
            return (
              <Card
                key={prayer.name}
                className={`transition-all ${
                  isNext
                    ? "ring-2 ring-primary bg-primary/5"
                    : isPassed
                    ? "opacity-60"
                    : ""
                }`}
              >
                <CardContent className="p-4 text-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                      isNext
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {prayerIcons[prayer.name]}
                  </div>
                  <h3 className="font-bold font-arabic text-lg mb-1">{prayer.name}</h3>
                  <p
                    className={`text-2xl font-bold ${
                      isNext ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {prayer.time}
                  </p>
                  {isPassed && !isNext && (
                    <span className="text-xs text-muted-foreground">انتهى</span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Calculation Method Note */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          يتم حساب أوقات الصلاة وفق طريقة رابطة العالم الإسلامي
        </p>
      </div>
    </section>
  );
}
