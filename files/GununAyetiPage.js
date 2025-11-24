import React, { useEffect, useState, useRef } from "react";
import {TouchableOpacity, View, Text, StyleSheet, ScrollView } from "react-native";
import ScaledText from "./ScaledText";

const DEBUG = false;

export default function GununAyetiPage({ onBack }) {
    const [loading, setLoading] = useState(false);
    const [verseLoading, setVerseLoading] = useState(false);
    const [verseRef, setVerseRef] = useState("");
    const [verseArabic, setVerseArabic] = useState("");
    const [verseTurkish, setVerseTurkish] = useState("");
    const [verseNameTr, setVerseNameTr] = useState("");

    useEffect(() => {
        const init = async () => {
        try {
            await fetchRandomVerse();
        } catch (e) {
            if (DEBUG) console.log("init error:", e);
        }
        };

        init();
    }, []);

    async function fetchRandomVerse() {
        try {
        setVerseLoading(true);
        const res = await fetch("https://api.quran.com/api/v4/verses/random");
        const json = await res.json();
        if (DEBUG)
            console.log("random verse response:", JSON.stringify(json));

        const verseInfo = json?.verse;
        if (!verseInfo?.verse_key) {
            if (DEBUG) console.warn("No verse_key in random verse response");
            setVerseLoading(false);
            return;
        }

        const verseKey = verseInfo.verse_key;
        setVerseRef(verseKey);

        const [surahIdStr, verseNumberStr] = verseKey.split(":");
        const surahId = parseInt(surahIdStr, 10);
        const verseNumber = parseInt(verseNumberStr, 10);

        if (!surahId || !verseNumber) {
            if (DEBUG)
            console.warn("Could not parse surah/verse from", verseKey);
            setVerseLoading(false);
            return;
        }

        const trRes = await fetch(
            `https://api.acikkuran.com/surah/${surahId}/verse/${verseNumber}`
        );
        const trJson = await trRes.json();
        if (DEBUG)
            console.log("acikkuran verse response:", JSON.stringify(trJson));

        const verseData = trJson?.data;
        if (!verseData) {
            if (DEBUG) console.warn("No data in Açık Kuran response");
            setVerseLoading(false);
            return;
        }

        const arabicText = verseData.verse || "";
        setVerseArabic(arabicText);

        const turkishText = verseData.translation?.text || "";
        setVerseTurkish(turkishText);

        const verseNameTr = verseData.surah?.name || "";
        setVerseNameTr(verseNameTr);

        setVerseLoading(false);
        } 
        catch (err) {
            if (DEBUG) console.log("fetchRandomVerse error:", err);
            setVerseLoading(false);
        }
    }

    async function handleShare() {
        try {
        let message = `Günün ayeti: "${verseTurkish}". \nEzan vakitlerini ve Kur’an’dan günlük ayetleri gösteren bu uygulamaya bir göz at!`;
        await Share.share({
            message: message,
        });
        } catch (error) {
        if (DEBUG) console.log("Share error:", error);
        }
    }

    return (
        <View style={[ styles.overlay, { justifyContent: "flex-start", paddingTop: 60, paddingHorizontal: 20, }, ]} >
        {/* Back button (same pattern as other pages) */}
        <TouchableOpacity onPress={onBack} style={{ alignSelf: "flex-start", marginBottom: 10 }} >
          <Text style={{ color: "#ffffff", fontSize: 18 }}>← </Text>
        </TouchableOpacity>

        <Text style={styles.verseTitle}>Günün Ayeti</Text>
        <Text style={styles.verseSubtitle}> Bugünün Ayeti </Text>

        <View style={styles.verseContainer}>
            <ScrollView style={styles.scroll}>
                {verseLoading ? ( <ScaledText baseSize={14} style={styles.verseLoading}> Bismillahirrahmanirrahim... </ScaledText>) : 
                verseArabic ?  (
                    <View>
                        <ScaledText baseSize={14} style={styles.verseArabic}>{verseArabic}</ScaledText>

                        {verseTurkish ? ( <ScaledText baseSize={14} style={styles.verseTr}>{verseTurkish}</ScaledText> ) : null}

                        <ScaledText baseSize={14} style={styles.verseLabel}>{verseNameTr} Suresi</ScaledText>

                        {verseRef ? ( <ScaledText baseSize={14} style={styles.verseRef}>({verseRef})</ScaledText> ) : null}
                    </View> ) : (

                <ScaledText baseSize={14} style={styles.verseLoading}> Ayet alınamadı. Aşağıdan tekrar deneyebilirsin. </ScaledText>
              )}
            </ScrollView>
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
    verseTitle: {
      fontSize: 26,
      fontWeight: "700",
      color: "#ffffff",
      textAlign: "center",
      marginBottom: 6,
    },
    verseSubtitle: {
        fontSize: 14,
        color: "#d0d7e2",
        textAlign: "center",
        marginBottom: 12,
    },
    verseContainer: {
        marginTop: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderRadius: 12,
    },
    scroll: {
        padding: 16,
    },
    verseLoading: {
        fontSize: 14,
        color: "#9aa4b8",
        textAlign: "center",
    },
    verseArabic: {
        fontSize: 20,
        color: "#ffffff",
        textAlign: "center",
        marginBottom: 8,
    },
    verseTr: {
        fontSize: 16,
        color: "#d0d7e2",
        textAlign: "center",
    },
    verseLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "#d0d7e2",
        marginBottom: 8,
        textAlign: "center",
    },
    verseRef: {
        fontSize: 14,
        color: "#9aa4b8",
        textAlign: "center",
        marginTop: 4,
    },
});