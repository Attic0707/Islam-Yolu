import React, { useEffect, useMemo, useRef, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Dimensions, ActivityIndicator, Animated, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";

const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const PRAYER_LABELS = { Fajr: "Sabah", Dhuhr: "Öğle", Asr: "İkindi", Maghrib: "Akşam", Isha: "Yatsı",};

export default function NamazTakipPage({ onBack }) {
  const { height: H } = Dimensions.get("window");

  const isVeryShort = H <= 600;
  const isShort = H <= 700;

  // small-screen tuning
  const PAD_X = isVeryShort ? 12 : 14;
  const GAP = isVeryShort ? 8 : 10;

  const headerPad = isVeryShort ? 10 : 12;
  const headerTitleSize = isVeryShort ? 16 : 18;
  const metaSize = isVeryShort ? 12 : 13;

  const circleSize = isVeryShort ? 64 : 72;
  const circleBorderRadius = circleSize / 2;
  const progressMainSize = isVeryShort ? 16 : 18;

  const progressScale = useRef(new Animated.Value(1)).current;

  const [loading, setLoading] = useState(true);
  const [coords, setCoords] = useState(null);

  const [dateOffset, setDateOffset] = useState(0);
  const [now, setNow] = useState(new Date());

  const [gregorianText, setGregorianText] = useState("");
  const [hijriText, setHijriText] = useState("");
  const [locationText, setLocationText] = useState("");

  const [prayers, setPrayers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const [checkedPrayers, setCheckedPrayers] = useState({
    Fajr: false,
    Dhuhr: false,
    Asr: false,
    Maghrib: false,
    Isha: false,
  });

  // keep "now" ticking
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30 * 1000);
    return () => clearInterval(id);
  }, []);

  // get location once
  useEffect(() => {
    let active = true;

    async function initLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
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
          setLocationText([city, country].filter(Boolean).join(", "));
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

  useEffect(() => {
    if (!coords) return;
    loadPrayerDataForOffset(dateOffset);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

      const timings = json.data.timings;
      const parsed = PRAYER_ORDER.map((key) => {
        const raw = timings[key];
        if (!raw) return null;
        const timePart = raw.split(" ")[0];
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
    if (dateOffset !== 0) return null;

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

  const completedCount = useMemo(
    () =>
      PRAYER_ORDER.reduce(
        (acc, key) => (checkedPrayers[key] ? acc + 1 : acc),
        0
      ),
    [checkedPrayers]
  );

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

  if (isShort || isVeryShort) {
    return (
      <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
        <View style={[styles.container, { paddingHorizontal: PAD_X }]}>
          {/* HEADER */}
          <View style={[styles.card, { padding: headerPad, marginBottom: GAP }]}>
            <View style={styles.headerCompactRow}>
              {/* LEFT */}
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text
                  style={[styles.headerTitle, { fontSize: headerTitleSize }]}
                  numberOfLines={1}
                >
                  Bugünün Namazları
                </Text>

                {!!gregorianText && (
                  <Text
                    style={[styles.gregorianText, { fontSize: metaSize }]}
                    numberOfLines={1}
                  >
                    {gregorianText}
                  </Text>
                )}
                {!!hijriText && (
                  <Text
                    style={[styles.hijriText, { fontSize: metaSize - 1 }]}
                    numberOfLines={1}
                  >
                    {hijriText}
                  </Text>
                )}
                {!!locationText && (
                  <Text
                    style={[styles.locationText, { fontSize: metaSize - 2 }]}
                    numberOfLines={1}
                  >
                    {locationText}
                  </Text>
                )}

                <View style={{ marginTop: 8 }}>
                  <Text style={[styles.sectionLabel, { marginBottom: 2 }]}>
                    Sıradaki vakit
                  </Text>

                  {loading ? (
                    <Text
                      style={[styles.nextPrayerFallback, { fontSize: 12 }]}
                      numberOfLines={1}
                    >
                      Yükleniyor...
                    </Text>
                  ) : nextInfo ? (
                    <Text style={[styles.nextInline, { fontSize: 12 }]} numberOfLines={2}>
                      <Text style={{ fontWeight: "700", color: "#ffffff" }}>
                        {nextInfo.label}
                      </Text>
                      <Text style={{ color: "#ffdd55" }}>  {nextInfo.timeString}</Text>
                      <Text style={{ color: "#d0d7e2" }}>
                        {"  "}(
                        {nextInfo.hours > 0 ? `${nextInfo.hours}s ` : ""}
                        {nextInfo.minutes}dk)
                      </Text>
                    </Text>
                  ) : (
                    <Text
                      style={[styles.nextPrayerFallback, { fontSize: 12 }]}
                      numberOfLines={2}
                    >
                      Bugün için sonraki vakit bulunamadı.
                    </Text>
                  )}
                </View>
              </View>

              {/* RIGHT  */}
              <View style={styles.progressRightCol}>
                <Animated.View
                  style={[
                    styles.progressCircle,
                    {
                      width: circleSize,
                      height: circleSize,
                      borderRadius: circleBorderRadius,
                      transform: [{ scale: progressScale }],
                    },
                  ]}
                >
                  <Text style={[styles.progressMainText, { fontSize: progressMainSize }]}>
                    {completedCount}/5
                  </Text>
                  <Text style={styles.progressSubText}>kılındı</Text>
                </Animated.View>

                {completedCount === 5 ? (
                  <Text style={styles.progressCompletedText} numberOfLines={1}>
                    🌙
                  </Text>
                ) : (
                  <Text style={styles.progressHintText} numberOfLines={2}>
                    Bugün
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* CHECKLIST (cannot overflow) */}
          <View style={[styles.card, styles.checklistCard]}>
            <Text style={styles.checklistTitle} numberOfLines={1}>
              Namaz Listesi
            </Text>

            {loading && prayers.length === 0 ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.loadingText}>Yükleniyor...</Text>
              </View>
            ) : errorMsg ? (
              <Text style={styles.errorText}>{errorMsg}</Text>
            ) : (
              <View style={styles.checklistRowsWrap}>
                {prayers.map((p, idx) => {
                  const checked = checkedPrayers[p.key];
                  const isLast = idx === prayers.length - 1;

                  return (
                    <TouchableOpacity
                      key={p.key}
                      style={[styles.checkRow, isLast && { borderBottomWidth: 0 }]}
                      onPress={() => togglePrayer(p.key)}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.checkboxOuter, checked && styles.checkboxOuterChecked]}>
                        {checked && <View style={styles.checkboxInner} />}
                      </View>

                      <View style={styles.checkTextCol}>
                        <Text style={styles.checkPrayerName} numberOfLines={1}>
                          {p.label}
                        </Text>
                        <Text style={styles.checkPrayerTime} numberOfLines={1}>
                          {p.timeString}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={stylesRegular.overlay}>
      {/* HEADER */}
      <View style={stylesRegular.headerCard}>
        <View style={stylesRegular.headerTopRow}>
          <Text style={stylesRegular.headerTitle}>Bugünün Namazları</Text>
        </View>

        <View style={stylesRegular.headerDateBlock}>
          {gregorianText ? (
            <Text style={stylesRegular.gregorianText}>{gregorianText}</Text>
          ) : null}
          {hijriText ? (
            <Text style={stylesRegular.hijriText}>{hijriText}</Text>
          ) : null}
          {locationText ? (
            <Text style={stylesRegular.locationText}>{locationText}</Text>
          ) : null}
        </View>

        <View style={stylesRegular.headerNavRow}>
          <TouchableOpacity
            style={stylesRegular.navBtn}
            onPress={() => setDateOffset((d) => d - 1)}
          >
            <Text style={stylesRegular.navBtnText}>← Önceki gün</Text>
          </TouchableOpacity>

          <Text style={stylesRegular.navCenterText}>
            {dateOffset === 0 ? "Bugün" : null}
          </Text>

          <TouchableOpacity
            style={[
              stylesRegular.navBtn,
              dateOffset === 0 && { opacity: 0.4 },
            ]}
            disabled={dateOffset === 0}
            onPress={() => setDateOffset((d) => Math.min(0, d + 1))}
          >
            <Text style={stylesRegular.navBtnText}>Sonraki gün →</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={stylesRegular.topRow}>
        <View style={stylesRegular.nextCard}>
          <Text style={stylesRegular.sectionLabel}>Sıradaki vakit</Text>

          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 8 }} />
          ) : nextInfo ? (
            <>
              <Text style={stylesRegular.nextPrayerName}>{nextInfo.label}</Text>
              <Text style={stylesRegular.nextPrayerTime}>
                {nextInfo.timeString}
              </Text>
              <Text style={stylesRegular.nextPrayerCountdown}>
                {nextInfo.hours > 0 ? `${nextInfo.hours} s ` : ""}
                {nextInfo.minutes} dk kaldı
              </Text>
            </>
          ) : (
            <Text style={stylesRegular.nextPrayerFallback}>
              Bugün için sonraki vakit bulunamadı.
            </Text>
          )}
        </View>

        <View style={stylesRegular.progressCard}>
          <Text style={stylesRegular.sectionLabel}>Günlük hedef</Text>

          <Animated.View
            style={[
              stylesRegular.progressCircle,
              { transform: [{ scale: progressScale }] },
            ]}
          >
            <Text style={stylesRegular.progressMainText}>{completedCount}/5</Text>
            <Text style={stylesRegular.progressSubText}>kılındı</Text>
          </Animated.View>

          {completedCount === 5 ? (
            <Text style={stylesRegular.progressCompletedText}>Maşallah! 🌙</Text>
          ) : (
            <Text style={stylesRegular.progressHintText}>
              Bugün kılınan farz namaz sayısı.
            </Text>
          )}
        </View>
      </View>

      <View style={stylesRegular.checklistCard}>
        <Text style={stylesRegular.checklistTitle}>Namaz Listesi</Text>

        {loading && prayers.length === 0 ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#fff" />
            <Text style={stylesRegular.loadingText}>Yükleniyor...</Text>
          </View>
        ) : errorMsg ? (
          <Text style={stylesRegular.errorText}>{errorMsg}</Text>
        ) : (
          <View>
            {prayers.map((p) => {
              const checked = checkedPrayers[p.key];
              return (
                <TouchableOpacity
                  key={p.key}
                  style={stylesRegular.checkRow}
                  onPress={() => togglePrayer(p.key)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      stylesRegular.checkboxOuter,
                      checked && stylesRegular.checkboxOuterChecked,
                    ]}
                  >
                    {checked && <View style={stylesRegular.checkboxInner} />}
                  </View>
                  <View style={stylesRegular.checkTextCol}>
                    <Text style={stylesRegular.checkPrayerName}>{p.label}</Text>
                    <Text style={stylesRegular.checkPrayerTime}>{p.timeString}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}

const stylesRegular = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: "stretch",
    justifyContent: "flex-start",
  },

  headerCard: {
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

const styles = StyleSheet.create({
  safe: { flex: 1 },

  container: {
    flex: 1,
    backgroundColor: "transparent",
    paddingTop: 8,
    paddingBottom: 8,
  },

  card: {
    backgroundColor: "rgba(0, 0, 0, 0.39)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  headerTitle: { fontWeight: "700", color: "#ffffff" },
  gregorianText: { color: "#ffffff", marginTop: 6 },
  hijriText: { color: "#d0d7e2", marginTop: 2 },
  locationText: { color: "#aab4c8", marginTop: 2 },

  headerCompactRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },

  sectionLabel: { fontSize: 12, color: "#aab4c8", marginBottom: 4 },

  nextInline: { color: "#d0d7e2" },
  nextPrayerFallback: { color: "#aab4c8", marginTop: 6 },

  progressRightCol: {
    alignItems: "center",
  },

  progressCircle: {
    borderWidth: 3,
    borderColor: "#ffdd55",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,221,85,0.08)",
    marginVertical: 6,
  },
  progressMainText: { fontWeight: "700", color: "#ffffff" },
  progressSubText: { fontSize: 12, color: "#d0d7e2" },
  progressCompletedText: { fontSize: 12, color: "#9df0a8", textAlign: "center" },
  progressHintText: { fontSize: 11, color: "#aab4c8", textAlign: "center" },

  checklistCard: {
    flex: 1, 
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  checklistTitle: { fontWeight: "700", color: "#ffffff", marginBottom: 6 },

  loadingWrap: { paddingVertical: 14 },
  loadingText: { marginTop: 8, fontSize: 13, color: "#d0d7e2", textAlign: "center" },
  errorText: { fontSize: 13, color: "#ffb3b3", textAlign: "center", marginTop: 8 },

  checklistRowsWrap: {
    flex: 1,
    minHeight: 0,
  },

  checkRow: {
    flex: 1,
    minHeight: 0,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    paddingVertical: 0,
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
  checkboxOuterChecked: { borderColor: "#9df0a8", backgroundColor: "rgba(157,240,168,0.15)" },
  checkboxInner: { width: 10, height: 10, borderRadius: 3, backgroundColor: "#9df0a8" },

  checkTextCol: {
    flex: 1,
    minWidth: 0,
  },

  checkPrayerName: { color: "#ffffff", fontWeight: "600", fontSize: 14 },
  checkPrayerTime: { color: "#d0d7e2", marginTop: 2, fontSize: 12 },
});