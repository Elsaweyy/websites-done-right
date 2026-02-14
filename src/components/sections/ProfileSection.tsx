import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { User, Save, LogOut, Trophy, BookOpen, Star, Camera, Loader2 } from "lucide-react";

export function ProfileSection() {
  const { user, signOut } = useAuth();
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setUsername(profile.username || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "خطأ", description: "يرجى اختيار صورة", variant: "destructive" });
      return;
    }

    setUploading(true);
    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/avatar.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      toast({ title: "خطأ في رفع الصورة", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    const urlWithCacheBust = `${publicUrl}?t=${Date.now()}`;
    setAvatarUrl(urlWithCacheBust);
    
    // Auto-save avatar to profile
    const error = await updateProfile({ avatar_url: urlWithCacheBust });
    setUploading(false);
    if (error) {
      toast({ title: "خطأ في حفظ الصورة", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم رفع الصورة ✅" });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const error = await updateProfile({
      display_name: displayName,
      username,
      avatar_url: avatarUrl,
    });
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم حفظ البيانات ✅" });
    }
    setSaving(false);
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4 max-w-lg">
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">👤</span>
          <h2 className="text-3xl font-bold text-primary font-arabic">الملف الشخصي</h2>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-2xl">
                    {displayName?.[0] || user?.email?.[0] || "؟"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-lg hover:bg-primary/90 transition-colors"
                  disabled={uploading}
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
            </div>

            <div>
              <Label>الاسم</Label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="اسمك" />
            </div>
            <div>
              <Label>اسم المستخدم</Label>
              <Input value={username} onChange={e => setUsername(e.target.value)} placeholder="username" dir="ltr" />
            </div>

            <Button onClick={handleSave} className="w-full gap-2" disabled={saving}>
              <Save className="h-4 w-4" />
              حفظ التغييرات
            </Button>
          </CardContent>
        </Card>

        {/* Stats */}
        {profile && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary font-arabic">
                <Star className="h-5 w-5" />
                إحصائياتك
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <Trophy className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold text-primary">{profile.total_points}</p>
                  <p className="text-xs text-muted-foreground">النقاط</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <BookOpen className="h-6 w-6 mx-auto text-primary mb-1" />
                  <p className="text-2xl font-bold text-primary">{profile.total_khatmas}</p>
                  <p className="text-xs text-muted-foreground">الختمات</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">{profile.total_pages_read}</p>
                  <p className="text-xs text-muted-foreground">صفحات مقروءة</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-primary">{profile.streak_days}</p>
                  <p className="text-xs text-muted-foreground">أيام متتالية</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Button variant="destructive" className="w-full gap-2" onClick={signOut}>
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </section>
  );
}
