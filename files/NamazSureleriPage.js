// files/NamazSureleriPage.js
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Audio } from "expo-av";
import ScaledText from "./ScaledText";

export default function NamazSureleriPage({ onBack }) {
  const [currentPlayingKey, setCurrentPlayingKey] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const soundRef = useRef(null);

  // ---- DATA ----
  const SECTIONS = [
    {
      title: "Namazda Okunan Sûreler",
      items: [
        {
          key: "fatiha",
          name: "Fâtiha Suresi",
          arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ
الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمٖينَ
الرَّحْمٰنِ الرَّحٖيمِ
مَالِكِ يَوْمِ الدّٖينِ
اِيَّاكَ نَعْبُدُ وَاِيَّاكَ نَسْتَعٖينُ
اهْدِنَا الصِّرَاطَ الْمُسْتَقٖيمَ
صِرَاطَ الَّذٖينَ اَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّآلّٖينَ`,
          roman: `Bismillahirrahmânirrahîm.
Elhamdu lillâhi Rabbil âlemîn.
Errahmânirrahîm.
Mâliki yevmiddîn.
İyyâke na‘budu ve iyyâke neste‘în.
İhdinessırâtel müstakîm.
Sırâtallezîne en‘amte aleyhim ğayril mağdûbi aleyhim ve leddâllîn.`,
          audio: require("../assets/sounds/fatiha.mp3"),
        },
        {
          key: "ikhlas",
          name: "İhlâs Suresi",
          arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ
قُلْ هُوَ اللّٰهُ اَحَدٌ
اللّٰهُ الصَّمَدُ
لَمْ يَلِدْ وَلَمْ يُولَدْ
وَلَمْ يَكُنْ لَّهُ كُفُوًا اَحَدٌ`,
          roman: `Bismillahirrahmânirrahîm.
Kul huvallâhu ehad.
Allâhussamed.
Lem yelid ve lem yûled.
Ve lem yekun lehû kufuven ehad.`,
          audio: require("../assets/sounds/ihlas.mp3"),
        },
        {
          key: "felak",
          name: "Felâk Suresi",
          arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ
قُلْ اَعُوذُ بِرَبِّ الْفَلَقِ
مِنْ شَرِّ مَا خَلَقَ
وَمِنْ شَرِّ غَاسِقٍ اِذَا وَقَبَ
وَمِنْ شَرِّ النَّفّاثَاتِ فِى الْعُقَدِ
وَمِنْ شَرِّ حَاسِدٍ اِذَا حَسَدَ`,
          roman: `Bismillahirrahmânirrahîm.
Kul e‘ûzü birabbil-felek.
Min şerri mâ halak.
Ve min şerri ğâsikın izâ vekab.
Ve min şerrin-neffâsâti fil ‘ukad.
Ve min şerri hâsidin izâ hased.`,
          audio: require("../assets/sounds/felak.mp3"),
        },
        {
          key: "nas",
          name: "Nâs Suresi",
          arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ
قُلْ اَعُوذُ بِرَبِّ النَّاسِ
مَلِكِ النَّاسِ
اِلٰهِ النَّاسِ
مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ
الَّذٖى يُوَسْوِسُ فِى صُدُورِ النَّاسِ
مِنَ الْجِنَّةِ وَالنَّاسِ`,
          roman: `Bismillahirrahmânirrahîm.
Kul e‘ûzü birabbin-nâs.
Melikin-nâs.
İlâhin-nâs.
Min şerril-vesvâsil-hannâs.
Ellezî yuvesvisu fî sudûrin-nâs.
Minel cinneti ven-nâs.`,
          audio: require("../assets/sounds/nas.mp3"),
        },
        {
          key: "kevser",
          name: "Kevser Suresi",
          arabic: `بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ
اِنَّا اَعْطَيْنَاكَ الْكَوْثَرَ
فَصَلِّ لِرَبِّكَ وَانْحَرْ
اِنَّ شَانِئَكَ هُوَ الْاَبْتَرُ`,
          roman: `Bismillahirrahmânirrahîm.
İnnâ a‘taynâkel kevser.
Fe-salli li rabbike venhar.
İnne şâni’eke huvel ebter.`,
          audio: require("../assets/sounds/kevser.mp3"),
        },
      ],
    },
    {
      title: "Namaz Duaları",
      items: [
        {
          key: "ettehiyyatu",
          name: "Ettehiyyatü Duası",
          arabic: `اَلتَّحِيَّاتُ لِلّٰهِ وَالصَّلَوٰتُ وَالطَّيِّبَاتُ
اَلسَّلَامُ عَلَيْكَ اَيُّهَا النَّبِىُّ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ
اَلسَّلَامُ عَلَيْنَا وَعَلٰى عِبَادِ اللّٰهِ الصَّالِحِينَ
اَشْهَدُ اَنْ لَا اِلٰهَ اِلَّا اللّٰهُ
وَاَشْهَدُ اَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ`,
          roman: `Ettehiyyâtü lillâhi vessalavâtü vettayyibât.
Esselâmü aleyke eyyühen-nebiyyü ve rahmetullâhi ve berakâtüh.
Esselâmü aleynâ ve alâ ibâdillâhissâlihîn.
Eşhedü en lâ ilâhe illallâh
ve eşhedü enne Muhammeden abdühû ve resûlüh.`,
          audio: require("../assets/sounds/ettehiyyatu.mp3"),
        },
        {
          key: "salli",
          name: "Salli ve Bârik Duaları",
          arabic: ` اَللّٰهُمَّ صَلِّ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ
كَمَا صَلَّيْتَ عَلٰى اِبْرَاهٖيمَ وَعَلٰى آلِ اِبْرَاهٖيمَ
اِنَّكَ حَمٖيدٌ مَجٖيدٌ`,
          roman: `Allâhümme salli alâ Muhammedin ve alâ âli Muhammed,
kemâ salleyte alâ İbrâhîme ve alâ âli İbrâhîm,
inneke hamîdün mecîd.`,
          audio: require("../assets/sounds/salli.mp3"),
        },
        {
          key: "barik",
          name: "Salli ve Bârik Duaları",
          arabic: `اَللّٰهُمَّ بَارِكْ عَلٰى مُحَمَّدٍ وَعَلٰى آلِ مُحَمَّدٍ
كَمَا بَارَكْتَ عَلٰى اِبْرَاهٖيمَ وَعَلٰى آلِ اِبْرَاهٖيمَ
اِنَّكَ حَمٖيدٌ مَجٖيدٌ`,
          roman: `Allâhümme bârik alâ Muhammedin ve alâ âli Muhammed,
kemâ bârekte alâ İbrâhîme ve alâ âli İbrâhîm,
inneke hamîdün mecîd.`,
          audio: require("../assets/sounds/barik.mp3"),
        },
        {
          key: "rabbenagfirli",
          name: "Rabbenâ Duası (Kısa)",
          arabic: `رَبَّنَا اغْفِرْ لِى وَلِوَالِدَىَّ
وَلِلْمُؤْمِنٖينَ يَوْمَ يَقُومُ الْحِسَابُ`,
          roman: `Rabbenâğfir lî ve li vâlîdeyye
ve lil-mü’minîne yevme yekûmul hisâb.`,
          // no audio yet
        },
      ],
    },
  ];

  async function stopCurrentSound() {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.log("stopCurrentSound error", e);
    } finally {
      setCurrentPlayingKey(null);
      setIsPlaying(false);
    }
  }

  async function handlePlayPress(item) {
    try {
      // toggle off if same item and currently playing
      if (currentPlayingKey === item.key && isPlaying) {
        await stopCurrentSound();
        return;
      }

      if (!item.audio) {
        Alert.alert("Ses bulunamadı", "Bu okuma için ses dosyası eklenmemiş.");
        return;
      }

      // stop any existing sound
      await stopCurrentSound();

      const { sound } = await Audio.Sound.createAsync(item.audio);
      soundRef.current = sound;

      // when playback finishes, reset state
      soundRef.current.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          stopCurrentSound();
        }
      });

      setCurrentPlayingKey(item.key);
      setIsPlaying(true);
      await soundRef.current.playAsync();
    } catch (e) {
      console.log("Audio play error:", e);
      Alert.alert("Hata", "Ses oynatılırken bir sorun oluştu.");
      await stopCurrentSound();
    }
  }

  useEffect(() => {
    // cleanup on unmount
    return () => {
      stopCurrentSound();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      style={[
        styles.overlay,
        { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20 },
      ]}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={async () => {
          await stopCurrentSound();
          onBack();
        }}
        style={{ alignSelf: "flex-start", marginBottom: 10 }}
      >
        <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
      </TouchableOpacity>

      <Text style={styles.title}>Namaz Sûreleri & Duaları</Text>

      <ScrollView style={{ marginTop: 10, width: "100%" }}>
        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 24 }}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item) => {
              const isItemPlaying = currentPlayingKey === item.key && isPlaying;

              return (
                <View key={item.key} style={styles.card}>
                  <View style={styles.cardHeaderRow}>
                    <ScaledText baseSize={16} style={styles.surahName}>
                      {item.name}
                    </ScaledText>

                    {item.audio && (
                      <TouchableOpacity
                        onPress={() => handlePlayPress(item)}
                        style={[
                          styles.audioButton,
                          isItemPlaying && styles.audioButtonActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.audioButtonText,
                            isItemPlaying && styles.audioButtonTextActive,
                          ]}
                        >
                          {isItemPlaying ? "⏸ Durdur" : "▶ Dinle"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <ScaledText baseSize={20} style={styles.surahArabic}>
                    {item.arabic}
                  </ScaledText>
                  <ScaledText baseSize={20} style={styles.romanText}>
                    {item.roman}
                  </ScaledText>
                </View>
              );
            })}
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
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#ffdd55",
    fontWeight: "700",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  surahName: {
    color: "#fff",
    fontWeight: "600",
    marginRight: 10,
    flexShrink: 1,
  },
  audioButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },
  audioButtonActive: {
    backgroundColor: "#ffdd55",
    borderColor: "#ffdd55",
  },
  audioButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  audioButtonTextActive: {
    color: "#333",
  },
  surahArabic: {
    fontSize: 22,
    color: "#ffffff",
    textAlign: "right",
    lineHeight: 34,
    marginBottom: 8,
  },
  romanText: {
    fontSize: 14,
    color: "#d0d7e2",
    lineHeight: 22,
  },
});