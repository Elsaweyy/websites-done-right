import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeaderProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navItems = [
  { id: "home", label: "الرئيسية", icon: "🏠" },
  { id: "quran", label: "القرآن", icon: "📖" },
  { id: "prayer", label: "الصلاة", icon: "🕌" },
  { id: "azkar", label: "الأذكار", icon: "🤲" },
  { id: "tasbih", label: "السبحة", icon: "📿" },
  { id: "salat-nabi", label: "الصلاة على النبي", icon: "💚" },
  { id: "dua", label: "الأدعية", icon: "📚" },
  { id: "wird", label: "الورد اليومي", icon: "📅" },
  { id: "khatma", label: "الختمات", icon: "🏆" },
  { id: "challenges", label: "التحديات", icon: "🎯" },
  { id: "qibla", label: "القبلة", icon: "🕋" },
  { id: "stats", label: "الإحصائيات", icon: "📊" },
  { id: "info", label: "عن التطبيق", icon: "ℹ️" },
];

export function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">☪️</span>
            <h1 className="text-xl font-bold text-primary font-arabic">نور الإسلام</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "gap-2 transition-all",
                  activeSection === item.id && "shadow-lg"
                )}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDark(!isDark)}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => {
                  onSectionChange(item.id);
                  setIsMenuOpen(false);
                }}
                className="justify-start gap-2 w-full"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
