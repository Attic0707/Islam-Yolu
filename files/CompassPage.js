import React, { useEffect, useState, useRef } from "react";
import { Alert, TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import * as Location from "expo-location";

const DEBUG = false;

function calculateQiblaDirection(latitude, longitude) {
  const lat1 = (latitude * Math.PI) / 180;
  const lon1 = (longitude * Math.PI) / 180;

  // Kaaba coordinates (Makkah)
  const lat2 = (21.4225 * Math.PI) / 180;
  const lon2 = (39.8262 * Math.PI) / 180;

  const dLon = lon2 - lon1;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let brng = (Math.atan2(y, x) * 180) / Math.PI;
  if (brng < 0) brng += 360;
  return brng; // 0–360°
}

export default function CompassPage({ onBack }) {
  const [heading, setHeading] = useState(null);
  const [qiblaBearing, setQiblaBearing] = useState(null);
  const headingSubRef = useRef(null);

  useEffect(() => {
    let isActive = true;

    async function init() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Konum izni gerekli",
            "Kıble yönünü gösterebilmek için konum izni vermen gerekiyor."
          );
          return;
        }

        const pos = await Location.getCurrentPositionAsync({});
        if (!isActive) return;

        const { latitude, longitude } = pos.coords;

        const qDir = calculateQiblaDirection(latitude, longitude);
        setQiblaBearing(qDir);

        headingSubRef.current = await Location.watchHeadingAsync((h) => {
          const value =
            h.trueHeading != null && !Number.isNaN(h.trueHeading)
              ? h.trueHeading
              : h.magHeading;

          if (value != null && !Number.isNaN(value)) {
            setHeading(value);
          }
        });
      } catch (e) {
        if (DEBUG) console.log("Compass init error:", e);
        Alert.alert(
          "Hata",
          "Kıble yönü hesaplanırken bir sorun oluştu. Lütfen daha sonra tekrar dene."
        );
      }
    }

    init();

    return () => {
      isActive = false;
      if (headingSubRef.current) {
        headingSubRef.current.remove();
        headingSubRef.current = null;
      }
    };
  }, []);

  const angleToQibla =
    qiblaBearing != null && heading != null ? qiblaBearing - heading : 0;

  let normalizedAngle = angleToQibla % 360;
  if (normalizedAngle < 0) normalizedAngle += 360;

  return (
    <View style={styles.page}>
      {/* Back */}
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backButtonText}>← </Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Kıble Yönü</Text>

      {qiblaBearing == null ? (
        <Text style={styles.loadingText}>
          Konumdan kıble yönü hesaplanıyor...
        </Text>
      ) : (
        <>
          {/* Compass */}
          <View style={styles.compassWrapper}>
            {/* Outer glow circle */}
            <View style={styles.outerGlow} />

            {/* Outer dial */}
            <View style={styles.dialCircle}>
              {/* Inner dial background */}
              <View style={styles.innerDial} />

              {/* Center dot */}
              <View style={styles.centerDot} />
            </View>

            {/* Qibla indicator ring + Kaaba icon */}
            <View
              style={[
                styles.qiblaRingWrapper,
                { transform: [{ rotate: `${normalizedAngle}deg` }] },
              ]}
            >
              <View style={styles.qiblaRing} />
              <View style={styles.qiblaMarker}>
                <Image
                  source={require("../assets/icons/iconPack/kabeLive.png")}
                  style={styles.kaabaIcon}
                />
              </View>
            </View>
          </View>

          {/* Degree info */}
          <Text style={styles.degreeText}>
            Kıble: {qiblaBearing.toFixed(0)}°
          </Text>

          {heading != null && (
            <Text style={styles.degreeSubText}>
              Baktığın yön: {heading.toFixed(0)}°
            </Text>
          )}

          <Text style={styles.bottomHint}>
            Telefonu düz ve yere paralel tut.{"\n"}
            Kâbe ikonu kıbleyi gösterir.
          </Text>
        </>
      )}
    </View>
  );
}

const SIZE = 260;
const HALF = SIZE / 2;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    paddingTop: 60,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

  backButton: {
    alignSelf: "flex-start",
    marginLeft: 20,
    marginBottom: 10,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 18,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 20,
  },

  loadingText: {
    fontSize: 14,
    color: "#9aa4b8",
    textAlign: "center",
  },

  compassWrapper: {
    width: SIZE + 20,
    height: SIZE + 20,
    justifyContent: "center",
    alignItems: "center",
  },

  outerGlow: {
    position: "absolute",
    width: SIZE + 40,
    height: SIZE + 40,
    borderRadius: (SIZE + 40) / 2,
    backgroundColor: "rgba(0,0,0,0.9)",
    shadowColor: "#00f0ff",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 0 },
  },

  dialCircle: {
    width: SIZE,
    height: SIZE,
    borderRadius: HALF,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#050812",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },

  innerDial: {
    position: "absolute",
    width: SIZE - 40,
    height: SIZE - 40,
    borderRadius: (SIZE - 40) / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(10,15,25,0.9)",
  },

  dirLabel: {
    position: "absolute",
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dirN: { top: 10 },
  dirS: { bottom: 10 },
  dirE: { right: 14 },
  dirW: { left: 14 },

  tick: {
    position: "absolute",
    width: 2,
    height: 16,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: 1,
  },
  tickNE: {
    top: 24,
    right: HALF - 8,
    transform: [{ rotate: "45deg" }],
  },
  tickSE: {
    bottom: 24,
    right: HALF - 8,
    transform: [{ rotate: "-45deg" }],
  },
  tickSW: {
    bottom: 24,
    left: HALF - 8,
    transform: [{ rotate: "45deg" }],
  },
  tickNW: {
    top: 24,
    left: HALF - 8,
    transform: [{ rotate: "-45deg" }],
  },

  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#111827",
  },

  qiblaRingWrapper: {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  qiblaRing: {
    position: "absolute",
    width: SIZE - 16,
    height: SIZE - 16,
    borderRadius: (SIZE - 16) / 2,
    borderWidth: 2,
    borderColor: "rgba(0,255,180,0.35)",
    borderStyle: "dashed",
  },

  qiblaMarker: {
    position: "absolute",
    top: 22,
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(0,255,180,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,255,180,0.9)",
  },

  kaabaIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },

  degreeText: {
    fontSize: 20,
    color: "#ffffff",
    marginTop: 22,
    fontWeight: "600",
  },
  degreeSubText: {
    fontSize: 16,
    color: "#d0d7e2",
    marginTop: 4,
  },

  bottomHint: {
    marginTop: 20,
    fontSize: 13,
    color: "#cbd5f5",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
