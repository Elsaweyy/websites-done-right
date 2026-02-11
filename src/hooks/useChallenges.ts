import { useState, useCallback } from "react";

const CHALLENGES_KEY = "noor_challenges";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  type: "tasbih" | "quranPages" | "azkar" | "salatNabi" | "khatmaPages";
  reward: number; // points
  emoji: string;
}

export interface ChallengeProgress {
  challengeId: string;
  current: number;
  completed: boolean;
  completedDate?: string;
}

interface ChallengesData {
  weekStart: string;
  points: number;
  totalPointsEarned: number;
  level: number;
  weeklyChallenges: ChallengeProgress[];
  badges: string[];
}

const WEEKLY_CHALLENGES: Challenge[] = [
  { id: "tasbih_500", title: "المسبّح", description: "سبّح 500 مرة", target: 500, type: "tasbih", reward: 50, emoji: "📿" },
  { id: "quran_10", title: "قارئ القرآن", description: "اقرأ 10 صفحات", target: 10, type: "quranPages", reward: 100, emoji: "📖" },
  { id: "azkar_5", title: "الذاكر", description: "أكمل الأذكار 5 مرات", target: 5, type: "azkar", reward: 60, emoji: "🤲" },
  { id: "salat_100", title: "المصلّي على النبي", description: "صلِّ على النبي 100 مرة", target: 100, type: "salatNabi", reward: 70, emoji: "💚" },
  { id: "khatma_20", title: "الخاتم", description: "اقرأ 20 صفحة من الختمة", target: 20, type: "khatmaPages", reward: 80, emoji: "🏆" },
];

const BADGES = [
  { points: 100, name: "مبتدئ", emoji: "⭐" },
  { points: 300, name: "مجتهد", emoji: "🌟" },
  { points: 500, name: "متميز", emoji: "💫" },
  { points: 1000, name: "متفوق", emoji: "🏅" },
  { points: 2000, name: "بطل", emoji: "🥇" },
  { points: 5000, name: "أسطورة", emoji: "👑" },
];

function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(now.setDate(diff)).toISOString().split("T")[0];
}

const DEFAULT_DATA: ChallengesData = {
  weekStart: getWeekStart(),
  points: 0,
  totalPointsEarned: 0,
  level: 1,
  weeklyChallenges: WEEKLY_CHALLENGES.map(c => ({ challengeId: c.id, current: 0, completed: false })),
  badges: [],
};

export function useChallenges() {
  const [data, setData] = useState<ChallengesData>(() => {
    const saved = localStorage.getItem(CHALLENGES_KEY);
    if (saved) {
      const parsed: ChallengesData = JSON.parse(saved);
      const currentWeek = getWeekStart();
      if (parsed.weekStart !== currentWeek) {
        // Reset weekly challenges
        return {
          ...parsed,
          weekStart: currentWeek,
          weeklyChallenges: WEEKLY_CHALLENGES.map(c => ({ challengeId: c.id, current: 0, completed: false })),
        };
      }
      return parsed;
    }
    return DEFAULT_DATA;
  });

  const save = useCallback((newData: ChallengesData) => {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(newData));
    setData(newData);
  }, []);

  const incrementChallenge = useCallback((type: Challenge["type"], amount: number = 1) => {
    setData(prev => {
      const challenges = prev.weeklyChallenges.map(cp => {
        const challenge = WEEKLY_CHALLENGES.find(c => c.id === cp.challengeId);
        if (!challenge || challenge.type !== type || cp.completed) return cp;

        const newCurrent = cp.current + amount;
        const justCompleted = newCurrent >= challenge.target && !cp.completed;

        return {
          ...cp,
          current: Math.min(newCurrent, challenge.target),
          completed: newCurrent >= challenge.target,
          completedDate: justCompleted ? new Date().toISOString().split("T")[0] : cp.completedDate,
        };
      });

      const newlyCompleted = challenges.filter((cp, i) =>
        cp.completed && !prev.weeklyChallenges[i].completed
      );

      let pointsEarned = 0;
      newlyCompleted.forEach(cp => {
        const ch = WEEKLY_CHALLENGES.find(c => c.id === cp.challengeId);
        if (ch) pointsEarned += ch.reward;
      });

      const totalPoints = prev.totalPointsEarned + pointsEarned;
      const newBadges = BADGES.filter(b => totalPoints >= b.points).map(b => b.name);
      const level = Math.floor(totalPoints / 200) + 1;

      const updated: ChallengesData = {
        ...prev,
        weeklyChallenges: challenges,
        points: prev.points + pointsEarned,
        totalPointsEarned: totalPoints,
        level,
        badges: newBadges,
      };

      localStorage.setItem(CHALLENGES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const currentLevel = BADGES.filter(b => data.totalPointsEarned >= b.points).pop();
  const nextLevel = BADGES.find(b => data.totalPointsEarned < b.points);

  return {
    challenges: WEEKLY_CHALLENGES,
    progress: data.weeklyChallenges,
    points: data.points,
    totalPoints: data.totalPointsEarned,
    level: data.level,
    badges: data.badges,
    currentLevel,
    nextLevel,
    incrementChallenge,
    allBadges: BADGES,
  };
}
