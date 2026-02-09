import { useState, useEffect, useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface Prayer {
  name: string;
  time: string;
}

export function usePrayerNotifications() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    return localStorage.getItem("prayer_notifications") === "true";
  });
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");
  const [notificationMinutes, setNotificationMinutes] = useState(() => {
    const saved = localStorage.getItem("notification_minutes");
    return saved ? parseInt(saved) : 10;
  });

  // Check notification permission on mount
  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem("prayer_notifications", notificationsEnabled.toString());
    localStorage.setItem("notification_minutes", notificationMinutes.toString());
  }, [notificationsEnabled, notificationMinutes]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast({
        title: "غير مدعوم",
        description: "المتصفح لا يدعم الإشعارات",
        variant: "destructive",
      });
      return false;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      setNotificationsEnabled(true);
      toast({
        title: "تم تفعيل الإشعارات",
        description: "ستتلقى تنبيهات قبل وقت الصلاة",
      });
      return true;
    } else {
      toast({
        title: "تم رفض الإشعارات",
        description: "يرجى السماح بالإشعارات من إعدادات المتصفح",
        variant: "destructive",
      });
      return false;
    }
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const granted = await requestPermission();
      if (!granted) return;
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  const sendNotification = useCallback((prayer: Prayer) => {
    if (!notificationsEnabled || notificationPermission !== "granted") return;

    const notification = new Notification("🕌 وقت الصلاة", {
      body: `حان الآن موعد صلاة ${prayer.name}`,
      icon: "/favicon.ico",
      tag: `prayer-${prayer.name}`,
      requireInteraction: true,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Also show toast
    toast({
      title: "🕌 وقت الصلاة",
      description: `حان الآن موعد صلاة ${prayer.name}`,
    });
  }, [notificationsEnabled, notificationPermission]);

  const sendPreNotification = useCallback((prayer: Prayer, minutesBefore: number) => {
    if (!notificationsEnabled || notificationPermission !== "granted") return;

    const notification = new Notification("⏰ تذكير بالصلاة", {
      body: `باقي ${minutesBefore} دقيقة على صلاة ${prayer.name}`,
      icon: "/favicon.ico",
      tag: `prayer-reminder-${prayer.name}`,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }, [notificationsEnabled, notificationPermission]);

  const scheduleNotifications = useCallback((prayers: Prayer[]) => {
    if (!notificationsEnabled || notificationPermission !== "granted") return;

    const now = new Date();
    
    prayers.forEach((prayer) => {
      const [hours, minutes] = prayer.time.split(":").map(Number);
      const prayerTime = new Date();
      prayerTime.setHours(hours, minutes, 0, 0);

      // Skip if prayer time has passed
      if (prayerTime <= now) return;

      // Schedule exact time notification
      const timeUntilPrayer = prayerTime.getTime() - now.getTime();
      setTimeout(() => {
        sendNotification(prayer);
      }, timeUntilPrayer);

      // Schedule pre-notification (X minutes before)
      const preNotificationTime = timeUntilPrayer - (notificationMinutes * 60 * 1000);
      if (preNotificationTime > 0) {
        setTimeout(() => {
          sendPreNotification(prayer, notificationMinutes);
        }, preNotificationTime);
      }
    });
  }, [notificationsEnabled, notificationPermission, notificationMinutes, sendNotification, sendPreNotification]);

  return {
    notificationsEnabled,
    notificationPermission,
    notificationMinutes,
    setNotificationMinutes,
    toggleNotifications,
    requestPermission,
    scheduleNotifications,
    sendNotification,
  };
}
