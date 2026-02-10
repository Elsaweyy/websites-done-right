import { useState } from "react";
import { Search, BookOpen, Heart, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Dua {
  id: number;
  text: string;
  source: string;
  category: string;
}

const duaCategories = [
  { id: "all", label: "الكل", icon: "📚" },
  { id: "morning", label: "الصباح", icon: "🌅" },
  { id: "evening", label: "المساء", icon: "🌙" },
  { id: "food", label: "الطعام", icon: "🍽️" },
  { id: "travel", label: "السفر", icon: "✈️" },
  { id: "rain", label: "المطر", icon: "🌧️" },
  { id: "sick", label: "المرض", icon: "🏥" },
  { id: "anxiety", label: "الهم والحزن", icon: "💙" },
  { id: "sleep", label: "النوم", icon: "😴" },
  { id: "mosque", label: "المسجد", icon: "🕌" },
  { id: "general", label: "عامة", icon: "🤲" },
];

const duaData: Dua[] = [
  // أدعية الصباح
  { id: 1, text: "اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ النُّشُورُ", source: "رواه الترمذي", category: "morning" },
  { id: 2, text: "أَصْبَحْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفاً مُسْلِماً وَمَا كَانَ مِنَ الْمُشْرِكِينَ", source: "رواه أحمد", category: "morning" },
  { id: 3, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْعَافِيَةَ فِي الدُّنْيَا وَالْآخِرَةِ", source: "رواه ابن ماجه", category: "morning" },
  
  // أدعية المساء
  { id: 4, text: "اللَّهُمَّ بِكَ أَمْسَيْنَا، وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ، وَإِلَيْكَ الْمَصِيرُ", source: "رواه الترمذي", category: "evening" },
  { id: 5, text: "أَمْسَيْنَا عَلَى فِطْرَةِ الإِسْلاَمِ، وَعَلَى كَلِمَةِ الإِخْلاَصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ", source: "رواه أحمد", category: "evening" },
  
  // أدعية الطعام
  { id: 6, text: "بِسْمِ اللَّهِ", source: "عند بدء الطعام", category: "food" },
  { id: 7, text: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنِي هَذَا، وَرَزَقَنِيهِ مِنْ غَيْرِ حَوْلٍ مِنِّي وَلا قُوَّةٍ", source: "رواه الترمذي", category: "food" },
  
  // أدعية السفر
  { id: 8, text: "اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، اللَّهُ أَكْبَرُ، سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ", source: "رواه مسلم", category: "travel" },
  { id: 9, text: "اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى، وَمِنَ الْعَمَلِ مَا تَرْضَى", source: "رواه مسلم", category: "travel" },
  
  // أدعية المطر
  { id: 10, text: "اللَّهُمَّ صَيِّبًا نَافِعًا", source: "رواه البخاري", category: "rain" },
  { id: 11, text: "مُطِرْنَا بِفَضْلِ اللَّهِ وَرَحْمَتِهِ", source: "متفق عليه", category: "rain" },
  
  // أدعية المرض
  { id: 12, text: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَأْسَ، اشْفِ أَنْتَ الشَّافِي، لَا شِفَاءَ إِلَّا شِفَاؤُكَ، شِفَاءً لَا يُغَادِرُ سَقَمًا", source: "متفق عليه", category: "sick" },
  { id: 13, text: "أَسْأَلُ اللَّهَ الْعَظِيمَ رَبَّ الْعَرْشِ الْعَظِيمِ أَنْ يَشْفِيَكَ", source: "رواه الترمذي - 7 مرات", category: "sick" },
  
  // أدعية الهم والحزن
  { id: 14, text: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ", source: "رواه البخاري", category: "anxiety" },
  { id: 15, text: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ", source: "دعاء يونس عليه السلام", category: "anxiety" },
  { id: 16, text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", source: "سورة آل عمران", category: "anxiety" },
  
  // أدعية النوم
  { id: 17, text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا", source: "رواه البخاري", category: "sleep" },
  { id: 18, text: "اللَّهُمَّ قِنِي عَذَابَكَ يَوْمَ تَبْعَثُ عِبَادَكَ", source: "رواه أبو داود - 3 مرات", category: "sleep" },
  
  // أدعية المسجد
  { id: 19, text: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ", source: "عند دخول المسجد - رواه مسلم", category: "mosque" },
  { id: 20, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ", source: "عند الخروج من المسجد - رواه مسلم", category: "mosque" },
  
  // أدعية عامة
  { id: 21, text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", source: "سورة البقرة - 201", category: "general" },
  { id: 22, text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", source: "سورة طه", category: "general" },
  { id: 23, text: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً إِنَّكَ أَنتَ الْوَهَّابُ", source: "سورة آل عمران - 8", category: "general" },
  { id: 24, text: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى", source: "رواه مسلم", category: "general" },
  { id: 25, text: "رَبِّ زِدْنِي عِلْمًا", source: "سورة طه - 114", category: "general" },
];

export function DuaSection() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<number[]>(() => {
    const saved = localStorage.getItem("dua_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const updated = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("dua_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredDuas = duaData.filter(dua => {
    const matchCategory = activeCategory === "all" || dua.category === activeCategory;
    const matchSearch = dua.text.includes(searchQuery) || dua.source.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const shareDua = async (dua: Dua) => {
    const text = `${dua.text}\n\n📖 ${dua.source}`;
    if (navigator.share) {
      try { await navigator.share({ title: "دعاء", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">مكتبة الأدعية</h2>
            <p className="text-muted-foreground">أدعية من القرآن والسنة</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="ابحث عن دعاء..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-right"
          />
        </div>

        {/* Categories */}
        <ScrollArea className="w-full mb-6">
          <div className="flex gap-2 pb-2">
            {duaCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? "bg-primary text-primary-foreground shadow-lg"
                    : "bg-card border hover:bg-muted"
                }`}
              >
                <span>{cat.icon}</span>
                <span className="text-sm font-bold">{cat.label}</span>
              </button>
            ))}
          </div>
        </ScrollArea>

        {/* Duas List */}
        <div className="space-y-4">
          {filteredDuas.map(dua => (
            <Card key={dua.id} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-5">
                <p className="text-xl font-arabic leading-loose text-foreground mb-3">
                  {dua.text}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(dua.id)}
                      className={favorites.includes(dua.id) ? "text-red-500" : ""}
                    >
                      <Heart className={`h-4 w-4 ${favorites.includes(dua.id) ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => shareDua(dua)}>
                      <Star className="h-4 w-4" />
                      <span className="text-xs mr-1">مشاركة</span>
                    </Button>
                  </div>
                  <Badge variant="secondary">{dua.source}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredDuas.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>لا توجد أدعية مطابقة للبحث</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
