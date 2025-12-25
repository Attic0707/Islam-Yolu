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

      <View style={styles.settingRow}>
        <TouchableOpacity onPress={triggerBackgroundChange} disabled={cooldown}>
          <Text style={[styles.settingLabel, cooldown && { opacity: 0.5 }]}  >
            Arka Plan Değiştir
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.settingRow}>
        <TouchableOpacity onPress={shareTheApp} disabled={cooldown}>
          <Text style={[styles.settingLabel, cooldown && { opacity: 0.5 }]}  >
            İslam Yolu'nu Paylaş
          </Text>
        </TouchableOpacity>
      </View>

      {/* ==== Premium / Ads section ==== */}
      {isPremium ? (
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Reklamlar</Text>
          <Text style={[ styles.settingLabel, { color: "#ffdd55", fontSize: 14, textAlign: "right", }, ]} >
            Premium aktif – reklamlar kaldırıldı
          </Text>
        </View>
      ) : (
        <View style={styles.settingRow}>
          <TouchableOpacity onPress={() => { if (onGoPremium) onGoPremium(); }} >
            <Text style={[ styles.settingLabel, { color: "#ffdd55", fontWeight: "700" }, ]} >
              Reklamları Kaldır (Premium)
            </Text>
            <Text style={{ color: "#ffffff", fontSize: 12, marginTop: 4, maxWidth: 260, }} >
              Bir kerelik ödeme ile tüm reklamları kaldırın ve uygulamayı geliştirmemize destek olun.
            </Text>
          </TouchableOpacity>
        </View>
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
});
