import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useChallenges } from "@/hooks/useChallenges";
import { Trophy, Star, Target, Flame } from "lucide-react";

export function ChallengesSection() {
  const { challenges, progress, totalPoints, level, currentLevel, nextLevel, allBadges } = useChallenges();

  const completedCount = progress.filter(p => p.completed).length;

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🎯</span>
          <h2 className="text-3xl font-bold text-primary font-arabic">التحديات الأسبوعية</h2>
          <p className="text-muted-foreground mt-2">أكمل التحديات واكسب النقاط والشارات</p>
        </div>

        {/* Points & Level */}
        <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentLevel?.emoji || "⭐"}</span>
                <div>
                  <p className="font-bold text-lg">المستوى {level}</p>
                  <p className="text-sm text-muted-foreground">{currentLevel?.name || "مبتدئ"}</p>
                </div>
              </div>
              <div className="text-left">
                <p className="text-2xl font-bold text-primary">{totalPoints}</p>
                <p className="text-xs text-muted-foreground">نقطة</p>
              </div>
            </div>
            {nextLevel && (
              <div>
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>التالي: {nextLevel.emoji} {nextLevel.name}</span>
                  <span>{nextLevel.points - totalPoints} نقطة متبقية</span>
                </div>
                <Progress
                  value={((totalPoints - (currentLevel ? allBadges[allBadges.indexOf(currentLevel)]?.points || 0 : 0)) / (nextLevel.points - (currentLevel ? allBadges[allBadges.indexOf(currentLevel)]?.points || 0 : 0))) * 100}
                  className="h-2"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg font-arabic flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            تحديات هذا الأسبوع
          </h3>
          <Badge variant="secondary" className="gap-1">
            <Flame className="h-3 w-3" />
            {completedCount}/{challenges.length}
          </Badge>
        </div>

        <div className="space-y-3 mb-8">
          {challenges.map((challenge, i) => {
            const p = progress[i];
            const pct = Math.min(100, Math.round((p.current / challenge.target) * 100));

            return (
              <Card
                key={challenge.id}
                className={`transition-all ${p.completed ? "border-primary/40 bg-primary/5" : ""}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{challenge.emoji}</span>
                      <div>
                        <p className="font-semibold text-sm">{challenge.title}</p>
                        <p className="text-xs text-muted-foreground">{challenge.description}</p>
                      </div>
                    </div>
                    <div className="text-left">
                      {p.completed ? (
                        <Badge className="gap-1 bg-primary">
                          <Star className="h-3 w-3" />
                          +{challenge.reward}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">{challenge.reward} نقطة</span>
                      )}
                    </div>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-left">
                    {p.current}/{challenge.target}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary font-arabic">
              <Trophy className="h-5 w-5" />
              الشارات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {allBadges.map(badge => {
                const earned = totalPoints >= badge.points;
                return (
                  <div
                    key={badge.name}
                    className={`text-center p-3 rounded-xl transition-all ${
                      earned ? "bg-primary/10 border border-primary/30" : "bg-muted/50 opacity-50"
                    }`}
                  >
                    <span className="text-3xl block mb-1">{badge.emoji}</span>
                    <p className="text-xs font-semibold">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.points} نقطة</p>
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
