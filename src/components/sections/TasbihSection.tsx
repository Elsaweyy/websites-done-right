import { useState } from "react";
import { RotateCcw, Volume2, VolumeX, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const tasbihOptions = [
  { id: 1, text: "سُبْحَانَ اللَّهِ", translation: "سبحان الله" },
  { id: 2, text: "الْحَمْدُ لِلَّهِ", translation: "الحمد لله" },
  { id: 3, text: "اللَّهُ أَكْبَرُ", translation: "الله أكبر" },
  { id: 4, text: "لَا إِلَهَ إِلَّا اللَّهُ", translation: "لا إله إلا الله" },
  { id: 5, text: "أَسْتَغْفِرُ اللَّهَ", translation: "أستغفر الله" },
  { id: 6, text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ", translation: "لا حول ولا قوة إلا بالله" },
];

const targets = [33, 99, 100, 500, 1000];

export function TasbihSection() {
  const [count, setCount] = useState(0);
  const [selectedTasbih, setSelectedTasbih] = useState(tasbihOptions[0]);
  const [target, setTarget] = useState(33);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const handleCount = () => {
    if (soundEnabled) {
      // Simple click sound using Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.1;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    }
    setCount((prev) => prev + 1);
  };

  const resetCount = () => {
    setCount(0);
  };

  const progress = Math.min((count / target) * 100, 100);
  const isComplete = count >= target;

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <span className="text-3xl">📿</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary font-arabic">السبحة الإلكترونية</h2>
              <p className="text-muted-foreground">عداد التسبيح</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
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
                  <p className="text-sm font-bold mb-2">اختر الذكر:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {tasbihOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSelectedTasbih(option)}
                        className={`p-2 rounded-lg text-sm transition-all ${
                          selectedTasbih.id === option.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        {option.translation}
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
              <p className="text-2xl font-arabic text-primary mb-2">{selectedTasbih.text}</p>
              <div className="relative">
                <p
                  className={`text-8xl font-bold transition-all ${
                    isComplete ? "text-primary animate-pulse" : "text-foreground"
                  }`}
                >
                  {count}
                </p>
                <p className="text-muted-foreground mt-2">
                  الهدف: {target}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Counter Button */}
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={handleCount}
              className={`w-48 h-48 rounded-full transition-all duration-200 flex items-center justify-center text-6xl shadow-2xl active:scale-95 ${
                isComplete
                  ? "bg-gradient-to-br from-primary to-primary/80"
                  : "bg-gradient-to-br from-primary to-primary/90"
              }`}
              style={{
                boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.5)",
              }}
            >
              <span className="text-primary-foreground">📿</span>
            </button>

            <Button
              variant="outline"
              size="lg"
              onClick={resetCount}
              className="gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              إعادة العد
            </Button>
          </div>

          {/* Stats */}
          {isComplete && (
            <Card className="mt-6 bg-primary/10 border-primary/30">
              <CardContent className="p-4 text-center">
                <p className="text-lg font-arabic text-primary">
                  ما شاء الله! أتممت {target} تسبيحة 🎉
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
