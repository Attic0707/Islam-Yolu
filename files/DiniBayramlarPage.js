import { TouchableOpacity, View, Text, StyleSheet, ScrollView } from "react-native";
import ScaledText from "./ScaledText";

const DEBUG = false;

export default function DiniBayramlarPage({ onBack }) {

    const SECTIONS_2025 = [
      {
        title: "Kandiller ve Mübarek Geceler",
        items: [
          {
            date: "02 Ocak 2025",
            day: "Perşembe",
            name: "Regaib Kandili",
          },
          {
            date: "26 Ocak 2025",
            day: "Pazar",
            name: "Miraç Kandili",
          },
          {
            date: "13 Şubat 2025",
            day: "Perşembe",
            name: "Berat Kandili",
          },
          {
            date: "26 Mart 2025",
            day: "Çarşamba",
            name: "Kadir Gecesi",
          },
        ],
      },
      {
        title: "Ramazan ve Ramazan Bayramı",
        items: [
          {
            date: "01 Mart 2025",
            day: "Cumartesi",
            name: "Ramazan-ı Şerif'in Başlangıcı",
          },
          {
            date: "29 Mart 2025",
            day: "Cumartesi",
            name: "Ramazan Bayramı Arefesi",
          },
          {
            date: "30 Mart 2025",
            day: "Pazar",
            name: "Ramazan Bayramı (1. Gün)",
          },
          {
            date: "31 Mart 2025",
            day: "Pazartesi",
            name: "Ramazan Bayramı (2. Gün)",
          },
          {
            date: "01 Nisan 2025",
            day: "Salı",
            name: "Ramazan Bayramı (3. Gün)",
          },
        ],
      },
      {
        title: "Kurban Bayramı",
        items: [
          {
            date: "05 Haziran 2025",
            day: "Perşembe",
            name: "Kurban Bayramı Arefesi",
          },
          {
            date: "06 Haziran 2025",
            day: "Cuma",
            name: "Kurban Bayramı (1. Gün)",
          },
          {
            date: "07 Haziran 2025",
            day: "Cumartesi",
            name: "Kurban Bayramı (2. Gün)",
          },
          {
            date: "08 Haziran 2025",
            day: "Pazar",
            name: "Kurban Bayramı (3. Gün)",
          },
          {
            date: "09 Haziran 2025",
            day: "Pazartesi",
            name: "Kurban Bayramı (4. Gün)",
          },
        ],
      },
      {
        title: "Diğer Özel Günler",
        items: [
          {
            date: "01 Ocak 2025",
            day: "Çarşamba",
            name: "Üç Ayların Başlangıcı",
          },
          {
            date: "26 Haziran 2025",
            day: "Perşembe",
            name: "Hicrî Yılbaşı (1 Muharrem 1447)",
          },
        ],
      },
    ];

    return (
      <View style={[ styles.overlay, { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 }, ]} >
        {/* Back button */}
        <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
          <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
        </TouchableOpacity>

        <Text style={styles.bayramTitle}>2026 Dini Günler & Bayramlar</Text>
        <Text style={styles.bayramSubtitle}>
          Ramazan ve Kurban Bayramı ile kandil geceleri, 2026 yılı için özetlenmiştir.
        </Text>

        <ScrollView style={{ marginTop: 10, width: "100%" }}>
          {SECTIONS_2025.map((section) => (
            <View key={section.title} style={styles.bayramSection}>
              <ScaledText baseSize={14} style={styles.bayramSectionTitle}>
                {section.title}
              </ScaledText>

              {section.items.map((item) => (
                <View key={item.name + item.date} style={styles.bayramCard}>
                  <View style={{ flex: 1 }}>
                    <ScaledText baseSize={14} style={styles.bayramName}> {item.name} </ScaledText>
                    <ScaledText baseSize={14} style={styles.bayramDate}> {item.date} · {item.day} </ScaledText>
                  </View>
                </View>
              ))}
            </View>
          ))}

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
    backButton: {
        alignSelf: "flex-start",
        marginLeft: 20,
        marginBottom: 10,
    },
    backButtonText: {
        color: "white",
        fontSize: 18,
    },
    bayramTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center",
      marginBottom: 6,
    },
    bayramSubtitle: {
      fontSize: 14,
      color: "#d0d7e2",
      textAlign: "center",
      marginBottom: 10,
    },
    bayramSection: {
      marginTop: 16,
    },
    bayramSectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: "#ffdd55",
      marginBottom: 8,
    },
    bayramCard: {
      backgroundColor: "rgba(255,255,255,0.06)",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 10,
      marginBottom: 8,
    },
    bayramName: {
      fontSize: 16,
      color: "#ffffff",
      marginBottom: 2,
    },
    bayramDate: {
      fontSize: 14,
      color: "#d0d7e2",
    },

});