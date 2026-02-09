import { useState, useRef, useEffect } from "react";
import { Heart, Play, Pause, Volume2, RefreshCw, Share2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

const salatFormulas = [
  {
    id: 1,
    text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد",
    translation: "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
  },
  {
    id: 2,
    text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    translation: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad",
  },
  {
    id: 3,
    text: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
    translation: "Salla Allahu 'alayhi wa sallam",
  },
  {
    id: 4,
    text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ",
    translation: "Allahumma salli 'ala Muhammad wa 'ala ali Muhammad kama sallayta 'ala Ibrahim",
  },
];

const dailyGoals = [10, 50, 100, 500, 1000];

export function SalatAlaNabiSection() {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem("salatAlaNabi_count");
    return saved ? parseInt(saved) : 0;
  });
  const [selectedFormula, setSelectedFormula] = useState(0);
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem("salatAlaNabi_goal");
    return saved ? parseInt(saved) : 100;
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [todayTotal, setTodayTotal] = useState(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem("salatAlaNabi_today");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.date === today) {
        return parsed.count;
      }
    }
    return 0;
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("salatAlaNabi_count", count.toString());
    localStorage.setItem("salatAlaNabi_goal", goal.toString());
    
    const today = new Date().toDateString();
    localStorage.setItem("salatAlaNabi_today", JSON.stringify({
      date: today,
      count: todayTotal
    }));
  }, [count, goal, todayTotal]);

  const playSound = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1000, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  };

  const incrementCount = () => {
    setCount((prev) => prev + 1);
    setTodayTotal((prev) => prev + 1);
    playSound();

    if ((count + 1) === goal) {
      toast({
        title: "ماشاء الله! 🎉",
        description: `لقد أكملت هدفك ${goal} صلاة على النبي`,
      });
    }
  };

  const resetCount = () => {
    setCount(0);
  };

  const progress = Math.min((count / goal) * 100, 100);

  const shareAchievement = async () => {
    const text = `🌟 صليت على النبي ﷺ ${todayTotal} مرة اليوم\n\n${salatFormulas[selectedFormula].text}\n\n#الصلاة_على_النبي`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "الصلاة على النبي",
          text: text,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast({
        title: "تم النسخ",
        description: "تم نسخ النص إلى الحافظة",
      });
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">الصلاة على النبي ﷺ</h2>
            <p className="text-muted-foreground">أفضل ما يتقرب به العبد إلى ربه</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Main Counter */}
          <Card className="lg:col-span-2">
            <CardContent className="p-8">
              {/* Selected Formula */}
              <div className="text-center mb-8">
                <p className="text-2xl md:text-3xl font-arabic text-primary leading-loose mb-2">
                  {salatFormulas[selectedFormula].text}
                </p>
                <p className="text-sm text-muted-foreground">
                  {salatFormulas[selectedFormula].translation}
                </p>
              </div>

              {/* Counter Display */}
              <div
                className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-2xl mb-6"
                onClick={incrementCount}
              >
                <div className="text-center text-primary-foreground">
                  <p className="text-5xl font-bold">{count}</p>
                  <p className="text-sm opacity-80">اضغط للتسبيح</p>
                </div>
              </div>

              {/* Progress */}
              <div className="max-w-md mx-auto mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">الهدف: {goal}</span>
                  <span className="text-primary font-bold">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              {/* Today's Total */}
              <div className="text-center mb-6">
                <p className="text-muted-foreground">
                  إجمالي اليوم: <span className="text-primary font-bold">{todayTotal}</span>
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Button variant="outline" onClick={resetCount}>
                  <RefreshCw className="h-4 w-4 ml-2" />
                  إعادة العداد
                </Button>
                <Button variant="outline" onClick={shareAchievement}>
                  <Share2 className="h-4 w-4 ml-2" />
                  مشاركة
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Formulas Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">صيغ الصلاة على النبي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {salatFormulas.map((formula, index) => (
                <button
                  key={formula.id}
                  onClick={() => setSelectedFormula(index)}
                  className={`w-full p-4 rounded-lg text-right transition-all ${
                    selectedFormula === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 hover:bg-muted"
                  }`}
                >
                  <p className="font-arabic text-lg">{formula.text}</p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Goals Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="font-arabic">اختر هدفك اليومي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {dailyGoals.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`p-4 rounded-lg text-center transition-all ${
                      goal === g
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <p className="text-2xl font-bold">{g}</p>
                    <p className="text-xs opacity-75">مرة</p>
                  </button>
                ))}
              </div>

              {/* Hadith */}
              <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                <p className="text-sm font-arabic text-primary leading-relaxed">
                  قال رسول الله ﷺ: "من صلى عليّ صلاة واحدة صلى الله عليه بها عشراً"
                </p>
                <p className="text-xs text-muted-foreground mt-2">رواه مسلم</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
