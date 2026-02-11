import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useKhatma, Khatma } from "@/hooks/useKhatma";
import { BookOpen, Award, Plus, RotateCcw, Share2, X } from "lucide-react";

export function KhatmaSection() {
  const { currentPage, totalPages, khatmaList, progress, addPages, resetCurrent } = useKhatma();
  const [pagesToAdd, setPagesToAdd] = useState(1);
  const [showCertificate, setShowCertificate] = useState<Khatma | null>(null);
  const prevKhatmaCount = useRef(khatmaList.length);

  // Auto-show certificate when a new khatma is completed
  useEffect(() => {
    if (khatmaList.length > prevKhatmaCount.current) {
      setShowCertificate(khatmaList[khatmaList.length - 1]);
    }
    prevKhatmaCount.current = khatmaList.length;
  }, [khatmaList.length]);

  const shareCertificate = (khatma: Khatma) => {
    const text = `🎉 الحمد لله أتممت ختمة القرآن الكريم رقم ${khatma.id}\n📅 من ${khatma.startDate} إلى ${khatma.completedDate}\n⏱️ في ${khatma.daysToComplete} يوم\n\nعبر تطبيق نور الإسلام`;
    if (navigator.share) {
      navigator.share({ title: "شهادة ختم القرآن", text });
    } else {
      navigator.clipboard.writeText(text);
    }
  };

  const CertificateCard = ({ khatma }: { khatma: Khatma }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <Card className="w-full max-w-md border-4 border-primary/40 bg-gradient-to-br from-card via-primary/5 to-accent/10 shadow-2xl animate-in fade-in zoom-in duration-500">
        <CardContent className="p-8 text-center space-y-4 relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 left-2"
            onClick={() => setShowCertificate(null)}
          >
            <X className="h-4 w-4" />
          </Button>

          {/* Decorative top */}
          <div className="flex justify-center gap-2 text-3xl">
            <span>🌟</span><span>🏆</span><span>🌟</span>
          </div>

          <div className="border-2 border-primary/20 rounded-xl p-6 space-y-3">
            <p className="text-sm text-muted-foreground">بسم الله الرحمن الرحيم</p>
            <h3 className="text-2xl font-bold text-primary font-arabic">شهادة إتمام ختمة</h3>
            <div className="w-16 h-0.5 bg-primary/30 mx-auto" />

            <p className="text-4xl font-bold text-primary">#{khatma.id}</p>

            <div className="space-y-1 text-sm">
              <p>📅 بدأت: <span className="font-semibold">{khatma.startDate}</span></p>
              <p>✅ انتهت: <span className="font-semibold">{khatma.completedDate}</span></p>
              <p>⏱️ المدة: <span className="font-semibold">{khatma.daysToComplete} يوم</span></p>
            </div>

            <div className="w-16 h-0.5 bg-primary/30 mx-auto" />
            <p className="text-primary font-arabic text-lg leading-relaxed">
              "وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا"
            </p>
            <p className="text-xs text-muted-foreground">سورة المزمل - آية 4</p>
          </div>

          <div className="flex gap-2 justify-center pt-2">
            <Button onClick={() => shareCertificate(khatma)} className="gap-2">
              <Share2 className="h-4 w-4" />
              مشاركة الشهادة
            </Button>
            <Button variant="outline" onClick={() => setShowCertificate(null)}>
              إغلاق
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern">
      {showCertificate && <CertificateCard khatma={showCertificate} />}

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">📖</span>
          <h2 className="text-3xl font-bold text-primary font-arabic">تتبع الختمات</h2>
          <p className="text-muted-foreground mt-2">تابع تقدمك في ختم القرآن الكريم</p>
        </div>

        {/* Current Progress */}
        <Card className="mb-6 border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-arabic">
              <BookOpen className="h-5 w-5" />
              الختمة الحالية #{khatmaList.length + 1}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <span className="text-5xl font-bold text-primary">{progress}%</span>
              <p className="text-muted-foreground mt-1">
                صفحة {currentPage} من {totalPages}
              </p>
            </div>
            <Progress value={progress} className="h-4" />

            <div className="flex items-center gap-2 justify-center flex-wrap">
              {[1, 2, 5, 10, 20].map(n => (
                <Button
                  key={n}
                  variant={pagesToAdd === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPagesToAdd(n)}
                >
                  {n}
                </Button>
              ))}
            </div>

            <div className="flex gap-2 justify-center">
              <Button onClick={() => addPages(pagesToAdd)} className="gap-2">
                <Plus className="h-4 w-4" />
                أضف {pagesToAdd} {pagesToAdd === 1 ? "صفحة" : "صفحات"}
              </Button>
              <Button variant="outline" onClick={resetCurrent} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                إعادة
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completed Khatmas */}
        {khatmaList.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-arabic">
                <Award className="h-5 w-5" />
                الختمات المكتملة ({khatmaList.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {khatmaList.map(khatma => (
                <div
                  key={khatma.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                  onClick={() => setShowCertificate(khatma)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏅</span>
                    <div>
                      <p className="font-semibold">الختمة #{khatma.id}</p>
                      <p className="text-xs text-muted-foreground">{khatma.completedDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{khatma.daysToComplete} يوم</Badge>
                    <span className="text-xs text-primary">عرض الشهادة →</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
