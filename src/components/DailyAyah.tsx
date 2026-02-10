import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Share2, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const dailyAyahs = [
  { text: "إِنَّ مَعَ الْعُسْرِ يُسْرًا", surah: "الشرح", ayah: 6 },
  { text: "وَمَن يَتَوَكَّلْ عَلَى اللَّهِ فَهُوَ حَسْبُهُ", surah: "الطلاق", ayah: 3 },
  { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", surah: "البقرة", ayah: 152 },
  { text: "وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ", surah: "الضحى", ayah: 5 },
  { text: "رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي", surah: "طه", ayah: 25 },
  { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", surah: "طه", ayah: 114 },
  { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", surah: "البقرة", ayah: 153 },
  { text: "وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ", surah: "الإسراء", ayah: 82 },
  { text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ", surah: "آل عمران", ayah: 173 },
  { text: "وَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ ۖ لَّا إِلَٰهَ إِلَّا هُوَ الرَّحْمَٰنُ الرَّحِيمُ", surah: "البقرة", ayah: 163 },
  { text: "قُلْ لَن يُصِيبَنَا إِلَّا مَا كَتَبَ اللَّهُ لَنَا هُوَ مَوْلَانَا", surah: "التوبة", ayah: 51 },
  { text: "فَإِنَّ ذِكْرَى تَنفَعُ الْمُؤْمِنِينَ", surah: "الذاريات", ayah: 55 },
  { text: "وَمَا تَوْفِيقِي إِلَّا بِاللَّهِ ۚ عَلَيْهِ تَوَكَّلْتُ وَإِلَيْهِ أُنِيبُ", surah: "هود", ayah: 88 },
  { text: "سَيَجْعَلُ اللَّهُ بَعْدَ عُسْرٍ يُسْرًا", surah: "الطلاق", ayah: 7 },
  { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", surah: "الرعد", ayah: 28 },
  { text: "وَاللَّهُ خَيْرُ الرَّازِقِينَ", surah: "الجمعة", ayah: 11 },
  { text: "وَاصْبِرْ فَإِنَّ اللَّهَ لَا يُضِيعُ أَجْرَ الْمُحْسِنِينَ", surah: "هود", ayah: 115 },
  { text: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ", surah: "البقرة", ayah: 201 },
  { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", surah: "الطلاق", ayah: 2 },
  { text: "إِنَّ رَحْمَتَ اللَّهِ قَرِيبٌ مِّنَ الْمُحْسِنِينَ", surah: "الأعراف", ayah: 56 },
  { text: "فَفِرُّوا إِلَى اللَّهِ ۖ إِنِّي لَكُم مِّنْهُ نَذِيرٌ مُّبِينٌ", surah: "الذاريات", ayah: 50 },
  { text: "وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ", surah: "الحديد", ayah: 4 },
  { text: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا", surah: "البقرة", ayah: 286 },
  { text: "وَبَشِّرِ الصَّابِرِينَ", surah: "البقرة", ayah: 155 },
  { text: "ادْعُونِي أَسْتَجِبْ لَكُمْ", surah: "غافر", ayah: 60 },
  { text: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ", surah: "البقرة", ayah: 186 },
  { text: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ", surah: "البقرة", ayah: 153 },
  { text: "وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ", surah: "آل عمران", ayah: 134 },
  { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", surah: "الإخلاص", ayah: 1 },
  { text: "رَبِّ لَا تَذَرْنِي فَرْدًا وَأَنتَ خَيْرُ الْوَارِثِينَ", surah: "الأنبياء", ayah: 89 },
];

function getTodayAyah() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return dailyAyahs[dayOfYear % dailyAyahs.length];
}

export function DailyAyah() {
  const [open, setOpen] = useState(false);
  const ayah = getTodayAyah();

  useEffect(() => {
    const lastShown = localStorage.getItem("daily-ayah-date");
    const today = new Date().toDateString();
    if (lastShown !== today) {
      setOpen(true);
      localStorage.setItem("daily-ayah-date", today);
    }
  }, []);

  const shareAyah = async () => {
    const text = `${ayah.text}\n\n📖 ${ayah.surah} - آية ${ayah.ayah}`;
    if (navigator.share) {
      try { await navigator.share({ title: "آية اليوم", text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: "تم النسخ", description: "تم نسخ الآية" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg text-center">
        <DialogHeader>
          <DialogTitle className="text-xl font-arabic flex items-center justify-center gap-2">
            ✨ آية اليوم ✨
          </DialogTitle>
        </DialogHeader>
        <div className="py-6 space-y-4">
          <div className="p-6 bg-primary/5 rounded-2xl border border-primary/20">
            <p className="text-2xl md:text-3xl font-arabic text-primary leading-[2] font-bold">
              {ayah.text}
            </p>
          </div>
          <p className="text-muted-foreground font-arabic">
            📖 {ayah.surah} - آية {ayah.ayah}
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={shareAyah} variant="outline" className="flex-1 gap-2">
            <Share2 className="h-4 w-4" />
            مشاركة
          </Button>
          <Button onClick={() => setOpen(false)} className="flex-1">
            جزاك الله خيرًا
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
