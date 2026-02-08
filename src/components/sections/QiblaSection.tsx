import { useState, useEffect } from "react";
import { Compass, MapPin, Navigation, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QiblaSection() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  const calculateQiblaDirection = (lat: number, lng: number): number => {
    const latRad = (lat * Math.PI) / 180;
    const lngRad = (lng * Math.PI) / 180;
    const kaabaLatRad = (KAABA_LAT * Math.PI) / 180;
    const kaabaLngRad = (KAABA_LNG * Math.PI) / 180;

    const y = Math.sin(kaabaLngRad - lngRad);
    const x =
      Math.cos(latRad) * Math.tan(kaabaLatRad) -
      Math.sin(latRad) * Math.cos(kaabaLngRad - lngRad);

    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    qibla = (qibla + 360) % 360;

    return qibla;
  };

  const requestPermissions = async () => {
    try {
      // Request location
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            const qibla = calculateQiblaDirection(latitude, longitude);
            setQiblaDirection(qibla);
            setPermissionGranted(true);
          },
          (err) => {
            setError("لم نتمكن من تحديد موقعك. يرجى السماح بالوصول للموقع.");
            console.error(err);
          }
        );
      } else {
        setError("متصفحك لا يدعم تحديد الموقع");
      }

      // Request device orientation
      if ("DeviceOrientationEvent" in window) {
        const requestPermission = (DeviceOrientationEvent as any).requestPermission;
        if (typeof requestPermission === "function") {
          const response = await requestPermission();
          if (response === "granted") {
            window.addEventListener("deviceorientation", handleOrientation);
          }
        } else {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      }
    } catch (err) {
      console.error("Permission error:", err);
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (event.alpha !== null) {
      setDeviceHeading(event.alpha);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const relativeQibla = qiblaDirection !== null ? (qiblaDirection - deviceHeading + 360) % 360 : 0;

  return (
    <section className="min-h-[calc(100vh-4rem)] islamic-pattern py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <span className="text-3xl">🕋</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-primary font-arabic">اتجاه القبلة</h2>
            <p className="text-muted-foreground">حدد اتجاه القبلة من موقعك</p>
          </div>
        </div>

        <div className="max-w-md mx-auto">
          {!permissionGranted ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Compass className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4 font-arabic">تحديد اتجاه القبلة</h3>
                <p className="text-muted-foreground mb-6">
                  للحصول على اتجاه القبلة بدقة، نحتاج إلى الوصول لموقعك والبوصلة
                </p>
                <Button onClick={requestPermissions} size="lg" className="gap-2">
                  <MapPin className="h-5 w-5" />
                  تحديد موقعي
                </Button>
                {error && (
                  <div className="mt-4 p-3 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Compass */}
              <Card className="mb-6 overflow-hidden">
                <CardContent className="p-8">
                  <div className="relative w-64 h-64 mx-auto">
                    {/* Compass Ring */}
                    <div
                      className="absolute inset-0 rounded-full border-4 border-primary/20 transition-transform duration-300"
                      style={{ transform: `rotate(${-deviceHeading}deg)` }}
                    >
                      {/* Cardinal Directions */}
                      {["N", "E", "S", "W"].map((dir, i) => (
                        <div
                          key={dir}
                          className="absolute w-full h-full flex items-start justify-center"
                          style={{ transform: `rotate(${i * 90}deg)` }}
                        >
                          <span className="text-lg font-bold text-primary mt-2">{dir}</span>
                        </div>
                      ))}
                    </div>

                    {/* Qibla Pointer */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                      style={{ transform: `rotate(${relativeQibla}deg)` }}
                    >
                      <div className="relative w-full h-full">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1">
                          <div className="text-4xl">🕋</div>
                        </div>
                        <div className="absolute top-8 left-1/2 w-1 h-24 -translate-x-1/2 bg-gradient-to-b from-primary to-transparent rounded-full" />
                      </div>
                    </div>

                    {/* Center Circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <Navigation className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Compass className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">اتجاه القبلة</p>
                    <p className="text-2xl font-bold text-primary">
                      {qiblaDirection?.toFixed(1)}°
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-muted-foreground">موقعك</p>
                    <p className="text-sm font-bold text-primary">
                      {userLocation?.lat.toFixed(2)}°, {userLocation?.lng.toFixed(2)}°
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-4 bg-primary/5 border-primary/20">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground font-arabic">
                    وجه جهازك نحو علامة الكعبة 🕋 للعثور على اتجاه القبلة
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
