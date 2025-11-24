import React, { useRef } from "react";
import { View, TouchableOpacity, Image, StyleSheet, Animated, Platform, } from "react-native";
import { BlurView } from "expo-blur";

const ITEMS = [
  { key: "home", icon: require("../assets/icons/iconPack/home.png") },
  { key: "namaz", icon: require("../assets/icons/iconPack/prayer.png") },
  { key: "kurani_kerim", icon: require("../assets/icons/iconPack/quran_dock.png") },
  { key: "settings", icon: require("../assets/icons/iconPack/settings_dock.png") },
  { key: "kaza_takip", icon: require("../assets/icons/iconPack/qna.png") },
];

export default function DockBar({ activePage, onNavigate }) {

  const scaleValues = useRef(
    Object.fromEntries(ITEMS.map((item) => [item.key, new Animated.Value(1)]))
  ).current;

  function animateIcon(key) {
    const anim = scaleValues[key];
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.3, duration: 120, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 1.0, duration: 120, useNativeDriver: true }),
    ]).start();
  }

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={50} tint="light" style={styles.dock}>
        {ITEMS.map((item) => (
          <TouchableOpacity key={item.key} onPress={() => { animateIcon(item.key); onNavigate(item.key); }} style={styles.iconWrapper} >
            <Animated.Image source={item.icon} style={[ styles.icon, activePage === item.key && styles.activeIcon, { transform: [{ scale: scaleValues[item.key] }] }, ]} resizeMode="contain" />
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  dock: {
    width: 260,
    height: 70,
    borderRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    overflow: "hidden",
    paddingHorizontal: 10,
    backgroundColor: Platform.OS === "android" ? "rgba(0,0,0,0.4)" : "transparent",
  },
  iconWrapper: {
    padding: 8,
  },
  icon: {
    width: 32,
    height: 32,
    opacity: 0.7,
  },
  activeIcon: {
    opacity: 1,
  },
});
