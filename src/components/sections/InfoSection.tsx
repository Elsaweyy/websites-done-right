import { Heart, Code, Github, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ahmedPhoto from "@/assets/ahmed-elsawey.webp";

export function InfoSection() {
  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <span className="text-5xl">☪️</span>
          </div>
          
          <h2 className="text-4xl font-bold text-primary mb-4 font-arabic">نور الإسلام</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            دليلك الشامل للقرآن الكريم والأذكار والأدعية
          </p>

          {/* Features */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4 font-arabic">مميزات التطبيق</h3>
              <div className="grid grid-cols-2 gap-4 text-right">
                {[
                  "📖 القرآن الكريم كاملاً مع التفسير",
                  "🎧 الاستماع بصوت أشهر القراء",
                  "🕌 مواقيت الصلاة حسب موقعك",
                  "🤲 أذكار الصباح والمساء",
                  "📿 السبحة الإلكترونية",
                  "💚 الصلاة على النبي ﷺ",
                  "🕋 اتجاه القبلة",
                  "📚 مكتبة الأدعية",
                  "📊 إحصائيات الاستخدام",
                  "📴 القراءة بدون إنترنت",
                ].map((feature, i) => (
                  <p key={i} className="text-sm text-muted-foreground">{feature}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Creator */}
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Code className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold text-primary">من صنع</h3>
              </div>
              
              <div className="inline-flex items-center justify-center w-28 h-28 rounded-full overflow-hidden mb-4 ring-2 ring-primary/30">
                <img src={ahmedPhoto} alt="Ahmed Elsawey" className="w-full h-full object-cover" />
              </div>
              
              <h4 className="text-2xl font-bold text-foreground mb-2">Ahmed Elsawey</h4>
              <p className="text-muted-foreground mb-6">مطور ويب ومصمم تطبيقات</p>

              <div className="flex items-center justify-center gap-2 text-red-500">
                <Heart className="h-5 w-5 fill-current" />
                <span className="text-sm">صُنع بحب لخدمة الإسلام والمسلمين</span>
              </div>
            </CardContent>
          </Card>

          {/* Version */}
          <p className="text-sm text-muted-foreground mt-8">
            الإصدار 1.0.0 • نور الإسلام © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </section>
  );
}
