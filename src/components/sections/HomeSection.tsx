import { BookOpen, Heart, Compass, Hand, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HomeSectionProps {
  onSectionChange: (section: string) => void;
}

const features = [
  {
    id: "quran",
    title: "القرآن الكريم",
    description: "اقرأ واستمع للقرآن الكريم مع التفسير",
    icon: BookOpen,
    color: "from-emerald-500 to-green-600",
    emoji: "📖",
  },
  {
    id: "prayer",
    title: "أوقات الصلاة",
    description: "مواقيت الصلاة حسب موقعك",
    icon: Clock,
    color: "from-sky-500 to-blue-600",
    emoji: "🕌",
  },
  {
    id: "azkar",
    title: "الأذكار",
    description: "أذكار الصباح والمساء",
    icon: Hand,
    color: "from-amber-500 to-yellow-600",
    emoji: "🤲",
  },
  {
    id: "tasbih",
    title: "السبحة الإلكترونية",
    description: "عداد التسبيح",
    icon: Heart,
    color: "from-rose-500 to-pink-600",
    emoji: "📿",
  },
  {
    id: "salat-nabi",
    title: "الصلاة على النبي",
    description: "صلِّ على النبي ﷺ",
    icon: Heart,
    color: "from-green-500 to-emerald-600",
    emoji: "💚",
  },
  {
    id: "dua",
    title: "مكتبة الأدعية",
    description: "أدعية من القرآن والسنة",
    icon: BookOpen,
    color: "from-purple-500 to-violet-600",
    emoji: "📚",
  },
  {
    id: "wird",
    title: "الورد اليومي",
    description: "حافظ على وردك من القرآن",
    icon: BookOpen,
    color: "from-teal-500 to-cyan-600",
    emoji: "📅",
  },
  {
    id: "qibla",
    title: "اتجاه القبلة",
    description: "حدد اتجاه القبلة",
    icon: Compass,
    color: "from-blue-500 to-indigo-600",
    emoji: "🕋",
  },
  {
    id: "stats",
    title: "الإحصائيات",
    description: "تتبع تقدمك اليومي",
    icon: BookOpen,
    color: "from-orange-500 to-red-600",
    emoji: "📊",
  },
];

export function HomeSection({ onSectionChange }: HomeSectionProps) {
  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern">
      <div className="container mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
            <span className="text-5xl">☪️</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4 font-arabic">
            بسم الله الرحمن الرحيم
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            مرحباً بك في موقع نور الإسلام - دليلك الشامل للقرآن الكريم والأذكار
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature) => (
            <Card
              key={feature.id}
              className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-2 hover:border-primary/50"
              onClick={() => onSectionChange(feature.id)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform shadow-lg`}
                >
                  <span className="text-3xl">{feature.emoji}</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground font-arabic">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-primary/5 border-primary/20">
            <CardContent className="p-8">
              <p className="text-xl md:text-2xl font-arabic text-primary leading-relaxed">
                "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ"
              </p>
              <p className="text-muted-foreground mt-4">سورة الرعد - آية 28</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
