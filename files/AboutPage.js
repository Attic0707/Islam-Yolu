import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import ScaledText from "./ScaledText";

export default function AboutPage({ onBack }) {
  function openIcons8() {
    Linking.openURL("https://icons8.com/").catch(() => {});
  }

  return (
    <View
      style={[
        styles.overlay,
        { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 },
      ]}
    >
      {/* Back button (same pattern as other pages) */}
      <TouchableOpacity
        onPress={onBack}
        style={{ alignSelf: "flex-start", marginBottom: 10 }}
      >
        <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
      </TouchableOpacity>

      {/* Title */}
      <ScaledText
        baseSize={24}
        style={{
          color: "#fff",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        Hakkında
      </ScaledText>

      <ScrollView style={{ width: "100%" }}>
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: 16,
            borderRadius: 12,
            marginBottom: 30,
          }}
        >
          <ScaledText
            baseSize={16}
            style={{
              color: "#fff",
              marginBottom: 12,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            İslam Yolu — Tüm İslami Araçlar Bir Arada
          </ScaledText>

          <ScaledText baseSize={14} style={{ color: "#ddd", marginBottom: 10 }}>
            Bu uygulama; namaz vakitleri, kıble pusulası, ilmihal, hadisler,
            tesbih, dua ve daha birçok faydalı içeriği tek bir yerde sunmak için
            geliştirilmiştir.
          </ScaledText>

          <ScaledText baseSize={14} style={{ color: "#ddd", marginBottom: 10 }}>
            Amaç; günlük ibadetleri kolaylaştıran, sade, hızlı ve modern bir
            İslami yardımcı uygulama sağlamaktır.
          </ScaledText>

          <ScaledText baseSize={14} style={{ color: "#ddd", marginBottom: 10 }}>
            Uygulamadaki tüm içerikler güvenilir kaynaklardan alınmış olup
            bilgilendirme amaçlıdır. Fıkhi konularda son karar için lütfen
            ilgili resmi kurumlara veya âlimlere danışınız.
          </ScaledText>

          {/* Contact Section */}
          <ScaledText
            baseSize={16}
            style={{
              color: "#fff",
              marginTop: 18,
              marginBottom: 8,
              fontWeight: "500",
            }}
          >
            İletişim
          </ScaledText>

          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:islamyoluapp@gmail.com")}
          >
            <ScaledText
              baseSize={14}
              style={{
                color: "#8ecbff",
                textDecorationLine: "underline",
              }}
            >
              E-posta: islamyoluapp@gmail.com
            </ScaledText>
          </TouchableOpacity>

          {/* Icons / Assets Credits */}
          <ScaledText
            baseSize={16}
            style={{
              color: "#fff",
              marginTop: 18,
              marginBottom: 4,
              fontWeight: "500",
            }}
          >
            Görseller ve İkonlar
          </ScaledText>

          <ScaledText baseSize={13} style={{ color: "#ddd", marginBottom: 4 }}>
            Bazı ikonlar, lisanslı bir ikon kütüphanesi olan Icons8’den
            alınmıştır.
          </ScaledText>

          <TouchableOpacity onPress={openIcons8}>
            <ScaledText
              baseSize={13}
              style={{
                color: "#8ecbff",
                textDecorationLine: "underline",
              }}
            >
              https://icons8.com
            </ScaledText>
          </TouchableOpacity>

          {/* Version info */}
          <ScaledText baseSize={12} style={{ color: "#aaa", marginTop: 25, textAlign: "center", }} >
            Sürüm: 1.1.19{"\n"}© 2025 - Tüm hakları saklıdır.
          </ScaledText>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
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
});
