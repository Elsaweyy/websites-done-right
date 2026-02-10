import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HomeSection } from "@/components/sections/HomeSection";
import { QuranSection } from "@/components/sections/QuranSection";
import { PrayerTimesSection } from "@/components/sections/PrayerTimesSection";
import { AzkarSection } from "@/components/sections/AzkarSection";
import { TasbihSection } from "@/components/sections/TasbihSection";
import { QiblaSection } from "@/components/sections/QiblaSection";
import { SalatAlaNabiSection } from "@/components/sections/SalatAlaNabiSection";
import { DuaSection } from "@/components/sections/DuaSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { InfoSection } from "@/components/sections/InfoSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderSection = () => {
    switch (activeSection) {
      case "quran":
        return <QuranSection />;
      case "prayer":
        return <PrayerTimesSection />;
      case "azkar":
        return <AzkarSection />;
      case "tasbih":
        return <TasbihSection />;
      case "qibla":
        return <QiblaSection />;
      case "salat-nabi":
        return <SalatAlaNabiSection />;
      case "dua":
        return <DuaSection />;
      case "stats":
        return <StatsSection />;
      case "info":
        return <InfoSection />;
      default:
        return <HomeSection onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <main>{renderSection()}</main>
    </div>
  );
};

export default Index;
