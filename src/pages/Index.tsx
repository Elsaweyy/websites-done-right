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
import { WirdSection } from "@/components/sections/WirdSection";
import { KhatmaSection } from "@/components/sections/KhatmaSection";
import { ChallengesSection } from "@/components/sections/ChallengesSection";
import { AuthSection } from "@/components/sections/AuthSection";
import { ProfileSection } from "@/components/sections/ProfileSection";
import { LeaderboardSection } from "@/components/sections/LeaderboardSection";
import { DailyAyah } from "@/components/DailyAyah";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeSection, setActiveSection] = useState("home");
  const { user } = useAuth();

  const renderSection = () => {
    switch (activeSection) {
      case "quran": return <QuranSection />;
      case "prayer": return <PrayerTimesSection />;
      case "azkar": return <AzkarSection />;
      case "tasbih": return <TasbihSection />;
      case "qibla": return <QiblaSection />;
      case "salat-nabi": return <SalatAlaNabiSection />;
      case "dua": return <DuaSection />;
      case "wird": return <WirdSection />;
      case "khatma": return <KhatmaSection />;
      case "challenges": return <ChallengesSection />;
      case "stats": return <StatsSection />;
      case "info": return <InfoSection />;
      case "leaderboard": return <LeaderboardSection />;
      case "auth": return user ? <ProfileSection /> : <AuthSection />;
      case "profile": return user ? <ProfileSection /> : <AuthSection />;
      default: return <HomeSection onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <DailyAyah />
      <Header activeSection={activeSection} onSectionChange={setActiveSection} />
      <main>{renderSection()}</main>
    </div>
  );
};

export default Index;
