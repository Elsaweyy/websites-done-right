import { BookOpen, Heart, Compass, Hand, Clock, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useUsageStats } from "@/hooks/useUsageStats";
import { useKhatma } from "@/hooks/useKhatma";
import { useDailyWird } from "@/hooks/useDailyWird";

interface HomeSectionProps {
  onSectionChange: (section: string) => void;
}

const features = [
  { id: "quran", title: "القرآن الكريم", description: "اقرأ واستمع للقرآن الكريم مع التفسير", color: "from-emerald-500 to-green-600", emoji: "📖" },
  { id: "prayer", title: "أوقات الصلاة", description: "مواقيت الصلاة حسب موقعك", color: "from-sky-500 to-blue-600", emoji: "🕌" },
  { id: "azkar", title: "الأذكار", description: "أذكار الصباح والمساء", color: "from-amber-500 to-yellow-600", emoji: "🤲" },
  { id: "tasbih", title: "السبحة الإلكترونية", description: "عداد التسبيح", color: "from-rose-500 to-pink-600", emoji: "📿" },
  { id: "salat-nabi", title: "الصلاة على النبي", description: "صلِّ على النبي ﷺ", color: "from-green-500 to-emerald-600", emoji: "💚" },
  { id: "dua", title: "مكتبة الأدعية", description: "أدعية من القرآن والسنة", color: "from-purple-500 to-violet-600", emoji: "📚" },
  { id: "wird", title: "الورد اليومي", description: "حافظ على وردك من القرآن", color: "from-teal-500 to-cyan-600", emoji: "📅" },
  { id: "khatma", title: "تتبع الختمات", description: "تابع ختماتك وإنجازاتك", color: "from-yellow-500 to-amber-600", emoji: "🏆" },
  { id: "qibla", title: "اتجاه القبلة", description: "حدد اتجاه القبلة", color: "from-blue-500 to-indigo-600", emoji: "🕋" },
  { id: "stats", title: "الإحصائيات", description: "تتبع تقدمك اليومي", color: "from-orange-500 to-red-600", emoji: "📊" },
];

export function HomeSection({ onSectionChange }: HomeSectionProps) {
  const { stats, getTodayStats } = useUsageStats();
  const { currentPage, totalPages, progress: khatmaProgress, khatmaList } = useKhatma();
  const { progress: wirdProgress } = useDailyWird();
  const todayStats = getTodayStats();

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern">
      <div className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <span className="text-4xl">☪️</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2 font-arabic">
            بسم الله الرحمن الرحيم
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            مرحباً بك في نور الإسلام - دليلك الشامل للقرآن والأذكار
          </p>
        </div>

        {/* Quick Widgets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto mb-8">
          {/* Khatma Widget */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20"
            onClick={() => onSectionChange("khatma")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📖</span>
                <h3 className="font-semibold text-sm">تقدم الختمة</h3>
              </div>
              <Progress value={khatmaProgress} className="h-2 mb-1" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{currentPage}/{totalPages}</span>
                <span>{khatmaProgress}%</span>
              </div>
            </CardContent>
          </Card>

          {/* Today Stats Widget */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20"
            onClick={() => onSectionChange("stats")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📊</span>
                <h3 className="font-semibold text-sm">نشاط اليوم</h3>
              </div>
              <div className="grid grid-cols-2 gap-1 text-xs">
                <span className="text-muted-foreground">تسبيح: {todayStats.tasbihCount}</span>
                <span className="text-muted-foreground">أذكار: {todayStats.azkarCompleted}</span>
                <span className="text-muted-foreground">قرآن: {todayStats.quranPages} ص</span>
                <span className="text-muted-foreground">صلاة ع النبي: {todayStats.salatNabiCount}</span>
              </div>
            </CardContent>
          </Card>

          {/* Wird Widget */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20"
            onClick={() => onSectionChange("wird")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">📅</span>
                <h3 className="font-semibold text-sm">الورد اليومي</h3>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={wirdProgress.completedToday ? "default" : "secondary"} className="text-xs">
                  {wirdProgress.completedToday ? "✅ مكتمل" : "⏳ لم يكتمل"}
                </Badge>
                <span className="text-xs text-muted-foreground">🔥 {wirdProgress.streak} يوم</span>
              </div>
            </CardContent>
          </Card>

          {/* Streak & Achievements */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-primary/20"
            onClick={() => onSectionChange("khatma")}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🏆</span>
                <h3 className="font-semibold text-sm">الإنجازات</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{khatmaList.length} ختمة</span>
                <Badge className="text-xs">🔥 {stats.streak} يوم متتالي</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border hover:border-primary/50"
              onClick={() => onSectionChange(feature.id)}
            >
              <CardContent className="p-4 text-center">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-3 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground font-arabic">
                  {feature.title}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-10 text-center">
          <Card className="max-w-xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-lg md:text-xl font-arabic text-primary leading-relaxed">
                "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
              </p>
              <p className="text-muted-foreground mt-2 text-sm">سورة الرعد - آية 28</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
