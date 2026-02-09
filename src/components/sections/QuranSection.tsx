import { useState, useRef, useEffect } from "react";
import { BookOpen, Play, Pause, ChevronLeft, ChevronRight, Search, Volume2, Book, Loader2, SkipBack, SkipForward, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { useSurahsList, useSurah, useTafsir, reciters } from "@/hooks/useQuranApi";

export function QuranSection() {
  const [selectedSurahNumber, setSelectedSurahNumber] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReciter, setSelectedReciter] = useState("ar.alafasy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const [showTafsir, setShowTafsir] = useState(false);
  const [selectedAyahForTafsir, setSelectedAyahForTafsir] = useState<number | null>(null);
  const [audioProgress, setAudioProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ayahRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const { surahs, loading: surahsLoading } = useSurahsList();
  const { surah, loading: surahLoading } = useSurah(selectedSurahNumber, selectedReciter);
  const { tafsir, loading: tafsirLoading, fetchTafsir } = useTafsir(selectedSurahNumber);

  // Filter surahs by search query
  const filteredSurahs = surahs.filter(
    (s) => s.name.includes(searchQuery) || s.englishName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle audio playback
  useEffect(() => {
    if (surah && surah.ayahs[currentAyahIndex]) {
      const ayah = surah.ayahs[currentAyahIndex];
      if (audioRef.current) {
        audioRef.current.src = ayah.audio;
        if (isPlaying) {
          audioRef.current.play();
        }
      }
      // Scroll to current ayah
      ayahRefs.current[currentAyahIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentAyahIndex, surah, selectedReciter]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Reset when surah changes
  useEffect(() => {
    setCurrentAyahIndex(0);
    setIsPlaying(false);
    setAudioProgress(0);
  }, [selectedSurahNumber, selectedReciter]);

  const handleAudioEnded = () => {
    if (surah && currentAyahIndex < surah.ayahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(0);
    }
  };

  const handleAudioTimeUpdate = () => {
    if (audioRef.current) {
      const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setAudioProgress(progress || 0);
    }
  };

  const playAyah = (index: number) => {
    setCurrentAyahIndex(index);
    setIsPlaying(true);
  };

  const handleAyahClick = (ayahNumber: number) => {
    setSelectedAyahForTafsir(ayahNumber);
    setShowTafsir(true);
    if (tafsir.length === 0) {
      fetchTafsir();
    }
  };

  const goToNextSurah = () => {
    if (selectedSurahNumber < 114) {
      setSelectedSurahNumber((prev) => prev + 1);
    }
  };

  const goToPrevSurah = () => {
    if (selectedSurahNumber > 1) {
      setSelectedSurahNumber((prev) => prev - 1);
    }
  };

  const skipForward = () => {
    if (surah && currentAyahIndex < surah.ayahs.length - 1) {
      setCurrentAyahIndex((prev) => prev + 1);
    }
  };

  const skipBackward = () => {
    if (currentAyahIndex > 0) {
      setCurrentAyahIndex((prev) => prev - 1);
    }
  };

  const selectedTafsirText = tafsir.find((t) => t.ayah === selectedAyahForTafsir)?.text;

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          onEnded={handleAudioEnded}
          onTimeUpdate={handleAudioTimeUpdate}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">القرآن الكريم</h2>
            <p className="text-muted-foreground">اقرأ واستمع للقرآن الكريم - 114 سورة</p>
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
              {surahsLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-2">
                    {filteredSurahs.map((s) => (
                      <button
                        key={s.number}
                        onClick={() => setSelectedSurahNumber(s.number)}
                        className={`w-full p-3 rounded-lg text-right transition-all flex items-center justify-between ${
                          selectedSurahNumber === s.number
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/50 hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            selectedSurahNumber === s.number
                              ? "bg-primary-foreground/20"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          {s.revelationType === "Meccan" ? "مكية" : "مدنية"}
                        </span>
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-bold font-arabic">{s.name}</p>
                            <p className="text-xs opacity-75">{s.numberOfAyahs} آية</p>
                          </div>
                          <span
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              selectedSurahNumber === s.number
                                ? "bg-primary-foreground/20"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {s.number}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>

          {/* Surah Content */}
          <Card className="lg:col-span-2">
            <CardHeader className="border-b">
              <div className="flex flex-col gap-4">
                {/* Navigation & Title */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNextSurah}
                      disabled={selectedSurahNumber >= 114}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPrevSurah}
                      disabled={selectedSurahNumber <= 1}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="text-center">
                    <CardTitle className="text-2xl font-arabic">
                      {surah?.name || "جاري التحميل..."}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {surah?.numberOfAyahs} آية -{" "}
                      {surah?.revelationType === "Meccan" ? "مكية" : "مدنية"}
                    </p>
                  </div>
                  <Select value={selectedReciter} onValueChange={setSelectedReciter}>
                    <SelectTrigger className="w-[180px]">
                      <Volume2 className="h-4 w-4 ml-2" />
                      <SelectValue placeholder="اختر القارئ" />
                    </SelectTrigger>
                    <SelectContent>
                      {reciters.map((reciter) => (
                        <SelectItem key={reciter.id} value={reciter.id}>
                          {reciter.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipBackward}
                    disabled={currentAyahIndex <= 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="default"
                    size="icon"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="rounded-full h-12 w-12"
                    disabled={surahLoading}
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 mr-[-2px]" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={skipForward}
                    disabled={!surah || currentAyahIndex >= surah.ayahs.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <div className="flex-1">
                    <Slider
                      value={[audioProgress]}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground min-w-[60px]">
                    آية {currentAyahIndex + 1} / {surah?.ayahs.length || 0}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {surahLoading ? (
                <div className="flex items-center justify-center h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 text-right leading-loose">
                    {/* Bismillah for all surahs except At-Tawbah (9) */}
                    {selectedSurahNumber !== 9 && selectedSurahNumber !== 1 && (
                      <p className="text-center text-xl md:text-2xl font-arabic text-primary font-bold mb-6 p-3">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                    )}
                    {surah?.ayahs.map((ayah, index) => (
                      <p
                        key={ayah.number}
                        ref={(el) => (ayahRefs.current[index] = el)}
                        onClick={() => handleAyahClick(ayah.numberInSurah)}
                        className={`text-xl md:text-2xl font-arabic text-foreground transition-all cursor-pointer p-3 rounded-lg group ${
                          currentAyahIndex === index && isPlaying
                            ? "bg-primary/20 text-primary"
                            : "hover:bg-primary/5 hover:text-primary"
                        }`}
                      >
                        {ayah.text}
                        <span
                          className="inline-flex items-center justify-center w-8 h-8 mr-2 rounded-full bg-primary/10 text-primary text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAyah(index);
                          }}
                        >
                          {ayah.numberInSurah}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 mr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAyahClick(ayah.numberInSurah);
                          }}
                        >
                          <Book className="h-4 w-4" />
                          <span className="text-xs mr-1">التفسير</span>
                        </Button>
                      </p>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tafsir Dialog */}
        <Dialog open={showTafsir} onOpenChange={setShowTafsir}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-arabic flex items-center gap-2">
                <Book className="h-5 w-5 text-primary" />
                تفسير الآية {selectedAyahForTafsir}
              </DialogTitle>
              <DialogDescription>
                من تفسير الميسر
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[60vh] mt-4">
              {tafsirLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : selectedTafsirText ? (
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg">
                    <p className="text-lg font-arabic text-primary leading-loose">
                      {surah?.ayahs.find((a) => a.numberInSurah === selectedAyahForTafsir)?.text}
                    </p>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-2 text-primary">التفسير:</h4>
                    <p className="text-foreground leading-loose font-arabic">
                      {selectedTafsirText}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  لا يوجد تفسير متاح لهذه الآية
                </p>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
