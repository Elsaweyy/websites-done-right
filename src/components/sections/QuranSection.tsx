import { useState } from "react";
import { BookOpen, Play, Pause, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const surahs = [
  { id: 1, name: "الفاتحة", verses: 7, type: "مكية" },
  { id: 2, name: "البقرة", verses: 286, type: "مدنية" },
  { id: 3, name: "آل عمران", verses: 200, type: "مدنية" },
  { id: 4, name: "النساء", verses: 176, type: "مدنية" },
  { id: 5, name: "المائدة", verses: 120, type: "مدنية" },
  { id: 6, name: "الأنعام", verses: 165, type: "مكية" },
  { id: 7, name: "الأعراف", verses: 206, type: "مكية" },
  { id: 8, name: "الأنفال", verses: 75, type: "مدنية" },
  { id: 9, name: "التوبة", verses: 129, type: "مدنية" },
  { id: 10, name: "يونس", verses: 109, type: "مكية" },
  { id: 11, name: "هود", verses: 123, type: "مكية" },
  { id: 12, name: "يوسف", verses: 111, type: "مكية" },
  { id: 112, name: "الإخلاص", verses: 4, type: "مكية" },
  { id: 113, name: "الفلق", verses: 5, type: "مكية" },
  { id: 114, name: "الناس", verses: 6, type: "مكية" },
];

const fatihaVerses = [
  "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
  "الرَّحْمَٰنِ الرَّحِيمِ",
  "مَالِكِ يَوْمِ الدِّينِ",
  "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
  "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
  "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
];

export function QuranSection() {
  const [selectedSurah, setSelectedSurah] = useState(surahs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredSurahs = surahs.filter((surah) =>
    surah.name.includes(searchQuery)
  );

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">القرآن الكريم</h2>
            <p className="text-muted-foreground">اقرأ واستمع للقرآن الكريم</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Surah List */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-arabic">قائمة السور</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="ابحث عن سورة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {filteredSurahs.map((surah) => (
                    <button
                      key={surah.id}
                      onClick={() => setSelectedSurah(surah)}
                      className={`w-full p-3 rounded-lg text-right transition-all flex items-center justify-between ${
                        selectedSurah.id === surah.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          selectedSurah.id === surah.id
                            ? "bg-primary-foreground/20"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {surah.type}
                      </span>
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-bold font-arabic">{surah.name}</p>
                          <p className="text-xs opacity-75">{surah.verses} آية</p>
                        </div>
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            selectedSurah.id === surah.id
                              ? "bg-primary-foreground/20"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {surah.id}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Surah Content */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-center">
                  <CardTitle className="text-2xl font-arabic">{selectedSurah.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedSurah.verses} آية - {selectedSurah.type}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="rounded-full"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <p className="text-xl font-arabic text-primary">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </p>
              </div>
              <ScrollArea className="h-[350px]">
                <div className="space-y-4 text-right leading-loose">
                  {fatihaVerses.map((verse, index) => (
                    <p
                      key={index}
                      className="text-xl md:text-2xl font-arabic text-foreground hover:text-primary transition-colors cursor-pointer p-3 rounded-lg hover:bg-primary/5"
                    >
                      {verse}
                      <span className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary/10 text-primary text-sm">
                        {index + 1}
                      </span>
                    </p>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
