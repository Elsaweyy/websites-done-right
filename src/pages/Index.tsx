import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { HomeSection } from "@/components/sections/HomeSection";
import { QuranSection } from "@/components/sections/QuranSection";
import { AzkarSection } from "@/components/sections/AzkarSection";
import { TasbihSection } from "@/components/sections/TasbihSection";
import { QiblaSection } from "@/components/sections/QiblaSection";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");

  const renderSection = () => {
    switch (activeSection) {
      case "quran":
        return <QuranSection />;
      case "azkar":
        return <AzkarSection />;
      case "tasbih":
        return <TasbihSection />;
      case "qibla":
        return <QiblaSection />;
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
