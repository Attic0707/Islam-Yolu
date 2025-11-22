import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, View, Text, ActivityIndicator, ScrollView, StyleSheet,} from "react-native";
import * as Location from "expo-location";
import ScaledText from "./ScaledText";

const DEBUG = false;

export default function ImsakiyePage({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [days, setDays] = useState([]);
  const [hijriYear, setHijriYear] = useState(null);

  useEffect(() => {
    loadRamadanCalendar();
  }, []);

  async function loadRamadanCalendar() {
    try {
      setLoading(true);

      // 1) Location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Konum gerekli",
          "İmsakiyeyi gösterebilmek için konum izni vermen gerekiyor."
        );
        setLoading(false);
        return;
      }

      const pos = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = pos.coords;

      // 2) Get today's Hijri year dynamically
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();

      const hijriRes = await fetch(
        `https://api.aladhan.com/v1/gToH?date=${dd}-${mm}-${yyyy}`
      );
      const hijriJson = await hijriRes.json();

      const hYear = hijriJson?.data?.hijri?.year;
      if (!hYear) {
        if (DEBUG) console.log("Could not read Hijri year from gToH", hijriJson);
        Alert.alert("Hata", "Hicri yıl bilgisi alınamadı.");
        setLoading(false);
        return;
      }
      setHijriYear(hYear);

      // 3) Fetch full RAMADAN calendar for that Hijri year & your location
      const url = `https://api.aladhan.com/v1/hijriCalendar?latitude=${latitude}&longitude=${longitude}&method=3&month=9&year=${hYear}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json.data) {
        Alert.alert("Hata", "Ramazan imsakiyesi alınamadı.");
        setLoading(false);
        return;
      }

      setDays(json.data);
      setLoading(false);
    } catch (err) {
      if (DEBUG) console.log("loadRamadanCalendar error:", err);
      Alert.alert("Hata", "İmsakiye yüklenemedi.");
      setLoading(false);
    }
  }

  return (
      <View style={[ styles.overlay, { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 }, ]} >
        {/* Back button */}
        <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
          <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
        </TouchableOpacity>

      <Text style={styles.Imsakiye_title}>
        {hijriYear ? `Ramazan İmsakiyesi ${hijriYear} ` : "Ramazan İmsakiyesi"}
      </Text>
      <Text style={styles.Imsakiye_subtitle}>
        Konumuna göre Ramazan ayı için günlük imsak, iftar ve diğer vakitler.
      </Text>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} color="#ffffff" />
      ) : (
        <ScrollView style={{ marginTop: 10, width: "100%" }}>
          {days.map((d, i) => (
            <View key={i} style={styles.Imsakiye_row}>
              <ScaledText baseSize={16} style={styles.Imsakiye_date}>
                {/* Hijri date, always starts from 1 Ramazan now */}
                {d.date.hijri.day} Ramazan {d.date.hijri.year}
                {"\n"}
                {d.date.readable}
              </ScaledText>

              <View style={{ marginLeft: 15 }}>
                <ScaledText baseSize={14} style={styles.Imsakiye_time}>
                  İmsak: {d.timings.Fajr.split(" ")[0]}
                </ScaledText>
                <ScaledText baseSize={14} style={styles.Imsakiye_time}>
                  Güneş: {d.timings.Sunrise.split(" ")[0]}
                </ScaledText>

                <ScaledText baseSize={14} style={styles.Imsakiye_time}>
                  Öğle: {d.timings.Dhuhr.split(" ")[0]}
                </ScaledText>

                <ScaledText baseSize={14} style={styles.Imsakiye_time}>
                  İkindi: {d.timings.Asr.split(" ")[0]}
                </ScaledText>

                <ScaledText baseSize={18} style={styles.Imsakiye_time}>
                  İftar: {d.timings.Maghrib.split(" ")[0]}
                </ScaledText>

                <ScaledText baseSize={14} style={styles.Imsakiye_time}>
                  Yatsı: {d.timings.Isha.split(" ")[0]}
                </ScaledText>
              </View>
            </View>
          ))}

          <View style={{ height: 40 }} />
        </ScrollView>
      )}
    </View>
  );
}

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
  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
  },
  Imsakiye_title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#ffffff",
    marginBottom: 4,
  },
  Imsakiye_subtitle: {
    fontSize: 14,
    color: "#d0d7e2",
    textAlign: "center",
    marginBottom: 12,
  },
  Imsakiye_row: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  Imsakiye_date: {
    fontSize: 15,
    color: "#ffffff",
    fontWeight: "600",
    maxWidth: 130,
  },
  Imsakiye_time: {
    fontSize: 14,
    color: "#ddd",
  },
});
