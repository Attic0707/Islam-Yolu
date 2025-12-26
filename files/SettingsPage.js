import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, Alert, Switch, Share, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsPage({ onBack, onSettingsChanged, isPremium = false, onGoPremium, }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [backgroundChanged, setBackgroundChange] = useState(false);
  const [darkTheme, setDarkTheme] = useState(true);
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [cooldown, setCooldown] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await AsyncStorage.getItem("settings");
        if (s) {
          const parsed = JSON.parse(s);
          setSoundEnabled(parsed.soundEnabled ?? true);
          setVibrationEnabled(parsed.vibrationEnabled ?? true);
          setNotificationsEnabled(parsed.notificationsEnabled ?? true);
          setBackgroundChange(parsed.backgroundChanged ?? false);
          setDarkTheme(parsed.darkTheme ?? true);
          setAdsEnabled(parsed.adsEnabled ?? true);
        }
      } catch (e) {
        console.log("Settings load error:", e);
      }
    };
    load();
  }, []);

  async function save() {
    const data = {
      soundEnabled,
      vibrationEnabled,
      darkTheme,
      notificationsEnabled,
      backgroundChanged,
      adsEnabled,
    };

    if (onSettingsChanged) {
      onSettingsChanged(data);
    }

    try {
      await AsyncStorage.setItem("settings", JSON.stringify(data));
      Alert.alert("Kaydedildi", "Ayarlar başarıyla kaydedildi.");
    } catch (e) {
      console.log("Settings save error:", e);
      Alert.alert("Hata", "Ayarlar kaydedilirken bir hata oluştu.");
    }
  }

  function triggerBackgroundChange() {
    if (cooldown) return;

    setCooldown(true);
    setTimeout(() => setCooldown(false), 2000);

    const newVal = true;
    setBackgroundChange(newVal);

    if (onSettingsChanged) {
      onSettingsChanged({
        soundEnabled,
        vibrationEnabled,
        darkTheme,
        notificationsEnabled,
        backgroundChanged: newVal,
        adsEnabled,
      });
    }
  }

  async function shareTheApp() {
    try {
      await Share.share({
        message:
          "İslam Yolu uygulamasını dene. Ezan vakitleri, Kur’an, ilham sayfası ve daha fazlası: https://apps.apple.com/tr/app/islam-yolu/id6755595522",
      });
    } catch (e) {
      console.log("Share error:", e);
    }
  }

  return (
    <View style={[ styles.overlay, { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 }, ]}  >
      <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
        <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
      </TouchableOpacity>

      <Text style={styles.settingsTitle}>Ayarlar</Text>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Bildirim sesi</Text>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Titreşim</Text>
        <Switch value={vibrationEnabled} onValueChange={setVibrationEnabled} />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Ezan Bildirimleri</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={setNotificationsEnabled}
        />
      </View>

      <TouchableOpacity style={styles.settingRow} onPress={triggerBackgroundChange} disabled={cooldown}>
        <Text style={[styles.settingLabel, cooldown && { opacity: 0.5 }]}  >
          Arka Plan Değiştir
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settingRow} onPress={shareTheApp} disabled={cooldown}>
        <Text style={[styles.settingLabel, cooldown && { opacity: 0.5 }]}  >
          İslam Yolu'nu Paylaş
        </Text>
      </TouchableOpacity>

      {/* ==== Premium / Ads section ==== */}
      {isPremium ? (
        <View style={[styles.premiumActiveBox]}>
          <Text style={[styles.premiumActiveTitle]}>🌟 Premium Aktif</Text>
          <Text style={styles.premiumActiveSubtitle}>Reklamlar kaldırıldı - Allah razı olsun </Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.premiumBox} onPress={() => onGoPremium && onGoPremium()}>
          <Text style={styles.premiumTitle}>Reklamları Kaldır</Text>
          <Text style={styles.premiumSubtitle}>
            Premium sürüme geçerek ömür boyu reklamsız kullanın.
          </Text>

          <View style={styles.benefitsList}>
            <Text style={styles.benefitLine}> Tüm reklamlar kaldırılır</Text>
            <Text style={styles.benefitLine}> Uygulamanın gelişimine destek olun 💛</Text>
          </View>

          <View style={styles.premiumButton}>
            <Text style={styles.premiumButtonText}>Premium’a Geç</Text>
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={save} style={styles.settingsSaveBtn}>
        <Text style={styles.settingsSaveText}>Kaydet</Text>
      </TouchableOpacity>
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
  settingsTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  settingLabel: {
    fontSize: 16,
    color: "#ffffff",
    flexShrink: 1,
  },
  settingsSaveBtn: {
    marginTop: 20,
    backgroundColor: "#ffdd55",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  settingsSaveText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333333",
  },
premiumBox: {
  backgroundColor: "rgba(255, 221, 85, 0.10)",
  borderWidth: 1.5,
  borderColor: "rgba(255, 221, 85, 0.8)",
  borderRadius: 14,
  padding: 16,
  marginTop: 20,
},

premiumTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#ffdd55",
  marginBottom: 4,
},

premiumSubtitle: {
  fontSize: 13,
  color: "#ffffff",
  opacity: 0.85,
  marginBottom: 10,
},

benefitsList: {
  marginVertical: 6,
},

benefitLine: {
  color: "#ffffff",
  fontSize: 13,
  marginBottom: 4,
  opacity: 0.9,
},

premiumButton: {
  marginTop: 12,
  backgroundColor: "#ffdd55",
  paddingVertical: 10,
  borderRadius: 10,
  alignItems: "center",
},

premiumButtonText: {
  fontWeight: "700",
  fontSize: 15,
  color: "#333333",
},

// --- active premium ---
premiumActiveBox: {
  backgroundColor: "rgba(255, 221, 85, 0.15)",
  borderColor: "#ffdd55",
  borderWidth: 1.5,
  borderRadius: 14,
  padding: 16,
  marginTop: 20,
},

premiumActiveTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#ffdd55",
  marginBottom: 6,
},

premiumActiveSubtitle: {
  fontSize: 13,
  color: "#ffffff",
  opacity: 0.85,
},
});
