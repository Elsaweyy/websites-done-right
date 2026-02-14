import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePointsSync() {
  const { user } = useAuth();

  const addPoints = useCallback(async (points: number) => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("total_points")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      await supabase
        .from("profiles")
        .update({ total_points: data.total_points + points })
        .eq("user_id", user.id);
    }
  }, [user]);

  const addTasbih = useCallback(async (count: number) => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("total_tasbih, total_points")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      await supabase
        .from("profiles")
        .update({
          total_tasbih: data.total_tasbih + count,
          total_points: data.total_points + Math.floor(count / 10),
        })
        .eq("user_id", user.id);
    }
  }, [user]);

  const addPagesRead = useCallback(async (pages: number) => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("total_pages_read, total_points")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      await supabase
        .from("profiles")
        .update({
          total_pages_read: data.total_pages_read + pages,
          total_points: data.total_points + pages * 5,
        })
        .eq("user_id", user.id);
    }
  }, [user]);

  const completeKhatma = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("profiles")
      .select("total_khatmas, total_points")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data) {
      await supabase
        .from("profiles")
        .update({
          total_khatmas: data.total_khatmas + 1,
          total_points: data.total_points + 500,
        })
        .eq("user_id", user.id);
    }
  }, [user]);

  return { addPoints, addTasbih, addPagesRead, completeKhatma };
}
