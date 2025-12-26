import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, ActivityIndicator, Animated, } from "react-native";
import * as Location from "expo-location";

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_LABELS = { Fajr: "Sabah", Dhuhr: "Öğle", Asr: "İkindi", Maghrib: "Akşam", Isha: "Yatsı",};

export default function NamazTakipPage({ onBack }) {
  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  const [dateOffset, setDateOffset] = useState(0); // 0 = today, -1 = yesterday, etc.
  const [now, setNow] = useState(new Date());

  const [gregorianText, setGregorianText] = useState("");
  const [hijriText, setHijriText] = useState("");
  const [locationText, setLocationText] = useState("");

  const [prayers, setPrayers] = useState([]); // [{key, label, timeString, hour, minute}]
  const [errorMsg, setErrorMsg] = useState("");

  const [checkedPrayers, setCheckedPrayers] = useState({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  });

  const progressScale = useRef(new Animated.Value(1)).current;

  // keep "now" ticking to update countdown (every 30s is enough)
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // get location once
  useEffect(() => {
    let active = true;

    async function initLocation() {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg(
            "Konum izni verilmedi. Namaz vakitlerini gösterebilmek için konum izni gereklidir."
          );
          setLoading(false);
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        if (!active) return;

        setCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });

        const geo = await Location.reverseGeocodeAsync(pos.coords);
        if (geo && geo.length > 0) {
          const g = geo[0];
          const city = g.city || g.subregion || g.region || "";
          const country = g.country || "";
          setLocationText(
            [city, country].filter(Boolean).join(", ")
          );
        }
      } catch (e) {
        setErrorMsg("Konum alınırken bir hata oluştu.");
        setLoading(false);
      }
    }

    initLocation();
    return () => {
      active = false;
    };
  }, []);

  // fetch data whenever coords or dateOffset changes
  useEffect(() => {
    if (!coords) return;
    loadPrayerDataForOffset(dateOffset);
  }, [coords, dateOffset]);

  async function loadPrayerDataForOffset(offsetDays) {
    try {
      setLoading(true);
      setErrorMsg("");

      const base = new Date();
      base.setHours(0, 0, 0, 0);
      const target = new Date(base);
      target.setDate(base.getDate() + offsetDays);

      const day = String(target.getDate()).padStart(2, "0");
      const month = String(target.getMonth() + 1).padStart(2, "0");
      const year = target.getFullYear();

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=3&timezonestring=${encodeURIComponent(
        timeZone
      )}`;

      const res = await fetch(url);
      const json = await res.json();

      if (json.code !== 200 || !json.data?.timings) {
        setErrorMsg("Namaz vakitleri alınamadı.");
        setLoading(false);
        return;
      }

      // header dates
      const hijri = json.data?.date?.hijri;
      const greg = json.data?.date?.gregorian;

      if (greg?.date) {
        const formatted = new Date(target).toLocaleDateString("tr-TR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        });
        const timeStr = now.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        setGregorianText(`${formatted} • ${timeStr}`);
      } else {
        setGregorianText("");
      }

      if (hijri) {
        const hijriStr = `${hijri.day} ${hijri.month?.en || ""} ${hijri.year} (Hicrî)`;
        setHijriText(hijriStr);
      } else {
        setHijriText("");
      }

      // timings -> prayers array
      const timings = json.data.timings;
      const parsed = PRAYER_ORDER.map((key) => {
        const raw = timings[key];
        if (!raw) return null;
        const timePart = raw.split(" ")[0]; // e.g. "06:25 (BST)" -> "06:25"
        const [hStr, mStr] = timePart.split(":");
        const hour = parseInt(hStr, 10);
        const minute = parseInt(mStr, 10);
        if (Number.isNaN(hour) || Number.isNaN(minute)) return null;

        return {
          key,
          label: PRAYER_LABELS[key],
          timeString: timePart,
          hour,
          minute,
        };
      }).filter(Boolean);

      setPrayers(parsed);

      // reset checklist when day changes
      setCheckedPrayers({
        Fajr: false,
        Dhuhr: false,
        Asr: false,
        Maghrib: false,
        Isha: false,
      });

      setLoading(false);
    } catch (e) {
      setErrorMsg("Namaz vakitleri alınırken bir hata oluştu.");
      setLoading(false);
    }
  }

  function getNextPrayerInfo() {
    if (prayers.length === 0) return null;
    if (dateOffset !== 0) return null; // countdown only for *today*

    const nowDate = now;
    let next = null;

    for (const p of prayers) {
      const dt = new Date(nowDate);
      dt.setHours(p.hour, p.minute, 0, 0);
      if (dt > nowDate) {
        next = { ...p, dateObj: dt };
        break;
      }
    }

    if (!next) return null;

    const diffMs = next.dateObj - nowDate;
    if (diffMs <= 0) return null;

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return {
      label: next.label,
      timeString: next.timeString,
      hours,
      minutes,
    };
  }

  function togglePrayer(key) {
    setCheckedPrayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  const completedCount = PRAYER_ORDER.reduce(
    (acc, key) => (checkedPrayers[key] ? acc + 1 : acc),
    0
  );

  // animate progress circle on completedCount change
  useEffect(() => {
    Animated.sequence([
      Animated.timing(progressScale, {
        toValue: 1.1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(progressScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [completedCount]);

  const nextInfo = getNextPrayerInfo();

  return (
    <View >
      {/* HEADER */}
      <View style={styles.headerCard}>
        <View style={styles.headerTopRow}>
          <Text style={styles.headerTitle}>Bugünün Namazları</Text>
        </View>

        <View style={styles.headerDateBlock}>
          {gregorianText ? (
            <Text style={styles.gregorianText}>{gregorianText}</Text>
          ) : null}
          {hijriText ? (
            <Text style={styles.hijriText}>{hijriText}</Text>
          ) : null}
          {locationText ? (
            <Text style={styles.locationText}>{locationText}</Text>
          ) : null}
        </View>

        <View style={styles.headerNavRow}>
          <TouchableOpacity style={styles.navBtn} onPress={() => setDateOffset((d) => d - 1)} >
            <Text style={styles.navBtnText}>← Önceki gün</Text>
          </TouchableOpacity>

          <Text style={styles.navCenterText}>
            {dateOffset === 0 ? "Bugün" : null}
          </Text>

          <TouchableOpacity style={[ styles.navBtn, dateOffset === 0 && { opacity: 0.4 }, ]} disabled={dateOffset === 0} onPress={() => setDateOffset((d) => Math.min(0, d + 1))} >
            <Text style={styles.navBtnText}>Sonraki gün →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TOP ROW: Next prayer + circular progress */}
      <View style={styles.topRow}>
        {/* TOP LEFT: Next prayer */}
        <View style={styles.nextCard}>
          <Text style={styles.sectionLabel}>Sıradaki vakit</Text>

          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />
          ) : nextInfo ? (
            <>
              <Text style={styles.nextPrayerName}>{nextInfo.label}</Text>
              <Text style={styles.nextPrayerTime}>
                {nextInfo.timeString}
              </Text>
              <Text style={styles.nextPrayerCountdown}>
                {nextInfo.hours > 0
                  ? `${nextInfo.hours} s `
                  : ""}
                {nextInfo.minutes} dk kaldı
              </Text>
            </>
          ) : (
            <Text style={styles.nextPrayerFallback}>
              Bugün için sonraki vakit bulunamadı.
            </Text>
          )}
        </View>

        {/* TOP RIGHT: Progress circle */}
        <View style={styles.progressCard}>
          <Text style={styles.sectionLabel}>Günlük hedef</Text>

          <Animated.View
            style={[
              styles.progressCircle,
              { transform: [{ scale: progressScale }] },
            ]}
          >
            <Text style={styles.progressMainText}>
              {completedCount}/5
            </Text>
            <Text style={styles.progressSubText}>kılındı</Text>
          </Animated.View>

          {completedCount === 5 ? (
            <Text style={styles.progressCompletedText}>
              Maşallah! 🌙
            </Text>
          ) : (
            <Text style={styles.progressHintText}>
              Bugün kılınan farz namaz sayısı.
            </Text>
          )}
        </View>
      </View>

      {/* CENTER: checklist */}
      <View style={styles.checklistCard}>
        <Text style={styles.checklistTitle}>Namaz Listesi</Text>

        {loading && prayers.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#fff" />
            <Text style={styles.loadingText}>Yükleniyor...</Text>
          </View>
        ) : errorMsg ? (
          <Text style={styles.errorText}>{errorMsg}</Text>
        ) : (
          <ScrollView
            style={{ maxHeight: 400 }}
            contentContainerStyle={{ paddingVertical: 8 }}
          >
            {prayers.map((p) => {
              const checked = checkedPrayers[p.key];
              return (
                <TouchableOpacity
                  key={p.key}
                  style={styles.checkRow}
                  onPress={() => togglePrayer(p.key)}
                  activeOpacity={0.7}
                >
                  <View style={[ styles.checkboxOuter, checked && styles.checkboxOuterChecked, ]}  >
                    {checked && <View style={styles.checkboxInner} />}
                  </View>

                  <View style={styles.checkTextCol}>
                    <Text style={styles.checkPrayerName}>{p.label}</Text>
                    <Text style={styles.checkPrayerTime}>
                      {p.timeString}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },

  headerCard: {
    // backgroundColor: "rgba(0,0,0,0.65)",
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    borderRadius: 14,
    padding: 14,
    marginTop: 40,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
  },
  headerDateBlock: {
    marginBottom: 8,
  },
  gregorianText: {
    fontSize: 14,
    color: "#ffffff",
  },
  hijriText: {
    fontSize: 13,
    color: "#d0d7e2",
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: "#aab4c8",
    marginTop: 2,
  },
  headerNavRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  navBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  navBtnText: {
    color: "#ffffff",
    fontSize: 12,
  },
  navCenterText: {
    color: "#ffdd55",
    fontSize: 14,
    fontWeight: "600",
  },

  topRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#aab4c8",
    marginBottom: 4,
  },

  nextCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  nextPrayerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
  },
  nextPrayerTime: {
    fontSize: 16,
    color: "#ffdd55",
    marginTop: 2,
  },
  nextPrayerCountdown: {
    fontSize: 13,
    color: "#d0d7e2",
    marginTop: 4,
  },
  nextPrayerFallback: {
    fontSize: 13,
    color: "#aab4c8",
    marginTop: 6,
  },

  progressCard: {
    width: 130,
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    borderRadius: 14,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  progressCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#ffdd55",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,221,85,0.08)",
    marginVertical: 6,
  },
  progressMainText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
  },
  progressSubText: {
    fontSize: 12,
    color: "#d0d7e2",
  },
  progressCompletedText: {
    fontSize: 12,
    color: "#9df0a8",
    textAlign: "center",
  },
  progressHintText: {
    fontSize: 11,
    color: "#aab4c8",
    textAlign: "center",
  },

  checklistCard: {
    flex: 0,
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    borderRadius: 14,
    paddingTop: 12,
    paddingLeft: 12,
    paddingBottom: 0,
    paddingRight: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 6,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: "#d0d7e2",
    textAlign: "center",
  },
  errorText: {
    fontSize: 13,
    color: "#ffb3b3",
    textAlign: "center",
    marginTop: 8,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },
  checkboxOuter: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkboxOuterChecked: {
    borderColor: "#9df0a8",
    backgroundColor: "rgba(157,240,168,0.15)",
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#9df0a8",
  },
  checkTextCol: {
    flex: 1,
  },
  checkPrayerName: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
  },
  checkPrayerTime: {
    fontSize: 13,
    color: "#d0d7e2",
    marginTop: 2,
  },
});
