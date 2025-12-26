// files/PaywallPage.js
import React, { useState } from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import ScaledText from "./ScaledText";

const PLANS = [
  {
    id: "islam_yolu_premium_monthly",
    title: "Aylık Premium",
    subtitle: "Esnek, istediğin zaman iptal et",
    price: "₺99,99 / ay",
    tag: "Başlamak için ideal",
  },
  {
    id: "islam_yolu_premium_yearly",
    title: "Yıllık Premium",
    subtitle: "12 ay huzurlu kullanım",
    price: "₺999,99 / yıl",
    tag: "En çok tercih edilen",
    recommended: true,
  },
  {
    id: "premium_islamyolu_lifetime",
    title: "Ömür Boyu Premium",
    subtitle: "Tek seferlik ödeme, ömür boyu erişim",
    price: "₺1.499,99",
    tag: "Bir kere öde, hep kullan",
  },
];

export default function PaywallPage({
  onBack,
  onPurchase, // (productId) => void
  onRestore,  // () => void
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(
    "islam_yolu_premium_yearly"
  );

  const selectedPlan =
    PLANS.find((p) => p.id === selectedPlanId) || PLANS[1] || PLANS[0];

  function handleConfirmPurchase() {
    if (onPurchase) {
      onPurchase(selectedPlan.id);
    } else {
      Alert.alert(
        "Demo",
        `Seçilen ürün: ${selectedPlan.title}\n\nGerçek satın alma mantığını RevenueCat ile bağlayacağız.`
      );
    }
  }

  function handleRestore() {
    if (onRestore) {
      onRestore();
    } else {
      Alert.alert(
        "Demo",
        "Satın alımları geri yükleme mantığı henüz bağlanmadı."
      );
    }
  }

  function openPrivacy() {
    const url = "https://islam-yolu.com/privacy.html";
    Linking.openURL(url).catch(() => {
      Alert.alert("Hata", "Bağlantı açılamadı.");
    });
  }

  function openTerms() {
    const url = "https://islam-yolu.com/terms.html";
    Linking.openURL(url).catch(() => {
      Alert.alert("Hata", "Bağlantı açılamadı.");
    });
  }

  return (
    <View style={styles.root}>
      {/* Decorative Islamic background elements */}
      <View style={styles.decorLayer}>
        <View style={[styles.decorCircle, styles.decorCircleLarge]} />
        <View style={[styles.decorCircle, styles.decorCircleSmall]} />
        <Text style={[styles.decorIcon, { top: 140, right: 40 }]}>☪</Text>
        <Text style={[styles.decorIcon, { top: 220, left: 40 }]}>✶</Text>
      </View>

      {/* Content overlay */}
      <View style={styles.overlay}>
          {/* Top section: badge + title + subtitle */}
          <View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>Reklamsız Premium Deneyim</Text>
            </View>

            <ScaledText baseSize={26} style={styles.title}>
              İslam Yolu Premium
            </ScaledText>

            {/* Benefits */}
            <View style={styles.benefitsBox}>
              <Text style={styles.benefitsTitle}>Premium ile neler açılır?</Text>

              <View style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>☑</Text>
                <Text style={styles.benefitText}>
                  Tüm reklamlar kaldırılır.
                </Text>
              </View>

              <View style={styles.benefitRow}>
                <Text style={styles.benefitIcon}>☑</Text>
                <Text style={styles.benefitText}>
                  Yeni özelliklerin daha hızlı gelmesine katkı sağlarsın.
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom section: stacked offers + CTA */}
          <View style={styles.bottomSection}>
            {/* Stacked plan cards */}
            {PLANS.map((plan) => {
              const isActive = plan.id === selectedPlanId;
              return (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => setSelectedPlanId(plan.id)}
                  activeOpacity={0.9}
                  style={[
                    styles.planCard,
                    isActive && styles.planCardActive,
                  ]}
                >
                  {/* Badge */}
                  {plan.recommended && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedBadgeText}>
                        En çok tercih edilen
                      </Text>
                    </View>
                  )}

                  <View style={styles.planRow}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          styles.planTitle,
                          isActive && styles.planTitleActive,
                        ]}
                      >
                        {plan.title}
                      </Text>
                      <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                      {plan.tag ? (
                        <Text style={styles.planTag}>{plan.tag}</Text>
                      ) : null}
                    </View>

                    <View style={styles.planPriceBox}>
                      <Text
                        style={[
                          styles.planPrice,
                          isActive && styles.planPriceActive,
                        ]}
                      >
                        {plan.price}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Main action */}
            <TouchableOpacity
              onPress={handleConfirmPurchase}
              style={styles.primaryButton}
              activeOpacity={0.9}
            >
              <Text style={styles.primaryButtonText}>
                {selectedPlan.title} ile devam et
              </Text>
            </TouchableOpacity>

            {/* Restore */}
            <TouchableOpacity
              onPress={handleRestore}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>
                Satın alımları geri yükle
              </Text>
            </TouchableOpacity>

            {/* Legal */}
            <View style={styles.legalRow}>
              <TouchableOpacity onPress={openTerms}>
                <Text style={styles.legalLink}>Kullanım Koşulları</Text>
              </TouchableOpacity>
              <Text style={{ color: "#64748b", marginHorizontal: 4 }}>•</Text>
              <TouchableOpacity onPress={openPrivacy}>
                <Text style={styles.legalLink}>Gizlilik Politikası</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.legalNote}>
              Ödemeler Apple hesabın üzerinden tahsil edilir. Fiyatlar bölgeye
              göre değişiklik gösterebilir. Abonelik planları, dönem sonunda
              otomatik yenilenir ve Ayarlar üzerinden iptal edilebilir.
            </Text>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#02130a", // deep green base
  },
  decorLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#02130a",
  },
  decorCircle: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.16)", // soft green glow
  },
  decorCircleLarge: {
    width: 260,
    height: 260,
    top: -40,
    right: -80,
  },
  decorCircleSmall: {
    width: 170,
    height: 170,
    bottom: 40,
    left: -40,
  },
  decorIcon: {
    position: "absolute",
    fontSize: 48,
    color: "rgba(209,250,229,0.25)",
  },
  overlay: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: "rgba(0,0,0,0.45)", // glass overlay
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingBottom: 16,
  },
  pill: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "rgba(34,197,94,0.16)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(45,212,191,0.4)",
    marginBottom: 10,
  },
  pillText: {
    fontSize: 12,
    color: "#a7f3d0",
    fontWeight: "600",
  },
  title: {
    color: "#f9fafb",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    color: "#e5e7eb",
    textAlign: "center",
    marginHorizontal: 10,
  },

  benefitsBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.85)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(148,163,184,0.4)",
  },
  benefitsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e5e7eb",
    marginBottom: 8,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  benefitIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#bbf7d0",
    marginTop: 2,
  },
  benefitText: {
    flex: 1,
    fontSize: 13,
    color: "#cbd5f5",
  },

  bottomSection: {
    marginTop: 24,
  },
  planCard: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "rgba(15,23,42,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,184,0.4)",
  },
  planCardActive: {
    backgroundColor: "rgba(22,163,74,0.16)",
    borderColor: "rgba(74,222,128,0.9)",
    shadowColor: "#22c55e",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  recommendedBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: "rgba(52,211,153,0.22)",
    marginBottom: 6,
  },
  recommendedBadgeText: {
    fontSize: 11,
    color: "#bbf7d0",
    fontWeight: "600",
  },
  planRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  planTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e5e7eb",
  },
  planTitleActive: {
    color: "#f9fafb",
  },
  planSubtitle: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 2,
  },
  planTag: {
    fontSize: 11,
    color: "#a5b4fc",
    marginTop: 4,
  },
  planPriceBox: {
    marginLeft: 10,
    alignItems: "flex-end",
  },
  planPrice: {
    fontSize: 14,
    color: "#e5e7eb",
    fontWeight: "600",
  },
  planPriceActive: {
    color: "#bbf7d0",
  },

  primaryButton: {
    marginTop: 12,
    backgroundColor: "#22c55e",
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#052e16",
  },
  secondaryButton: {
    marginTop: 8,
    borderRadius: 999,
    paddingVertical: 9,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(226,232,240,0.6)",
  },
  secondaryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#e5e7eb",
  },

  legalRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  legalLink: {
    color: "#bae6fd",
    fontSize: 11,
    textDecorationLine: "underline",
  },
  legalNote: {
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
  },
});
