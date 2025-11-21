import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator, ImageBackground, ScrollView, Share, Image, TouchableOpacity, Animated, PanResponder} from "react-native";

import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import TextSizeButton from "./files/TextSizeButton";
import ScaledText from "./files/ScaledText";
import AsyncStorage from "@react-native-async-storage/async-storage";

// pages
import ImsakiyePage from "./files/ImsakiyePage";
import DiniBayramlarPage from "./files/DiniBayramlarPage";
import TakvimArkasiPage from "./files/TakvimArkasiPage";
import CompassPage from "./files/CompassPage";
import ZikirmatikPage from "./files/ZikirmatikPage";
import AbdestPage from "./files/AbdestPage";
import NamazPage from "./files/NamazPage";
import NamazSureleriPage from "./files/NamazSureleriPage";
import YasinPage from "./files/YasinPage";
import TesbihPage from "./files/TesbihPage";
import KazaTakipPage from "./files/KazaTakipPage";
import EzanDinlePage from "./files/EzanDinlePage";
import NearbyMosquesPage from "./files/NearbyMosquesPage";
import HadisPage from "./files/HadisPage";
import VedaPage from "./files/VedaPage";
import OtuzIkiFarzPage from "./files/OtuzIkiFarzPage";
import DiniYayinPage from "./files/DiniYayinPage";
import KabeCanliPage from "./files/KabeCanliPage";
import EsmaPage from "./files/EsmaPage";
import IlmihalPage from "./files/IlmihalPage";
import QuranPage from "./files/QuranPage";
import KuranFihristiPage from "./files/KuranFihristiPage";
import HadisFihristiPage from "./files/HadisFihristiPage";
import SecmeAyetlerPage from "./files/SecmeAyetlerPage";
import GuzelDualarPage from "./files/GuzelDualarPage";
import GuzelSozlerPage from "./files/GuzelSozlerPage";
import SalavatlarPage from "./files/SalavatlarPage";
import PeygamberlerTarihiPage from "./files/PeygamberlerTarihiPage";
import EfendimizinHayatiPage from "./files/EfendimizinHayatiPage";
import DortHalifePage from "./files/DortHalifePage";
import SahabelerinHayatiPage from "./files/SahabelerinHayatiPage";
import MevlanaPage from "./files/MevlanaPage";
import MesneviPage from "./files/MesneviPage";
import RamazanVeOrucPage from "./files/RamazanVeOrucPage";
import DiniSozlukPage from "./files/DiniSozlukPage";
import IsimlerSozlukPage from "./files/IsimlerSozlukPage";
import CevsanPage from "./files/CevsanPage";
import IslamQuestionAnswerPage from "./files/IslamQuestionAnswerPage";
import CumaHutbePage from "./files/CumaHutbePage";
import NamazinTurkcesiPage from "./files/NamazinTurkcesiPage";
import IslamQuizPage from "./files/IslamQuizPage";
import HacUmreRehberPage from "./files/HacUmreRehberPage";
import SettingsPage from "./files/SettingsPage";
import AboutPage from "./files/AboutPage";
import HelpPage from "./files/HelpPage";

const DEBUG = false;

// How notifications behave when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Sidebar config
const SIDEBAR_WIDTH = 260;

const MENU_ITEMS = [
  { key: "imsakiye", label: "İmsakiye" },
  { key: "dini_bayramlar", label: "Dini bayramlar" },
  { key: "takvim_arkasi", label: "Takvim arkası" },
  { key: "compass", label: "Kıble pusulası" },
  { key: "zikirmatik", label: "Zikirmatik" },
  { key: "abdest", label: "Abdest" },
  { key: "namaz", label: "Namaz" },
  { key: "namaz_sureleri", label: "Namaz sureleri" },
  { key: "yasin_suresi", label: "Yasin suresi" },
  { key: "tesbih", label: "Tesbih" },
  { key: "kaza_takip", label: "Kaza takip" },
  { key: "ezan_dinle", label: "Ezan dinle" },
  { key: "yakin_camiler", label: "Yakın camiler" },
  { key: "kirk_hadis", label: "40 hadis" },
  { key: "veda_hutbesi", label: "Veda hutbesi" },
  { key: "otuziki_farz", label: "32 farz" },
  { key: "dini_yayin", label: "Dini yayın" },
  { key: "kabeden_canli", label: "Kabe ( Canlı )" },
  { key: "esmaul_husna", label: "Esmaül Hüsna" },
  { key: "islam_ilmihali", label: "İslam ilmihali" },
  { key: "kurani_kerim", label: "Kur’an-ı Kerim" },
  { key: "kuran_fihristi", label: "Kur’an fihristi" },
  { key: "hadis_fihristi", label: "Hadis fihristi" },
  { key: "yedis_yuz_ucyuz_hadis", label: "7300 hadis" },
  { key: "secme_ayetler", label: "Seçme ayetler" },
  { key: "guzel_dualar", label: "Güzel dualar" },
  { key: "guzel_sozler", label: "Güzel sözler" },
  { key: "salavatlar", label: "Salavatlar" },
  { key: "peygamberler_tarihi", label: "Peygamberler tarihi" },
  { key: "efendimizin_hayati", label: "Efendimizin hayatı" },
  { key: "dort_halife", label: "4 halife" },
  { key: "sahabelerin_hayati", label: "Sahabelerin hayatı" },
  { key: "hz_mevlana", label: "Hz. Mevlana" },
  { key: "mesnevi", label: "Mesnevi" },
  { key: "ramazan_ve_oruc", label: "Ramazan ve oruç" },
  { key: "dini_sozluk", label: "Dini sözlük" },
  { key: "isimler_sozlugu", label: "İsimler sözlüğü" },
  { key: "cevsan", label: "Cevşen" },
  { key: "islami_soru_cevap", label: "İslami soru/cevap" },
  { key: "cuma_hutbeleri", label: "Cuma hutbeleri" },
  { key: "namazin_turkcesi", label: "Namazın Türkçesi" },
  { key: "islam_quiz", label: "İslam Soru Bankası" },
  { key: "hac_umre_rehberi", label: "Hac umre rehberi" },
  { key: "settings", label: "Ayarlar" },
  { key: "about", label: "Hakkında" },
  { key: "help", label: "Yardım & Destek" },
];

const BACKGROUNDS = [
  require("./assets/images/backgrounds/background1.jpg"),
  require("./assets/images/backgrounds/background2.jpg"),
  require("./assets/images/backgrounds/background3.jpg"),
  require("./assets/images/backgrounds/background4.jpg"),
  require("./assets/images/backgrounds/background5.jpg"),
  require("./assets/images/backgrounds/background6.jpg"),
  require("./assets/images/backgrounds/background7.jpg"),
];

const PRAYER_MAP = { Fajr: "Sabah", Dhuhr: "Öğle", Asr: "İkindi", Maghrib: "Akşam", Isha: "Yatsı" };
const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const defaultSettings = { soundEnabled: true, vibrationEnabled: true, darkTheme: true, notificationsEnabled: true, };

export default function Islam_App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const [verseLoading, setVerseLoading] = useState(false);
  const [verseRef, setVerseRef] = useState("");
  const [verseArabic, setVerseArabic] = useState("");
  const [verseTurkish, setVerseTurkish] = useState("");
  const [verseNameTr, setVerseNameTr] = useState("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const [activePage, setActivePage] = useState("home");

  const [isAppLibraryOpen, setIsAppLibraryOpen] = useState(false);
  const [backgroundSource, setBackgroundSource] = useState(BACKGROUNDS[0]);
  // const bannerAdUnitId = __DEV__ ? TestIds.BANNER : Platform.select({ ios: "ca-app-pub-3940256099942544/2934735716", android: "ca-app-pub-3940256099942544/6300978111"  });

  // init
  useEffect(() => {
    const init = async () => {
      try {
        const stored = await AsyncStorage.getItem("settings");
        let effectiveSettings = defaultSettings;

        if (stored) {
          const parsed = JSON.parse(stored);
          effectiveSettings = {
            soundEnabled: parsed.soundEnabled ?? true,
            vibrationEnabled: parsed.vibrationEnabled ?? true,
            darkTheme: parsed.darkTheme ?? true,
            notificationsEnabled: parsed.notificationsEnabled ?? true,
          };
        }

        setSettings(effectiveSettings);
        await requestNotificationPermissions();
        await scheduleDailyNotifications(effectiveSettings);
        const idx = Math.floor(Math.random() * BACKGROUNDS.length);
        setBackgroundSource(BACKGROUNDS[idx]);
        // await fetchRandomVerse();
      } catch (e) {
        if (DEBUG) console.log("init error:", e);
      }
    };

    init();
  }, []);

  /*
  useEffect(() => {
    mobileAds()
      .initialize()
      .then(() => {
        if (DEBUG) console.log("Google Mobile Ads initialized");
      });
  }, []);
  */

  async function requestNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Bildirim izni gerekli", 
        "Ezan vakti bildirimleri gönderebilmemiz için bildirim iznine ihtiyaç var. Lütfen Ayarlar > Bildirimler bölümünden izin verin."
      );
    }
  }

  async function fetchTodayPrayerTimes() {
    try {
      setLoading(true);

      // Ask for location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false);
        Alert.alert(
          "Konum izni gerekli",
          "Bulunduğunuz şehre göre ezan vakitlerini hesaplamak için konum iznine ihtiyaç var."
        );
        return null;
      }

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;

      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const url = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=3&timezonestring=${encodeURIComponent(
        timeZone
      )}`;

      const response = await fetch(url);
      const json = await response.json();

      if (DEBUG) console.log("AlAdhan response: ", json);

      if (json.code !== 200 || !json.data?.timings) {
        if (DEBUG) console.log("AlAdhan error:", json);
        Alert.alert("Hata", "Namaz vakitleri alınamadı.");
        setLoading(false);
        return null;
      }

      const timings = json.data.timings;
      if (DEBUG) console.log("timings keys:", Object.keys(timings));

      const parsed = PRAYER_NAMES.map((name) => {
        const raw = timings[name];

        if (!raw) {
          if (DEBUG) console.warn(`No timing found for ${name}, skipping.`);
          return null;
        }

        const timePart = raw.split(" ")[0];
        const [hStr, mStr] = timePart.split(":");

        const hour = parseInt(hStr, 10);
        const minute = parseInt(mStr, 10);

        if (Number.isNaN(hour) || Number.isNaN(minute)) {
          if (DEBUG)
            console.warn(`Could not parse time for ${name}:`, raw);
          return null;
        }

        return {
          name: PRAYER_MAP[name],
          timeString: timePart,
          hour,
          minute,
        };
      }).filter(Boolean);

      if (parsed.length === 0) {
        Alert.alert(
          "Hata",
          "Cevaptan hiç namaz vakti ayrıştırılamadı."
        );
        setLoading(false);
        return null;
      }

      setPrayerTimes(parsed);
      setLoading(false);
      return parsed;
    } catch (error) {
      if (DEBUG) console.log("fetchTodayPrayerTimes error:", error);
      setLoading(false);
      Alert.alert("Hata", "Namaz vakitleri alınırken bir sorun oluştu.");
      return null;
    }
  }

  async function scheduleDailyNotifications(overrideSettings) {
    try {
      const effectiveSettings = overrideSettings ?? settings;

      // If ezan notifications are turned off in settings: cancel and exit
      if (!effectiveSettings.notificationsEnabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setIsScheduled(false);
        return;
      }

      // Clear existing ones
      await Notifications.cancelAllScheduledNotificationsAsync();

      const times = await fetchTodayPrayerTimes();
      if (!times) {
        return;
      }

      const now = new Date();

      for (const t of times) {
        const triggerDate = new Date(now);
        triggerDate.setHours(t.hour, t.minute, 0, 0);

        if (triggerDate <= now) {
          triggerDate.setDate(triggerDate.getDate() + 1);
        }

        await Notifications.scheduleNotificationAsync({
          content: {
            title: `${t.name} ezanı 🕋`,
            body: `${t.name} vakti geldi. Allah kabul etsin.`,
            // later you could make this conditional on settings.soundEnabled if you use custom sounds
            sound: "adhan.wav",
          },
          trigger: triggerDate,
          channelId: "prayer-channel",
        });
      }

      setIsScheduled(true);
    } catch (error) {
      if (DEBUG) console.log(error);
      Alert.alert("Hata", "Bildirimler ayarlanamadı.");
    }
  }

  async function displayQuranPage() {
    try {
      handleMenuItemPress("kurani_kerim", true);
    } catch (error) {
      if (DEBUG) console.log("Display error:", error);
    }
  }

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
        if (DEBUG) console.warn("Could not parse surah/verse from", verseKey);
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
    } catch (err) {
      if (DEBUG) console.log("fetchRandomVerse error:", err);
      setVerseLoading(false);
    }
  }

  async function handleShare() {
    try {
      await Share.share({
        message:
          "Ezan vakitlerini ve Kur’an’dan günlük ayetleri gösteren bu uygulamayı Allah için paylaş!",
      });
    } catch (error) {
      if (DEBUG) console.log("Share error:", error);
    }
  }

  function openSidebar() {
    Animated.timing(sidebarAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsSidebarOpen(true));
  }

  function closeSidebar() {
    Animated.timing(sidebarAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setIsSidebarOpen(false));
  }

  function toggleSidebar(isLibOpened) {
    if (isLibOpened) closeSidebar();
    else if (isSidebarOpen) closeSidebar();
    else openSidebar();
  }

  function toggleAppLibrary() {
    setIsAppLibraryOpen((prev) => !prev);
  }

  const panResponder = useRef(
    PanResponder.create({
      // When sidebar is CLOSED: grab gestures that start near left edge
      onStartShouldSetPanResponder: (evt, gestureState) => {
        const x = evt.nativeEvent.pageX;

        if (!isSidebarOpen && x <= 40) {
          // touch started in the first 40px from the left
          return true;
        }
        return false;
      },

      // When sidebar is OPEN: grab horizontal drags
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;

        if (
          isSidebarOpen &&
          Math.abs(dx) > Math.abs(dy) &&
          Math.abs(dx) > 5
        ) {
          return true;
        }

        return false;
      },

      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;

        if (!isSidebarOpen) {
          // Opening: from -SIDEBAR_WIDTH → 0
          const newX = Math.min(0, -SIDEBAR_WIDTH + dx);
          sidebarAnim.setValue(newX);
        } else {
          // Closing: from 0 → -SIDEBAR_WIDTH
          const newX = Math.max(-SIDEBAR_WIDTH, dx);
          sidebarAnim.setValue(newX);
        }
      },

      onPanResponderRelease: (evt, gestureState) => {
        const { dx, vx } = gestureState;

        if (!isSidebarOpen) {
          // Decide open vs snap back when closed
          if (dx > SIDEBAR_WIDTH / 3 || vx > 0.5) {
            openSidebar();
          } else {
            closeSidebar();
          }
        } else {
          // Decide close vs stay open when open
          if (dx < -SIDEBAR_WIDTH / 3 || vx < -0.5) {
            closeSidebar();
          } else {
            openSidebar();
          }
        }
      },
    })
  ).current;

  function handleMenuItemPress(key, isLibOpened) {
    switch (key) {
      case "imsakiye":
        setActivePage(key)
        toggleSidebar(isLibOpened);
        break;
      case "dini_bayramlar":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "takvim_arkasi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "compass":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "zikirmatik":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "abdest":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "namaz":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "namaz_sureleri":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "yasin_suresi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "tesbih":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "kaza_takip":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "ezan_dinle":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "yakin_camiler":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "kirk_hadis":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "veda_hutbesi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "otuziki_farz":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "dini_yayin":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "kabeden_canli":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "esmaul_husna":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "islam_ilmihali":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "kuran_fihristi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "kurani_kerim":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "hadis_fihristi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "secme_ayetler":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "guzel_dualar":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "guzel_sozler":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "salavatlar":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "peygamberler_tarihi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "efendimizin_hayati":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "dort_halife":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "sahabelerin_hayati":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "hz_mevlana":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "mesnevi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "ramazan_ve_oruc":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "dini_sozluk":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "cevsan":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "islami_soru_cevap":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "cuma_hutbeleri":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "namazin_turkcesi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "islam_quiz":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "hac_umre_rehberi":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "settings":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "about":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      case "help":
        setActivePage(key);
        toggleSidebar(isLibOpened);
        break;
      default:
        Alert.alert("Yakında", "Allah'ın izniyle bu özellik yakında gelecek inşAllah.");
        toggleSidebar(isLibOpened);
        break;
    }
  }

  function getIconForKey(key) {
    const map = {
      imsakiye: require("./assets/icons/iconPack/calendar.png"),
      dini_bayramlar: require("./assets/icons/iconPack/holiday.png"),
      takvim_arkasi: require("./assets/icons/iconPack/story.png"),
      compass: require("./assets/icons/iconPack/compass.png"),
      zikirmatik: require("./assets/icons/iconPack/stopwatch.png"),
      abdest: require("./assets/icons/iconPack/abdest.png"),
      namaz: require("./assets/icons/iconPack/namaz.png"),
      namaz_sureleri: require("./assets/icons/iconPack/namaz_sure.png"),
      yasin_suresi: require("./assets/icons/iconPack/yasin.png"),
      tesbih: require("./assets/icons/iconPack/tesbih.png"),
      kaza_takip: require("./assets/icons/iconPack/kaza.png"),
      ezan_dinle: require("./assets/icons/iconPack/ezan.png"),
      yakin_camiler: require("./assets/icons/iconPack/yakin.png"),
      kirk_hadis: require("./assets/icons/iconPack/kirk.png"),
      veda_hutbesi: require("./assets/icons/iconPack/veda.png"),
      otuziki_farz: require("./assets/icons/iconPack/otuziki.png"),
      dini_yayin: require("./assets/icons/iconPack/yayin.png"),
      kabeden_canli: require("./assets/icons/iconPack/kabeLive.png"),
      esmaul_husna: require("./assets/icons/iconPack/esma.png"),
      islam_ilmihali: require("./assets/icons/iconPack/ilmihal.png"),
      kurani_kerim: require("./assets/icons/iconPack/quran.png"),
      kuran_fihristi: require("./assets/icons/iconPack/index1.png"),
      hadis_fihristi: require("./assets/icons/iconPack/index2.png"),
      yedis_yuz_ucyuz_hadis: require("./assets/icons/iconPack/quotes.png"),
      secme_ayetler: require("./assets/icons/iconPack/selected.png"),
      guzel_dualar: require("./assets/icons/iconPack/dua.png"),
      guzel_sozler: require("./assets/icons/iconPack/sozler.png"),
      salavatlar: require("./assets/icons/iconPack/salavat.png"),
      peygamberler_tarihi: require("./assets/icons/iconPack/prophet.png"),
      efendimizin_hayati: require("./assets/icons/iconPack/hayati.png"),
      dort_halife: require("./assets/icons/iconPack/halifeler.png"),
      sahabelerin_hayati: require("./assets/icons/iconPack/sahabeler.png"),
      hz_mevlana: require("./assets/icons/iconPack/mevlana.png"),
      mesnevi: require("./assets/icons/iconPack/mesnevi.png"),
      ramazan_ve_oruc: require("./assets/icons/iconPack/ramadan.png"),
      dini_sozluk: require("./assets/icons/iconPack/sozluk.png"),
      isimler_sozlugu: require("./assets/icons/iconPack/isimler.png"),
      cevsan: require("./assets/icons/iconPack/cevsan.png"),
      islami_soru_cevap: require("./assets/icons/iconPack/qna.png"),
      cuma_hutbeleri: require("./assets/icons/iconPack/cuma.png"),
      namazin_turkcesi: require("./assets/icons/iconPack/namazTR.png"),
      islam_quiz: require("./assets/icons/iconPack/bank.png"),
      hac_umre_rehberi: require("./assets/icons/iconPack/guide.png"),
      settings: require("./assets/icons/iconPack/settings.png"),
      about: require("./assets/icons/iconPack/about.png"),
      help: require("./assets/icons/iconPack/help.png"),
    };

    return map[key] ?? { name: "apps", size: 28 }; // fallback
  }

  function shouldShowFloatingButton() {
    const pagesToHide = [ "kurani_kerim",  ];
    return !pagesToHide.includes(activePage);
  }

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover" >
      <TextSizeButton activePage={activePage} visibleOnPages={[ "imsakiye", "dini_bayramlar", "takvim_arkasi", "abdest", "namaz", "namaz_sureleri", "yasin_suresi", "kirk_hadis", "veda_hutbesi", "otuziki_farz", "islam_ilmihali", "kuran_fihristi", "hadis_fihristi", "yedis_yuz_ucyuz_hadis", "secme_ayetler", "guzel_dualar", "guzel_sozler", "salavatlar", "peygamberler_tarihi", "efendimizin_hayati", "dort_halife", "sahabelerin_hayati", "hz_mevlana", "mesnevi", "ramazan_ve_oruc", "dini_sozluk", "isimler_sozlugu", "cevsan", "islami_soru_cevap", "namazin_turkcesi", "hac_umre_rehberi", "about", "help"]} top={50} right={16}/>
      {/* =======================
          HOME PAGE
          ======================= */}
      {activePage === "home" && (
        <View style={styles.overlay}>
          {/* Top bar with menu + title */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => toggleSidebar(false)}>
              <Image source={require("./assets/icons/iconPack/sidebarMenu.png")} size={10} style={styles.sidebarMenuIcom}/>
            </TouchableOpacity>

            <View style={styles.topBarTitleWrapper}>
              <Text style={styles.subtitle}> ALLAH'ın selamı ve bereketi üzerine olsun </Text>
            </View>
          </View>

          {loading && (
            <View style={{ marginTop: 16 }}>
              <ActivityIndicator />
              <Text style={{ marginTop: 8, color: "#d0d7e2" }}>
                Bismillahirrahmanirrahim...
              </Text>
            </View>
          )}

          <View style={styles.verseContainer}>
            <ScrollView style={styles.scroll}>
              <Text style={styles.verseLabel}>Bugünün ayeti</Text>

              {verseLoading ? (
                <Text style={styles.verseLoading}>
                  Bismillahirrahmanirrahim...
                </Text>
              ) : verseArabic ? (
                <View>
                  <Text style={styles.verseArabic}>{verseArabic}</Text>

                  {verseTurkish ? (
                    <Text style={styles.verseTr}>{verseTurkish}</Text>
                  ) : null}

                  <Text style={styles.verseLabel}>{verseNameTr} Suresi</Text>

                  {verseRef ? (
                    <Text style={styles.verseRef}>({verseRef})</Text>
                  ) : null}
                </View>
              ) : (
                <Text style={styles.verseLoading}>
                  Ayet alınamadı. Aşağıdan tekrar deneyebilirsin.
                </Text>
              )}
            </ScrollView>
          </View>

          <View style={styles.topIconRow}>
            {/* Open Quran */}
            <TouchableOpacity onPress={displayQuranPage} style={{ marginTop: 16 }}>
              <Image source={require("./assets/icons/iconPack/quran.png")} size={25} color="#fff" style={{ alignSelf: "center" }} />
            </TouchableOpacity>

            {/* Fetch Random Verse */}
            <TouchableOpacity onPress={fetchRandomVerse} style={{ marginTop: 16 }}>
              <Image source={require("./assets/icons/iconPack/shuffle.png")} size={20} color="#fff" style={{ alignSelf: "center" }} />
            </TouchableOpacity>

            {/* Share */}
            <TouchableOpacity onPress={handleShare} style={{ marginTop: 16 }}>
              <Image source={require("./assets/icons/iconPack/share.png")} size={25} color="#fff" style={{ alignSelf: "center" }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* =======================
          IMSAKIYE PAGE
          ======================= */}
      {activePage === "imsakiye" && (
        <ImsakiyePage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          DİNİ BAYRAMLAR PAGE
          ======================= */}
      {activePage === "dini_bayramlar" && (
        <DiniBayramlarPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          TAKVİM ARKASI PAGE
          ======================= */}
      {activePage === "takvim_arkasi" && (
        <TakvimArkasiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          COMPASS PAGE
          ======================= */}
      {activePage === "compass" && (
        <CompassPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          ZİKİRMATİK PAGE
          ======================= */}
      {activePage === "zikirmatik" && (
        <ZikirmatikPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          ABDEST GUIDE PAGE
          ======================= */}
      {activePage === "abdest" && (
        <AbdestPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          NAMAZ GUIDE PAGE
          ======================= */}
      {activePage === "namaz" && (
        <NamazPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          NAMAZ SURELERI PAGE
          ======================= */}
      {activePage === "namaz_sureleri" && (
        <NamazSureleriPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          YASİN PAGE
          ======================= */}
      {activePage === "yasin_suresi" && (
        <YasinPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          TESBİH PAGE
          ======================= */}
      {activePage === "tesbih" && (
        <TesbihPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          KAZA TAKİP PAGE
          ======================= */}
      {activePage === "kaza_takip" && (
        <KazaTakipPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          EZAN DİNLE PAGE
          ======================= */}
      {activePage === "ezan_dinle" && (
        <EzanDinlePage onBack={() => setActivePage("home")} />
      )}
      
      {/* =======================
          YAKIN CAMİLER PAGE
          ======================= */}
      {activePage === "yakin_camiler" && (
        <NearbyMosquesPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          KIRK HADİS
          ======================= */}
      {activePage === "kirk_hadis" && (
        <HadisPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          VEDA HUTBESİ PAGE
          ======================= */}
      {activePage === "veda_hutbesi" && (
        <VedaPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          32 FARZ PAGE
          ======================= */}
      {activePage === "otuziki_farz" && (
        <OtuzIkiFarzPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          DİNİ YAYIN PAGE
          ======================= */}
      {activePage === "dini_yayin" && (
        <DiniYayinPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          KABE ( CANLI ) PAGE
          ======================= */}
      {activePage === "kabeden_canli" && (
        <KabeCanliPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          ESMAÜL HÜSNA PAGE
          ======================= */}
      {activePage === "esmaul_husna" && (
        <EsmaPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          İLMİHAL PAGE
          ======================= */}
      {activePage === "islam_ilmihali" && (
        <IlmihalPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          KURAN PAGE
          ======================= */}
      {activePage === "kurani_kerim" && (
        <QuranPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          KURAN FİHRİST PAGE
          ======================= */}
      {activePage === "kuran_fihristi" && (
        <KuranFihristiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          HADİS FİHRİST PAGE
          ======================= */}
      {activePage === "hadis_fihristi" && (
        <HadisFihristiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          SEÇME AYETLER PAGE
          ======================= */}
      {activePage === "secme_ayetler" && (
        <SecmeAyetlerPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          GÜZEL DUALAR PAGE
          ======================= */}
      {activePage === "guzel_dualar" && (
        <GuzelDualarPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          GÜZEL SÖZLER PAGE
          ======================= */}
      {activePage === "guzel_sozler" && (
        <GuzelSozlerPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          SALAVATLAR PAGE
          ======================= */}
      {activePage === "salavatlar" && (
        <SalavatlarPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          PEYGAMBERLER PAGE
          ======================= */}
      {activePage === "peygamberler_tarihi" && (
        <PeygamberlerTarihiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          EFENDİMİZİN HAYATI PAGE
          ======================= */}
      {activePage === "efendimizin_hayati" && (
        <EfendimizinHayatiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          DÖRT HALİFE HAYATI PAGE
          ======================= */}
      {activePage === "dort_halife" && (
        <DortHalifePage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          SAHABELERİN HAYATI PAGE
          ======================= */}
      {activePage === "sahabelerin_hayati" && (
        <SahabelerinHayatiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          MEVLANA HAYATI PAGE
          ======================= */}
      {activePage === "hz_mevlana" && (
        <MevlanaPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          MESNEVİ PAGE
          ======================= */}
      {activePage === "mesnevi" && (
        <MesneviPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          RAMAZAN VE ORUÇ PAGE
          ======================= */}
      {activePage === "ramazan_ve_oruc" && (
        <RamazanVeOrucPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          DİNİ SÖZLÜK PAGE
          ======================= */}
      {activePage === "dini_sozluk" && (
        <DiniSozlukPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          İSİMLER SÖZLÜĞÜ PAGE
          ======================= */}
      {activePage === "isimler_sozlugu" && (
        <IsimlerSozlukPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          CEVŞEN PAGE
          ======================= */}
      {activePage === "cevsan" && (
        <CevsanPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          İSLAMİ SORU&CEVAP PAGE
          ======================= */}
      {activePage === "islami_soru_cevap" && (
        <IslamQuestionAnswerPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          CUMA HUTBELERİ PAGE
          ======================= */}
      {activePage === "cuma_hutbeleri" && (
        <CumaHutbePage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          NAMAZIN TÜRKÇESİ PAGE
          ======================= */}
      {activePage === "namazin_turkcesi" && (
        <NamazinTurkcesiPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          İSLAM QUIZ PAGE
          ======================= */}
      {activePage === "islam_quiz" && (
        <IslamQuizPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          HAC UMRE REHBERİ PAGE
          ======================= */}
      {activePage === "hac_umre_rehberi" && (
        <HacUmreRehberPage onBack={() => setActivePage("home")} />
      )}
      
      {/* =======================
          AYARLAR PAGE
          ======================= */}
      {activePage === "settings" && (
        <SettingsPage onBack={() => setActivePage("home")}
          onSettingsChanged={(newSettings) => {
            setSettings(newSettings);
            scheduleDailyNotifications(newSettings);
        }}/>
      )}

      {/* =======================
          HAKKINDA PAGE
          ======================= */}
      {activePage === "about" && (
        <AboutPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          YARDIM DESTEK PAGE
          ======================= */}
      {activePage === "help" && (
        <HelpPage onBack={() => setActivePage("home")} />
      )}

      {/* Sidebar */}
      <Animated.View
        style={[ styles.sidebar, { transform: [{ translateX: sidebarAnim }] }, ]} >
        <Text style={styles.sidebarTitle}>Menü</Text>
        <ScrollView>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.key} style={styles.sidebarItem} onPress={() => handleMenuItemPress(item.key, false)} >
              <Text style={styles.sidebarItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* =======================
          APP LIBRARY OVERLAY
          ======================= */}
      {isAppLibraryOpen && (
        <View style={styles.appLibraryOverlay}>
          {/* Backdrop behind the library content */}
          <TouchableOpacity style={styles.appLibraryBackdrop} activeOpacity={1} onPress={toggleAppLibrary} />

          <View style={styles.appLibraryContent}>
            <Text style={styles.appLibraryTitle}> Uygulamalar </Text>

            <ScrollView contentContainerStyle={styles.appLibraryGrid}>
              {MENU_ITEMS.map((item) => (
                <TouchableOpacity key={item.key} style={styles.appTile} onPress={() => { handleMenuItemPress(item.key, true); setIsAppLibraryOpen(false); }} >
                  <View style={styles.appTileIcon}>
                    <Image source={getIconForKey(item.key)} style={{ width: 30, height: 30}} resizeMode="contain" />
                  </View>
                  <ScaledText baseSize={14} style={styles.appTileLabel}> {item.label} </ScaledText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* =======================
          BANNER AD
          ======================= 
      {activePage === "home" && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
            requestOptions={{
              requestNonPersonalizedAdsOnly: false,
            }}
            onAdFailedToLoad={(err) => {
              if (DEBUG) console.log("GoogleMobileAds error:", err);
            }}
          />
        </View>
      )}
        */}

      {/* =======================
          BOTTOM BAR WITH 9-DOTS BUTTON
          ======================= */}
      <View style={styles.bottomBar}>
        {/* Left space – later you can add shortcuts or Home etc. */}
        <View style={{ flex: 1 }} />

        {/* Center 9-dots button */}
        {shouldShowFloatingButton() &&  (
          <TouchableOpacity style={styles.bottomBarCenterButton} onPress={toggleAppLibrary} >
            <Image source={require("./assets/icons/iconPack/menuIcon.png")} resizeMode="contain" style={styles.bottomBarCenterIcon}></Image>
          </TouchableOpacity>
        )}

        {/* Right space */}
        <View style={{ flex: 1 }} />
      </View>

      {/* Backdrop */}
      {isSidebarOpen && (
        <TouchableOpacity style={styles.sidebarBackdrop} activeOpacity={1} onPress={toggleSidebar} />
      )}
      <View style={styles.edgeSwipeZone} {...panResponder.panHandlers} />
    </ImageBackground>
  );
}

  const styles = StyleSheet.create({
    background: {
      flex: 1,
    },
    scroll: { 
      padding: 16
    },
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
      alignItems: "stretch",
      justifyContent: "flex-start",
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 50,
      marginTop: 35,
      gap: 24,
    },
    topBarTitleWrapper: {
      flex: 1,
    },
    topIconRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 16,
      gap: 24,
    },
    sidebarMenuIcom: {
      width: 25,
      height: 25,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "left",
      marginTop: 4,
      color: "#d0d7e2",
    },
    verseContainer: {
      marginTop: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: "rgba(255, 255, 255, 0.06)",
      borderRadius: 12,
    },
    verseLabel: {
      fontSize: 16,
      fontWeight: "600",
      color: "#d0d7e2",
      marginBottom: 8,
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
    verseRef: {
      fontSize: 14,
      color: "#9aa4b8",
      textAlign: "center",
      marginTop: 4,
    },
    verseLoading: {
      fontSize: 14,
      color: "#9aa4b8",
      textAlign: "center",
    },
    sidebar: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      width: 260,
      backgroundColor: "rgba(10, 15, 25, 0.96)",
      paddingTop: 50,
      paddingHorizontal: 16,
      zIndex: 20,
    },
    sidebarTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#ffffff",
      marginBottom: 16,
    },
    sidebarItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "rgba(255,255,255,0.08)",
    },
    sidebarItemText: {
      fontSize: 15,
      color: "#f2f2f7",
    },
    sidebarBackdrop: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(0,0,0,0.4)",
      zIndex: 10,
    },
    edgeSwipeZone: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: 20,
      zIndex: 15,
    },
    bottomBar: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: 70,
      backgroundColor: "rgba(185, 11, 11, 0)",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
    },
    bottomBarCenterButton: {
      width: 80,
      height: 80,
      borderRadius: 32,
      backgroundColor: "rgba(255,255,255,0.15)",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      bottom: 24,
      alignSelf: "center",
      zIndex: 999,
    },
    bottomBarCenterIcon: {
      width: 50,
      height: 50,
      tintColor: "#fff",
    },
    appLibraryOverlay: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 40,
    },
    appLibraryBackdrop: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: "rgba(255, 255, 255, 0)",
    },
    appLibraryContent: {
      flex: 1,
      marginTop: 80,
      marginBottom: 80,
      marginHorizontal: 20,
      borderRadius: 20,
      backgroundColor: "rgba(10,15,25,0.96)",
      padding: 16,
    },
    appLibraryTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: "#fff",
      textAlign: "center",
      marginBottom: 12,
    },
    appLibraryGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    appTile: {
      width: "30%",
      marginBottom: 16,
      alignItems: "center",
    },
    appTileIcon: {
      width: 60,
      height: 60,
      borderRadius: 16,
      backgroundColor: "rgba(255,255,255,0.08)",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 6,
    },
    appTileLabel: {
      fontSize: 12,
      color: "#f2f2f7",
      textAlign: "center",
    },
    adContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      backgroundColor: "rgba(0,0,0,0.3)",
    },
});