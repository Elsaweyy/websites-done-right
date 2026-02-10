import { BarChart3, BookOpen, Flame, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUsageStats } from "@/hooks/useUsageStats";

export function StatsSection() {
  const { stats, getTodayStats, getWeeklyStats, resetStats } = useUsageStats();
  const today = getTodayStats();
  const weekly = getWeeklyStats();

  const statCards = [
    { label: "صفحات القرآن", value: stats.totalQuranPages, todayValue: today.quranPages, icon: "📖", color: "from-emerald-500 to-green-600" },
    { label: "التسبيحات", value: stats.totalTasbih, todayValue: today.tasbihCount, icon: "📿", color: "from-amber-500 to-yellow-600" },
    { label: "الأذكار", value: stats.totalAzkar, todayValue: today.azkarCompleted, icon: "🤲", color: "from-sky-500 to-blue-600" },
    { label: "الصلاة على النبي", value: stats.totalSalatNabi, todayValue: today.salatNabiCount, icon: "💚", color: "from-green-500 to-emerald-600" },
  ];

  const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-primary/10">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary font-arabic">الإحصائيات</h2>
              <p className="text-muted-foreground">تتبع تقدمك اليومي</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={resetStats} className="gap-2">
            <RotateCcw className="h-4 w-4" />
            إعادة
          </Button>
        </div>

        {/* Streak */}
        <Card className="mb-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="h-8 w-8 text-accent" />
              <span className="text-4xl font-bold text-primary">{stats.streak}</span>
            </div>
            <p className="text-muted-foreground">أيام متتالية 🔥</p>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-3`}>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-primary mt-1">اليوم: {stat.todayValue}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Weekly Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-arabic flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              النشاط الأسبوعي
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-40">
              {weekly.map((day, i) => {
                const total = day.quranPages + day.tasbihCount + day.azkarCompleted + day.salatNabiCount;
                const maxHeight = 120;
                const barHeight = Math.min(Math.max(total * 2, 4), maxHeight);
                const dayDate = new Date(day.date);
                const dayName = dayNames[dayDate.getDay()];
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-muted-foreground">{total}</span>
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary/60 transition-all duration-500"
                      style={{ height: `${barHeight}px` }}
                    />
                    <span className="text-xs text-muted-foreground">{dayName}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
