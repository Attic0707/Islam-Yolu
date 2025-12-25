import {TouchableOpacity, View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import ScaledText from "./ScaledText";

export default function HelpPage({ onBack }) {
    return (
        <View style={[ styles.overlay, { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20, }, ]} >
        {/* Back button (same pattern as other pages) */}
        <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
          <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
        </TouchableOpacity>

        <ScaledText baseSize={24} style={{ color: "#fff", fontWeight: "600", textAlign: "center" }}>
          Destek & İletişim
        </ScaledText>

        <View style={{ marginTop: 20, backgroundColor: "rgba(0,0,0,0.4)", padding: 16, borderRadius: 12 }}>
          <ScaledText baseSize={15} style={{ color: "#ddd", marginBottom: 8 }}>
            Sorular, öneriler veya hata bildirimleri için bizimle iletişime geçebilirsiniz.
          </ScaledText>

          <TouchableOpacity onPress={() => Linking.openURL("mailto:islamyoluapp@gmail.com")}>
            <ScaledText baseSize={15} style={{ color: "#8ecbff", textDecorationLine: "underline" }}>
              E-posta: islamyoluapp@gmail.com
            </ScaledText>
          </TouchableOpacity>

          <ScaledText baseSize={14} style={{ color: "#aaa", marginTop: 20 }}>
            Geri bildirimleriniz uygulamayı geliştirmemize yardımcı olur.
          </ScaledText>
        </View>
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