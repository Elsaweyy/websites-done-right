import { useState, useRef, useEffect } from "react";
import { Heart, Volume2, VolumeX, RotateCcw, Settings, Share2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { usePointsSync } from "@/hooks/usePointsSync";
import { useChallenges } from "@/hooks/useChallenges";

const salatFormulas = [
  { id: 1, text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّد", short: "اللهم صل وسلم على نبينا محمد" },
  { id: 2, text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ", short: "اللهم صل على محمد وآله" },
  { id: 3, text: "صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ", short: "صلى الله عليه وسلم" },
  { id: 4, text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ", short: "الصلاة الإبراهيمية" },
];

const targets = [33, 99, 100, 500, 1000];

export function SalatAlaNabiSection() {
  const [count, setCount] = useState(0);
  const [selectedFormula, setSelectedFormula] = useState(salatFormulas[0]);
  const [target, setTarget] = useState(100);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const { addTasbih } = usePointsSync();
  const { incrementChallenge } = useChallenges();
  const syncedRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playSound = () => {
    if (!soundEnabled) return;
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    oscillator.frequency.value = 800;
    gainNode.gain.value = 0.1;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.05);
  };

  const handleCount = () => {
    playSound();
    setCount((prev) => {
      const newCount = prev + 1;
      incrementChallenge("tasbih", 1);
      if (newCount >= target && !syncedRef.current) {
        syncedRef.current = true;
        addTasbih(target);
        toast({
          title: "ماشاء الله! 🎉",
          description: `لقد أكملت هدفك ${target} صلاة على النبي ﷺ`,
        });
      }
      return newCount;
    });
  };

  const resetCount = () => {
    setCount(0);
    syncedRef.current = false;
  };

  const progress = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary font-arabic">الصلاة على النبي ﷺ</h2>
              <p className="text-muted-foreground">أفضل ما يتقرب به العبد إلى ربه</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {/* Settings Panel */}
          {showSettings && (
            <Card className="mb-6">
              <CardContent className="p-4 space-y-4">
                <div>
                  <p className="text-sm font-bold mb-2">اختر الصيغة:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {salatFormulas.map((formula) => (
                      <button
                        key={formula.id}
                        onClick={() => setSelectedFormula(formula)}
                        className={`p-2 rounded-lg text-sm transition-all ${
                          selectedFormula.id === formula.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {formula.short}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold mb-2">الهدف:</p>
                  <div className="flex gap-2 flex-wrap">
                    {targets.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTarget(t)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          target === t
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Hadith */}
                <div className="p-3 bg-primary/5 rounded-lg">
                  <p className="text-xs font-arabic text-primary leading-relaxed">
                    قال رسول الله ﷺ: "من صلى عليّ صلاة واحدة صلى الله عليه بها عشراً" - رواه مسلم
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Counter Display */}
          <Card className="mb-6 overflow-hidden">
            <div
              className="h-2 bg-primary/20 transition-all duration-300"
              style={{ width: `${progress}%`, backgroundColor: isComplete ? "hsl(var(--primary))" : undefined }}
            />
            <CardContent className="p-8 text-center">
              <p className="text-2xl font-arabic text-primary mb-2">{selectedFormula.text}</p>
              <div className="relative">
                <p className={`text-8xl font-bold transition-all ${isComplete ? "text-primary animate-pulse" : "text-foreground"}`}>
                  {count}
                </p>
                <p className="text-muted-foreground mt-2">الهدف: {target}</p>
              </div>
            </CardContent>
          </Card>

          {/* Counter Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleCount}
              className="w-48 h-48 rounded-full transition-all duration-200 flex items-center justify-center shadow-2xl active:scale-95 bg-gradient-to-br from-primary to-primary/80"
              style={{ boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.5)" }}
            >
              <Heart className="h-16 w-16 text-primary-foreground" />
            </button>

            <div className="flex gap-3">
              <Button variant="outline" size="lg" onClick={resetCount} className="gap-2">
                <RotateCcw className="h-5 w-5" />
                إعادة العد
              </Button>
              <Button variant="outline" size="lg" onClick={async () => {
                const text = `🌟 صليت على النبي ﷺ ${count} مرة\n\n${selectedFormula.text}\n\n#الصلاة_على_النبي`;
                if (navigator.share) {
                  try { await navigator.share({ title: "الصلاة على النبي", text }); } catch {}
                } else {
                  await navigator.clipboard.writeText(text);
                  toast({ title: "تم النسخ", description: "تم نسخ النص إلى الحافظة" });
                }
              }} className="gap-2">
                <Share2 className="h-5 w-5" />
                مشاركة
              </Button>
            </div>
          </div>

          {/* Completion */}
          {isComplete && (
            <Card className="mt-6 bg-primary/10 border-primary/30">
              <CardContent className="p-4 text-center">
                <p className="text-lg font-arabic text-primary">
                  ما شاء الله! أتممت {target} صلاة على النبي ﷺ 🎉
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
