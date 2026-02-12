import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Medal, Crown, BookOpen, Star } from "lucide-react";

type SortBy = "total_points" | "total_khatmas" | "total_pages_read" | "streak_days";

const sortOptions: { key: SortBy; label: string; icon: string }[] = [
  { key: "total_points", label: "النقاط", icon: "🏆" },
  { key: "total_khatmas", label: "الختمات", icon: "📖" },
  { key: "total_pages_read", label: "الصفحات", icon: "📄" },
  { key: "streak_days", label: "الاستمرارية", icon: "🔥" },
];

export function LeaderboardSection() {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState<SortBy>("total_points");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order(sortBy, { ascending: false })
        .limit(50);
      setLeaders(data || []);
      setLoading(false);
    };
    fetchLeaders();
  }, [sortBy]);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (index === 1) return <Medal className="h-6 w-6 text-gray-400" />;
    if (index === 2) return <Medal className="h-6 w-6 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground w-6 text-center">{index + 1}</span>;
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🏆</span>
          <h2 className="text-3xl font-bold text-primary font-arabic">لوحة المتصدرين</h2>
          <p className="text-muted-foreground mt-2">أفضل المستخدمين إنجازاً</p>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 justify-center mb-6">
          {sortOptions.map(opt => (
            <Button
              key={opt.key}
              variant={sortBy === opt.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy(opt.key)}
              className="gap-1"
            >
              <span>{opt.icon}</span>
              {opt.label}
            </Button>
          ))}
        </div>

        <Card>
          <CardContent className="p-4 space-y-2">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">جاري التحميل...</p>
            ) : leaders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا يوجد متصدرين بعد. كن أول واحد! 🌟</p>
            ) : (
              leaders.map((leader, index) => (
                <div
                  key={leader.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                    leader.user_id === user?.id
                      ? "bg-primary/10 border border-primary/20"
                      : "bg-muted/30 hover:bg-muted/50"
                  } ${index < 3 ? "border border-primary/10" : ""}`}
                >
                  {getRankIcon(index)}
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={leader.avatar_url || ""} />
                    <AvatarFallback>{leader.display_name?.[0] || "؟"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {leader.display_name || "مستخدم"}
                      {leader.user_id === user?.id && (
                        <Badge variant="secondary" className="mr-2 text-xs">أنت</Badge>
                      )}
                    </p>
                    {leader.username && (
                      <p className="text-xs text-muted-foreground">@{leader.username}</p>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-lg font-bold text-primary">{leader[sortBy]}</p>
                    <p className="text-xs text-muted-foreground">
                      {sortOptions.find(o => o.key === sortBy)?.label}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
