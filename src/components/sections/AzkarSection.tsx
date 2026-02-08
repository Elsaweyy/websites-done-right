import { useState } from "react";
import { Sun, Moon, Star, Check, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

type AzkarCategory = "morning" | "evening" | "sleep";

interface Zikr {
  id: number;
  text: string;
  count: number;
  completed: number;
}

const azkarData: Record<AzkarCategory, Zikr[]> = {
  morning: [
    { id: 1, text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ", count: 1, completed: 0 },
    { id: 2, text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", count: 1, completed: 0 },
    { id: 3, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, completed: 0 },
    { id: 4, text: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", count: 10, completed: 0 },
    { id: 5, text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ", count: 100, completed: 0 },
  ],
  evening: [
    { id: 1, text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ", count: 1, completed: 0 },
    { id: 2, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", count: 1, completed: 0 },
    { id: 3, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَفْوَ وَالْعَافِيَةَ فِي الدُّنْيَا وَالآخِرَةِ", count: 3, completed: 0 },
    { id: 4, text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ", count: 100, completed: 0 },
  ],
  sleep: [
    { id: 1, text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", count: 1, completed: 0 },
    { id: 2, text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", count: 3, completed: 0 },
    { id: 3, text: "سُبْحَانَ اللَّهِ (33) وَالْحَمْدُ لِلَّهِ (33) وَاللَّهُ أَكْبَرُ (34)", count: 1, completed: 0 },
  ],
};

const categories = [
  { id: "morning" as AzkarCategory, label: "أذكار الصباح", icon: Sun, color: "from-amber-400 to-orange-500" },
  { id: "evening" as AzkarCategory, label: "أذكار المساء", icon: Moon, color: "from-indigo-400 to-purple-500" },
  { id: "sleep" as AzkarCategory, label: "أذكار النوم", icon: Star, color: "from-blue-400 to-cyan-500" },
];

export function AzkarSection() {
  const [activeCategory, setActiveCategory] = useState<AzkarCategory>("morning");
  const [azkar, setAzkar] = useState<Record<AzkarCategory, Zikr[]>>(azkarData);

  const currentAzkar = azkar[activeCategory];
  const totalCount = currentAzkar.reduce((acc, z) => acc + z.count, 0);
  const completedCount = currentAzkar.reduce((acc, z) => acc + z.completed, 0);
  const progress = (completedCount / totalCount) * 100;

  const handleZikrClick = (zikrId: number) => {
    setAzkar((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((z) =>
        z.id === zikrId && z.completed < z.count
          ? { ...z, completed: z.completed + 1 }
          : z
      ),
    }));
  };

  const resetAzkar = () => {
    setAzkar((prev) => ({
      ...prev,
      [activeCategory]: prev[activeCategory].map((z) => ({ ...z, completed: 0 })),
    }));
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <span className="text-3xl">🤲</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary font-arabic">الأذكار</h2>
              <p className="text-muted-foreground">حافظ على أذكارك اليومية</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetAzkar} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            إعادة
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-4 rounded-xl transition-all ${
                activeCategory === cat.id
                  ? `bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                  : "bg-card hover:bg-muted border"
              }`}
            >
              <cat.icon className={`h-6 w-6 mx-auto mb-2 ${activeCategory === cat.id ? "text-white" : "text-primary"}`} />
              <p className="font-bold text-sm font-arabic">{cat.label}</p>
            </button>
          ))}
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">التقدم</span>
              <span className="text-sm font-bold text-primary">
                {completedCount} / {totalCount}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        {/* Azkar List */}
        <div className="space-y-4">
          {currentAzkar.map((zikr) => {
            const isComplete = zikr.completed >= zikr.count;
            return (
              <Card
                key={zikr.id}
                className={`transition-all cursor-pointer ${
                  isComplete ? "bg-primary/10 border-primary/30" : "hover:shadow-md"
                }`}
                onClick={() => handleZikrClick(zikr.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                        isComplete ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {isComplete ? (
                        <Check className="h-6 w-6" />
                      ) : (
                        <span className="font-bold">
                          {zikr.completed}/{zikr.count}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-lg font-arabic leading-relaxed">{zikr.text}</p>
                      {zikr.count > 1 && (
                        <Badge variant="secondary" className="mt-2">
                          {zikr.count} مرة
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
