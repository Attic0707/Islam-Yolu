import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Modal, Image, } from "react-native";
import ScaledText from "./ScaledText";

export default function NamazPage({ onBack }) {
  const sections = [
    {
      title: "1. Hazırlık",
      text:
        "• Abdest alınır.\n" +
        "• Elbiseler ve namaz kılınacak yer temiz olur.\n" +
        "• Kıble yönüne dönülür.",
    },
    {
      title: "2. Niyet",
      text:
        "Hangi namaz kılınacaksa kalpten niyet edilir: “Niyet ettim Allah rızası için bugünkü farz/farz olmayan ... namazını kılmaya.”",
    },
    {
      title: "3. İftitah Tekbiri",
      text:
        "Eller kulak hizasına kaldırılır, “Allahu Ekber” denir ve eller bağlanır. Bu, namaza giriş tekbiridir.",
    },
    {
      title: "4. Kıyam (Ayakta duruş)",
      text:
        "• Eller bağlanır (Hanefî’de erkekler göbek altında, kadınlar göğüs üzerinde).\n" +
        "• Önce ‘Sübhaneke’ okunur.\n" +
        "• Ardından Fâtiha Sûresi ve kısa bir sûre veya birkaç ayet okunur.",
    },
    {
      title: "5. Rükû",
      text:
        "“Allahu Ekber” diyerek eğilinir, bel düz olur, eller dizler üzerine konur.\n" +
        "En az üç kere: “Sübhâne rabbiyel azîm” denir.",
    },
    {
      title: "6. Rükû’dan kalkış",
      text:
        "“Semiallâhu limen hamideh” diyerek doğrulunur.\n" +
        "Ardından: “Rabbenâ lekel hamd” denir.",
    },
    {
      title: "7. Secde",
      text:
        "“Allahu Ekber” diyerek secdeye gidilir.\n" +
        "Alın, burun, iki el, iki diz ve ayak parmakları yere dayanır.\n" +
        "En az üç kere: “Sübhâne rabbiyel a’lâ” denir.",
    },
    {
      title: "8. İki secde arası oturuş",
      text:
        "“Allahu Ekber” diyerek secdeden kalkılır, dizler üzerinde kısa bir süre oturulur.\n" +
        "Sonra tekrar secdeye varılır ve aynı tesbihler tekrar edilir.",
    },
    {
      title: "9. Rekâtlar",
      text:
        "• Farz namazların rekât sayıları:\n" +
        "  - Sabah: 2 rekât farz (öncesinde 2 sünnet)\n" +
        "  - Öğle: 4 rekât farz (öncesinde ve sonrasında sünnetler)\n" +
        "  - İkindi: 4 rekât farz (öncesinde sünnet)\n" +
        "  - Akşam: 3 rekât farz (sonrasında sünnet)\n" +
        "  - Yatsı: 4 rekât farz (öncesinde ve sonrasında sünnet, ardından vitir).",
    },
    {
      title: "10. Tahiyyat oturuşu ve selam",
      text:
        "Son rekâtta oturulur, ‘Ettehiyyâtü, Allahümme salli, Allahümme barik, Rabbena’ duaları okunur.\n" +
        "Önce sağ tarafa, sonra sol tarafa selam verilir: “Esselâmü aleyküm ve rahmetullah.”",
    },
  ];

  // Which indices have an illustration (3–8 => 2..7)
  function isIllustratedIndex(index) {
    return index >= 2 && index <= 7;
  }

  // Optional: if you want different sequences per step, adjust here
  function getPoseSequenceForIndex(index) {
    // Shared mini-animation for now
    return ["qiyam", "ruku", "sujud", "sitting"];
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [activeStep, setActiveStep] = useState(null); // { title, text }
  const [poseSequence, setPoseSequence] = useState([]);
  const [poseIndex, setPoseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const currentPose =
    poseSequence.length > 0 ? poseSequence[poseIndex] : "qiyam";

  function openStepModal(sec, index) {
    const seq = getPoseSequenceForIndex(index);
    setActiveStep({ title: sec.title, text: sec.text });
    setPoseSequence(seq);
    setPoseIndex(0);
    setIsAnimating(false);
    setModalVisible(true);
  }

  function closeModal() {
    setModalVisible(false);
    setIsAnimating(false);
    setPoseIndex(0);
  }

  function toggleAnimation() {
    if (!poseSequence.length) return;
    setIsAnimating((prev) => !prev);
  }

  // Tiny loop animation: change pose every 800ms
  useEffect(() => {
    if (!isAnimating || !poseSequence.length || !modalVisible) return;

    const id = setInterval(() => {
      setPoseIndex((prev) => (prev + 1) % poseSequence.length);
    }, 800);

    return () => clearInterval(id);
  }, [isAnimating, poseSequence, modalVisible]);

  return (
    <View
      style={[
        styles.overlay,
        { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        style={{ alignSelf: "flex-start", marginBottom: 10 }}
      >
        <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
      </TouchableOpacity>

      <Text style={styles.guideTitle}>Namaz Nasıl Kılınır?</Text>
      <Text style={styles.guideSubtitle}>Farz namazlar için temel adımlar.</Text>

      <ScrollView style={{ marginTop: 10, width: "100%" }}>
        {sections.map((sec, index) => {
          const illustrated = isIllustratedIndex(index);
          const CardWrapper = illustrated ? TouchableOpacity : View;
          const cardProps = illustrated ? { activeOpacity: 0.8, onPress: () => openStepModal(sec, index), } : {};

          return (
            <CardWrapper
              key={sec.title}
              style={[
                styles.guideCard,
                illustrated && styles.guideCardInteractive,
              ]}
              {...cardProps}
            >
              <ScaledText baseSize={14} style={styles.guideStepTitle}>
                {sec.title}
              </ScaledText>
              <ScaledText baseSize={14} style={styles.guideStepText}>
                {sec.text}
              </ScaledText>
              {illustrated && (
                <Text style={styles.tapHint}>Figürü görmek için dokun</Text>
              )}
            </CardWrapper>
          );
        })}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* ===== MODAL: FIGURE DEMO + ANIMATION ===== */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={closeModal} >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            {activeStep && (
              <>
                <Text style={styles.modalTitle}>{activeStep.title}</Text>
                <Text style={styles.modalText}>{activeStep.text}</Text>

                {/* Figure area */}
                <View style={styles.figureArea}>
                  <PrayerFigure pose={currentPose} />
                </View>

                {/* Tiny play/pause button */}
                {poseSequence.length > 0 && (
                  <TouchableOpacity onPress={toggleAnimation} style={styles.playButton} >
                    <Text style={styles.playButtonText}>
                      {isAnimating ? "⏸ Animasyonu Durdur" : "▶ Animasyonu Oynat"}
                    </Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.modalHint}>
                  Bu şema, hareketin temel duruşlarını sırasıyla gösterir.
                </Text>

                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton} >
                  <Text style={styles.modalCloseText}>Kapat</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function PrayerFigure({ pose }) {
  const map = {
    qiyam: require("../assets/images/namaz/qiyam.png"),
    ruku: require("../assets/images/namaz/ruku.png"),
    sujud: require("../assets/images/namaz/sujud.png"),
    sitting: require("../assets/images/namaz/sitting.png"),
    takbir: require("../assets/images/namaz/tekbir.png"),
  };

  const source = map[pose] || map.qiyam;

  return (
    <Image
      source={source}
      style={{ width: 140, height: 140 }}
      resizeMode="contain"
    />
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
  guideTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },
  guideSubtitle: {
    fontSize: 14,
    color: "#d0d7e2",
    textAlign: "center",
    marginBottom: 12,
  },
  guideCard: {
    backgroundColor: "rgba(255,255,255,0.06)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  guideCardInteractive: {
    borderWidth: 1,
    borderColor: "rgba(255,221,85,0.6)",
  },
  guideStepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffdd55",
    marginBottom: 4,
  },
  guideStepText: {
    fontSize: 14,
    color: "#f2f2f7",
    lineHeight: 20,
  },
  tapHint: {
    marginTop: 6,
    fontSize: 12,
    color: "#d0d7e2",
  },

  // ---- Modal ----
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    width: "86%",
    backgroundColor: "#12141c",
    borderRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffdd55",
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: "#f2f2f7",
    lineHeight: 20,
    marginBottom: 12,
  },
  modalHint: {
    marginTop: 8,
    fontSize: 12,
    color: "#9aa4b8",
    textAlign: "center",
  },
  modalCloseButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ffdd55",
    alignItems: "center",
  },
  modalCloseText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
  playButton: {
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255,221,85,0.7)",
    alignSelf: "center",
  },
  playButtonText: {
    fontSize: 13,
    color: "#ffdd55",
    fontWeight: "600",
  },

  // ---- Figure styles ----
  figureArea: {
    marginTop: 8,
    marginBottom: 4,
    alignItems: "center",
    justifyContent: "center",
    height: 140,
  },
  figureRoot: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },

  head: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ffdd55",
    marginBottom: 4,
  },
  headSmall: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ffdd55",
    marginRight: 4,
  },
  torso: {
    width: 12,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#ffffff",
  },
  legs: {
    width: 2,
    height: 32,
    backgroundColor: "#ffffff",
    marginTop: 4,
  },

  standingBody: {
    alignItems: "center",
  },

  armsUpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
    marginTop: -32,
    marginBottom: 10,
  },
  armUp: {
    width: 4,
    height: 34,
    backgroundColor: "#ffffff",
    borderRadius: 2,
  },

  armsCross: {
    width: 26,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginTop: -12,
    marginBottom: 14,
  },

  // Rükû
  rukuBodyRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rukuTorso: {
    width: 32,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
  },
  rukuLegs: {
    width: 2,
    height: 30,
    backgroundColor: "#ffffff",
    marginLeft: -4,
    marginTop: 16,
  },

  // Secde
  sujudBody: {
    width: 80,
    height: 50,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  sujudHead: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#ffdd55",
    alignSelf: "flex-start",
  },
  sujudArms: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginTop: 4,
    alignSelf: "flex-start",
  },
  sujudLegs: {
    width: 30,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffffff",
    marginTop: 4,
    alignSelf: "flex-end",
  },

  // Sitting
  sittingBody: {
    alignItems: "center",
  },
  sittingTorso: {
    width: 12,
    height: 26,
    borderRadius: 6,
    backgroundColor: "#ffffff",
  },
  sittingLegs: {
    width: 32,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    marginTop: 4,
  },
});
