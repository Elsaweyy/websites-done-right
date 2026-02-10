import { useState } from "react";
import { BookOpen, Bell, BellOff, Check, RotateCcw, Target, Flame, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDailyWird } from "@/hooks/useDailyWird";
import { toast } from "@/hooks/use-toast";

const WIRD_PRESETS = [
  { label: "جزء يومياً (ختمة شهرية)", pages: 20, description: "~20 صفحة/يوم" },
  { label: "حزب يومياً (ختمة شهرين)", pages: 10, description: "~10 صفحات/يوم" },
  { label: "صفحتان يومياً", pages: 2, description: "ختمة في 10 أشهر" },
  { label: "صفحة واحدة يومياً", pages: 1, description: "ختمة في سنة ونصف" },
];

export function WirdSection() {
  const { config, progress, updateConfig, markTodayComplete, enableReminder, resetProgress } = useDailyWird();
  const [showSettings, setShowSettings] = useState(false);

  const handleEnableReminder = async () => {
    const success = await enableReminder();
    if (success) {
      toast({ title: "تم تفعيل التذكير", description: `سيتم تذكيرك في ${config.reminderTime}` });
    } else {
      toast({ title: "لم يتم السماح بالإشعارات", description: "يرجى السماح بالإشعارات من إعدادات المتصفح" });
    }
  };

  const handleComplete = () => {
    markTodayComplete();
    toast({ title: "🎉 بارك الله فيك!", description: "أكملت وردك اليومي" });
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">الورد اليومي</h2>
            <p className="text-muted-foreground">حافظ على وردك اليومي من القرآن الكريم</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <Flame className="h-8 w-8 text-accent mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{progress.streak}</p>
              <p className="text-sm text-muted-foreground">أيام متتالية</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{progress.totalDaysCompleted}</p>
              <p className="text-sm text-muted-foreground">إجمالي الأيام</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Target className="h-8 w-8 text-secondary mx-auto mb-2" />
              <p className="text-3xl font-bold text-primary">{config.pagesPerDay}</p>
              <p className="text-sm text-muted-foreground">صفحات/يوم</p>
            </CardContent>
          </Card>
          <Card className={`text-center ${progress.completedToday ? "border-primary bg-primary/5" : ""}`}>
            <CardContent className="p-4">
              <Check className={`h-8 w-8 mx-auto mb-2 ${progress.completedToday ? "text-primary" : "text-muted-foreground"}`} />
              <p className="text-lg font-bold">{progress.completedToday ? "✅ مكتمل" : "⏳ لم يكتمل"}</p>
              <p className="text-sm text-muted-foreground">ورد اليوم</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Action */}
        <Card className="mb-8">
          <CardContent className="p-8 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
              <span className="text-5xl">📖</span>
            </div>
            <h3 className="text-2xl font-bold font-arabic text-foreground">
              {progress.completedToday ? "أكملت وردك اليوم، بارك الله فيك! 🌟" : "هل أكملت وردك اليوم؟"}
            </h3>
            {!progress.completedToday && (
              <Button size="lg" onClick={handleComplete} className="text-lg px-8 py-6 gap-2">
                <Check className="h-5 w-5" />
                أكملت الورد ✅
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Presets */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="font-arabic">اختر خطة الورد</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {WIRD_PRESETS.map((preset) => (
                <Button
                  key={preset.pages}
                  variant={config.pagesPerDay === preset.pages ? "default" : "outline"}
                  className="h-auto py-4 flex flex-col items-center gap-1"
                  onClick={() => updateConfig({ pagesPerDay: preset.pages })}
                >
                  <span className="font-bold font-arabic">{preset.label}</span>
                  <span className="text-xs opacity-75">{preset.description}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="font-arabic flex items-center gap-2">
              <Bell className="h-5 w-5" />
              التذكير
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="font-arabic">تفعيل التذكير اليومي</Label>
              <Switch
                checked={config.reminderEnabled}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleEnableReminder();
                  } else {
                    updateConfig({ reminderEnabled: false });
                  }
                }}
              />
            </div>
            {config.reminderEnabled && (
              <div className="flex items-center gap-3">
                <Label className="font-arabic">وقت التذكير:</Label>
                <Input
                  type="time"
                  value={config.reminderTime}
                  onChange={(e) => updateConfig({ reminderTime: e.target.value })}
                  className="w-32"
                />
              </div>
            )}
            <div className="pt-4 border-t">
              <Button variant="outline" size="sm" onClick={resetProgress} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                إعادة تعيين التقدم
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
