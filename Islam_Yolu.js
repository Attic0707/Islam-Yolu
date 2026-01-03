import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, Text, View, Alert, ActivityIndicator, ImageBackground, ScrollView, Share, Image, TouchableOpacity, Animated, PanResponder, Platform,} from "react-native";

import * as Notifications from "expo-notifications";
import * as Location from "expo-location";
import TextSizeButton from "./files/TextSizeButton";
import ScaledText from "./files/ScaledText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useInterstitialAds } from "./files/useAds";
import Purchases from "react-native-purchases";

// pages
import ImsakiyePage from "./files/ImsakiyePage";
import DiniBayramlarPage from "./files/DiniBayramlarPage";
import TakvimArkasiPage from "./files/TakvimArkasiPage";
import CompassPage from "./files/CompassPage";
import ZikirmatikPage from "./files/ZikirmatikPage";
import IftarSayaciPage from "./files/IftarSayaciPage";
import IlhamPage from "./files/IlhamPage";
import AbdestPage from "./files/AbdestPage";
import NamazPage from "./files/NamazPage";
import NamazSureleriPage from "./files/NamazSureleriPage";
import NamazTakipPage from "./files/NamazTakipPage";
import YasinPage from "./files/YasinPage";
import TesbihPage from "./files/TesbihPage";
import KazaTakipPage from "./files/KazaTakipPage";
import NearbyMosquesPage from "./files/NearbyMosquesPage";
import RuyetPage from "./files/RuyetPage";
import HadisPage from "./files/HadisPage";
import VedaPage from "./files/VedaPage";
import OtuzIkiFarzPage from "./files/OtuzIkiFarzPage";
import EsmaPage from "./files/EsmaPage";
import IlmihalPage from "./files/IlmihalPage";
import QuranPage from "./files/QuranPage";
import TecvidPage from "./files/TecvidPage";
import KuranFihristiPage from "./files/KuranFihristiPage";
import HadisFihristiPage from "./files/HadisFihristiPage";
import SecmeAyetlerPage from "./files/SecmeAyetlerPage";
import GuzelDualarPage from "./files/GuzelDualarPage";
import GuzelSozlerPage from "./files/GuzelSozlerPage";
import GununAyetiPage from "./files/GununAyetiPage";
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
import NamazinTurkcesiPage from "./files/NamazinTurkcesiPage";
import IslamQuizPage from "./files/IslamQuizPage";
import HacUmreRehberPage from "./files/HacUmreRehberPage";
import SettingsPage from "./files/SettingsPage";
import AboutPage from "./files/AboutPage";
import HelpPage from "./files/HelpPage";
import PaywallPage from "./files/PaywallPage";
import DockBar from "./files/DockBar";
import Constants from "expo-constants";

const DEBUG = false;

// How notifications behave when the app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

let mobileAds = null;
let BannerAd = null;
let BannerAdSize = null;
let TestIds = null;
let BANNER_AD_UNIT_ID = "";

const isExpoGo = Constants.appOwnership === "expo";

if(!isExpoGo) {
  const googleMobileAds = require("react-native-google-mobile-ads");
  mobileAds = googleMobileAds.default;
  BannerAd = googleMobileAds.BannerAd;
  BannerAdSize = googleMobileAds.BannerAdSize;
  TestIds = googleMobileAds.TestIds;
  
  BANNER_AD_UNIT_ID = __DEV__ ? TestIds.BANNER : Platform.select({ ios: "ca-app-pub-8919233762784771/1697907277", android: "ca-app-pub-8919233762784771/9174081776",});
}

const MENU_ITEMS = [
  { key: "imsakiye",            label: "Günlük İmsak ve Vakitler" },
  { key: "dini_bayramlar",      label: "Mübarek Günler Takvimi" },
  { key: "takvim_arkasi",       label: "Takvim Arkası Yazıları" },
  { key: "compass",             label: "Kıble Yönünü Bul" },
  { key: "zikirmatik",          label: "Zikir Sayacı" },
  { key: "iftarSayaci",         label: "İftar Geri Sayımı" },
  { key: "ilham",               label: "İlham Köşesi" },
  { key: "abdest",              label: "Adım Adım Abdest" },
  { key: "namaz",               label: "Namaz Rehberi" },
  { key: "namaz_sureleri",      label: "Namazda Okunan Sureler" },
  { key: "yasin_suresi",        label: "Yasin Suresi Oku / Dinle" },
  { key: "tesbih",              label: "Dijital Tesbih" },
  { key: "kaza_takip",          label: "Kaza Namazı Takibi" },
  { key: "yakin_camiler",       label: "Yakındaki Mescitler" },
  { key: "ruyet",               label: "Hilal ve Rü’yet Bilgileri" },
  { key: "kirk_hadis",          label: "Kırk Hadis Seçkisi" },
  { key: "veda_hutbesi",        label: "Veda Hutbesi Metni" },
  { key: "otuziki_farz",        label: "32 Farz Listesi" },
  { key: "esmaul_husna",        label: "Esma’ül Hüsna ile Zikir" },
  { key: "islam_ilmihali",      label: "İlmihal Rehberi" },
  { key: "kurani_kerim",        label: "Kur’an-ı Kerim Tam Metin" },
  { key: "tecvid",              label: "Tecvidli okumayı öğren" },
  { key: "kuran_fihristi",      label: "Kur’an Konu Dizini" },
  { key: "hadis_fihristi",      label: "Hadis Konu Dizini" },
  { key: "yedis_yuz_ucyuz_hadis", label: "Hadis Arşivi (7300+)" },
  { key: "secme_ayetler",       label: "Konulara Göre Ayetler" },
  { key: "guzel_dualar",        label: "Dua Defteri" },
  { key: "guzel_sozler",        label: "Gönül Sözleri" },
  { key: "gunun_ayeti",         label: "Bugün İçin Bir Ayet" },
  { key: "salavatlar",          label: "Salavatlar ve Okunuşları" },
  { key: "peygamberler_tarihi", label: "Peygamberler Tarihi" },
  { key: "efendimizin_hayati",  label: "Hz. Muhammed’in Hayatı" },
  { key: "dort_halife",         label: "Dört Halife Dönemi" },
  { key: "sahabelerin_hayati",  label: "Sahabe Hayatları" },
  { key: "hz_mevlana",          label: "Mevlânâ’dan Öğütler" },
  { key: "mesnevi",             label: "Mesnevi Okuma Köşesi" },
  { key: "ramazan_ve_oruc",     label: "Ramazan ve Oruç Rehberi" },
  { key: "dini_sozluk",         label: "İslami Kavramlar Sözlüğü" },
  { key: "isimler_sozlugu",     label: "İslami İsimler ve Anlamları" },
  { key: "cevsan",              label: "Cevşen Duası" },
  { key: "islami_soru_cevap",   label: "Sor & Öğren (Soru–Cevap)" },
  { key: "namazin_turkcesi",    label: "Namazın Türkçe Okunuşu" },
  { key: "islam_quiz",          label: "İslami Soru Bankası" },
  { key: "hac_umre_rehberi",    label: "Hac & Umre Hazırlık" },
  { key: "settings",            label: "Ayarlar" },
  { key: "about",               label: "Uygulama Hakkında" },
  { key: "help",                label: "Yardım ve Destek" },
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
const defaultSettings = { soundEnabled: true, vibrationEnabled: true, darkTheme: true, notificationsEnabled: true, adsEnabled: true, };
const REVENUECAT_IOS_API_KEY = "appl_KUTzudTEGtrGVLIlBYYvdRzInwe"

export default function Islam_Yolu() {
  // RevenueCat implementation
  useEffect(() => {
    const setupRevenueCat = async () => {
      try {
        if (Platform.OS === "ios") {
          await Purchases.configure({
            apiKey: REVENUECAT_IOS_API_KEY,
          });
        }
      } catch (e) {
        console.log("RevenueCat configure ERROR:", e);
      }
    };

    setupRevenueCat();
  }, []);

  // Load if premium
  useEffect(() => {
    const loadPremium = async () => {
      try {
        const stored = await AsyncStorage.getItem("isPremium");
        if (stored === "true") {
          setIsPremium(true);
        }
      } catch (e) {
        console.log("loadPremium error", e);
      }
    };

    loadPremium();
  }, []);

  const [isPremium, setIsPremium] = useState(false);
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [prayerTimes, setPrayerTimes] = useState([]);
  const ANDROID_PRAYER_CHANNEL_ID = "prayer-channel-v2";

  const [activePage, setActivePage] = useState("home");
  const [isAppLibraryOpen, setIsAppLibraryOpen] = useState(false);
  const [backgroundSource, setBackgroundSource] = useState(BACKGROUNDS[0]);
  const [isRamadanNow, setIsRamadanNow] = useState(false);
  const { maybeShowInterstitial } = useInterstitialAds(settings.adsEnabled && !isPremium);

  // check if ramazan
  useEffect(() => {
    async function load() {
      setIsRamadanNow(await isRamadan());
    }
    load();
  }, []);

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
            adsEnabled: parsed.adsEnabled ?? true,
          };
        }

        setSettings(effectiveSettings);
        await ensureAndroidNotificationChannel();
        await requestNotificationPermissions();
        await scheduleDailyNotifications(effectiveSettings);
        const idx = Math.floor(Math.random() * BACKGROUNDS.length);
        setBackgroundSource(BACKGROUNDS[idx]);
      } catch (e) {
        if (DEBUG) console.log("init error:", e);
      }
    };

    init();
  }, []);

  // sync entitlements from RevenueCat
  const refreshPremiumFromRevenueCat = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const hasPremium =
        customerInfo.entitlements.active["premium_access"] != null;

      setIsPremium(hasPremium);
      await AsyncStorage.setItem("isPremium", hasPremium ? "true" : "false");
      return hasPremium;
    } catch (e) {
      console.log("refreshPremiumFromRevenueCat error", e);
      return false;
    }
  };

  // handle purchase
  const handlePurchase = async (productId) => {
    try {
      const offerings = await Purchases.getOfferings();
      const currentOffering = offerings.current;

      if (!currentOffering) {
        Alert.alert(
          "Hata",
          "Satın alınabilir paket bulunamadı. Lütfen daha sonra tekrar dene."
        );
        return;
      }

      const availablePackages = currentOffering.availablePackages || [];

      const selectedPackage = availablePackages.find(
        (p) => p.storeProduct.identifier === productId
      );

      if (!selectedPackage) {
        console.log(
          "Package not found for productId:",
          productId,
          availablePackages
        );
        Alert.alert(
          "Hata",
          "Bu paket şu anda mevcut değil. Lütfen daha sonra tekrar dene."
        );
        return;
      }

      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      const hasPremium =
        customerInfo.entitlements.active["premium_access"] != null;

      if (hasPremium) {
        await refreshPremiumFromRevenueCat();
        Alert.alert("Teşekkürler", "Premium üyelik aktif. Allah razı olsun. 🌙");
      } else {
        Alert.alert(
          "Hata",
          "Satın alma tamamlandı gibi görünmüyor. Lütfen tekrar deneyin."
        );
      }
    } catch (e) {
      console.log("handlePurchase error:", e);

      if (e.code === Purchases.PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
        return; // user canceled, no alert
      }

      Alert.alert(
        "Hata",
        "Satın alma tamamlanamadı. Lütfen internet bağlantını kontrol edip tekrar dene."
      );
    }
  };

  // handle restore
  const handleRestore = async () => {
    try {
      const { customerInfo } = await Purchases.restorePurchases();

      const hasPremium =
        customerInfo.entitlements.active["premium_access"] != null;

      if (hasPremium) {
        await refreshPremiumFromRevenueCat();
        Alert.alert("Başarılı", "Satın almaların geri yüklendi. Premium tekrar aktif.");
      } else {
        Alert.alert(
          "Bilgi",
          "Bu Apple hesabına bağlı aktif bir Premium üyelik bulunamadı."
        );
      }
    } catch (e) {
      console.log("handleRestore error:", e);
      Alert.alert(
        "Hata",
        "Satın almalar geri yüklenemedi. Lütfen daha sonra tekrar dene."
      );
    }
  };

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
          if (DEBUG) console.warn(`Could not parse time for ${name}:`, raw);
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
        Alert.alert("Hata", "Cevaptan hiç namaz vakti ayrıştırılamadı.");
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

  async function ensureAndroidNotificationChannel() {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync(ANDROID_PRAYER_CHANNEL_ID, {
      name: "Ezan Bildirimleri",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFDD55",
    });
  }

  async function ensureNotificationPermissions() {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status: requestStatus } = await Notifications.requestPermissionsAsync();
      finalStatus = requestStatus;
    }

    return finalStatus === "granted";
  }

  async function ensureAndroidChannel() {
    if (Platform.OS !== "android") return;

    await Notifications.setNotificationChannelAsync(ANDROID_PRAYER_CHANNEL_ID, {
      name: "Ezan Bildirimleri",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  async function scheduleDailyNotifications(overrideSettings) {
    try {
      const effectiveSettings = overrideSettings ?? settings;

      if (!effectiveSettings.notificationsEnabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        setIsScheduled(false);
        return;
      }

      const hasPermission = await ensureNotificationPermissions();
      if (!hasPermission) {
        Alert.alert(
          "Bildirim izni yok",
          "Bildirim gönderebilmemiz için ayarlardan izin vermen gerekiyor."
        );
        setIsScheduled(false);
        return;
      }

      await ensureAndroidChannel();

      await Notifications.cancelAllScheduledNotificationsAsync();

      const times = await fetchTodayPrayerTimes();
      if (!times || !Array.isArray(times) || times.length === 0) {
        setIsScheduled(false);
        return;
      }

      const now = new Date();

      for (const t of times) {
        const triggerDate = new Date(now);
        const hour = Number(t.hour);
        const minute = Number(t.minute);

        if (Number.isNaN(hour) || Number.isNaN(minute)) {
          continue;
        }

        triggerDate.setHours(hour, minute, 0, 0);

        if (triggerDate <= now) {
          triggerDate.setDate(triggerDate.getDate() + 1);
        }

        const trigger =
          Platform.OS === "android"
            ? {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
                channelId: ANDROID_PRAYER_CHANNEL_ID,
              }
            : {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: triggerDate,
              };

        const id = await Notifications.scheduleNotificationAsync({
          content: {
            title: `${t.name} ezanı`,
            body: `${t.name} namazı vakti geldi. Allah kabul etsin.`,
            sound: effectiveSettings.soundEnabled ? "default" : undefined,
          },
          trigger,
        });
      }

      setIsScheduled(true);
    } catch (error) {
      if (DEBUG) console.log("scheduleDailyNotifications ERROR:", error);
      Alert.alert("Hata", "Bildirimler ayarlanamadı.");
      setIsScheduled(false);
    }
  }

  async function isRamadan() {
    try {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth() + 1;
      const year = today.getFullYear();

      const url = `https://api.aladhan.com/v1/gToH/${day}-${month}-${year}`;
      const res = await fetch(url);
      const json = await res.json();

      if (!json?.data?.hijri) return false;

      const hijriMonth = parseInt(json.data.hijri.month.number, 10); // 1–12

      return hijriMonth === 9; // Ramadan = month 9
    } catch (e) {
      return false;
    }
  }

  function toggleAppLibrary() {
    setIsAppLibraryOpen((prev) => !prev);
  }

  function handleMenuItemPress(key) {
    const bigPages = [ "imsakiye", "dini_bayramlar", "takvim_arkasi", "iftarSayaci", "ilham", "namaz", "abdest", "namaz_sureleri", "yasin_suresi", "kaza_takip", "yakin_camiler", "ruyet", 
      "kirk_hadis", "veda_hutbesi", "otuziki_farz", "esmaul_husna", "islam_ilmihali", "kuran_fihristi", "tecvid", "hadis_fihristi", "secme_ayetler", "guzel_dualar", "salavatlar"];

    if (bigPages.includes(key) && settings.adsEnabled && !isPremium) {
      maybeShowInterstitial();
    }
    switch (key) {
      case "home":
      case "imsakiye":
      case "dini_bayramlar":
      case "takvim_arkasi":
      case "compass":
      case "zikirmatik":
      case "iftarSayaci":
      case "ilham":
      case "abdest":
      case "namaz":
      case "namaz_sureleri":
      case "namaz_takip":
      case "yasin_suresi":
      case "tesbih":
      case "kaza_takip":
      case "yakin_camiler":
      case "ruyet":
      case "kirk_hadis":
      case "veda_hutbesi":
      case "otuziki_farz":
      case "esmaul_husna":
      case "islam_ilmihali":
      case "kuran_fihristi":
      case "kurani_kerim":
      case "tecvid":
      case "hadis_fihristi":
      case "secme_ayetler":
      case "guzel_dualar":
      case "guzel_sozler":
      case "gunun_ayeti":
      case "salavatlar":
      case "peygamberler_tarihi":
      case "efendimizin_hayati":
      case "dort_halife":
      case "sahabelerin_hayati":
      case "hz_mevlana":
      case "mesnevi":
      case "ramazan_ve_oruc":
      case "dini_sozluk":
      case "cevsan":
      case "islami_soru_cevap":
      case "namazin_turkcesi":
      case "islam_quiz":
      case "hac_umre_rehberi":
      case "settings":
      case "about":
      case "help":
      case "paywall":
        setActivePage(key);
        break;
      default:
        Alert.alert(
          "Yakında",
          "Allah'ın izniyle bu özellik yakında gelecek inşAllah."
        );
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
      iftarSayaci: require("./assets/icons/iconPack/counter.png"),
      ilham: require("./assets/icons/iconPack/ilham.png"),
      abdest: require("./assets/icons/iconPack/abdest.png"),
      namaz: require("./assets/icons/iconPack/namaz.png"),
      namaz_sureleri: require("./assets/icons/iconPack/namaz_sure.png"),
      namaz_takip: require("./assets/icons/iconPack/namaz.png"),
      yasin_suresi: require("./assets/icons/iconPack/yasin.png"),
      tesbih: require("./assets/icons/iconPack/tesbih.png"),
      kaza_takip: require("./assets/icons/iconPack/kaza.png"),
      yakin_camiler: require("./assets/icons/iconPack/yakin.png"),
      ruyet: require("./assets/icons/iconPack/ruyet.png"),
      kirk_hadis: require("./assets/icons/iconPack/kirk.png"),
      veda_hutbesi: require("./assets/icons/iconPack/veda.png"),
      otuziki_farz: require("./assets/icons/iconPack/otuziki.png"),
      esmaul_husna: require("./assets/icons/iconPack/esma.png"),
      islam_ilmihali: require("./assets/icons/iconPack/ilmihal.png"),
      kurani_kerim: require("./assets/icons/iconPack/quran.png"),
      kuran_fihristi: require("./assets/icons/iconPack/index1.png"),
      hadis_fihristi: require("./assets/icons/iconPack/index2.png"),
      tecvid: require("./assets/icons/iconPack/quran.png"),
      yedis_yuz_ucyuz_hadis: require("./assets/icons/iconPack/quotes.png"),
      secme_ayetler: require("./assets/icons/iconPack/selected.png"),
      guzel_dualar: require("./assets/icons/iconPack/dua.png"),
      guzel_sozler: require("./assets/icons/iconPack/sozler.png"),
      gunun_ayeti: require("./assets/icons/iconPack/sozler.png"),
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
      namazin_turkcesi: require("./assets/icons/iconPack/namazTR.png"),
      islam_quiz: require("./assets/icons/iconPack/bank.png"),
      hac_umre_rehberi: require("./assets/icons/iconPack/guide.png"),
      settings: require("./assets/icons/iconPack/settings.png"),
      about: require("./assets/icons/iconPack/about.png"),
      help: require("./assets/icons/iconPack/help.png"),
    };

    return map[key] ?? { name: "apps", size: 28 }; // fallback
  }

  return (
    <ImageBackground source={backgroundSource} style={styles.background} resizeMode="cover" >
      <TextSizeButton activePage={activePage} visibleOnPages={[ "imsakiye", "dini_bayramlar", "takvim_arkasi", "ilham" ,"abdest", "namaz", "namaz_sureleri", "namaz_takip", "yasin_suresi", "ruyet", "kirk_hadis", "veda_hutbesi", "otuziki_farz", "islam_ilmihali", "kuran_fihristi", "hadis_fihristi", "yedis_yuz_ucyuz_hadis", "secme_ayetler", "guzel_dualar", "guzel_sozler", "salavatlar", "peygamberler_tarihi", "efendimizin_hayati", "dort_halife", "sahabelerin_hayati", "hz_mevlana", "mesnevi", "ramazan_ve_oruc", "dini_sozluk", "isimler_sozlugu", "cevsan", "islami_soru_cevap", "namazin_turkcesi", "hac_umre_rehberi", "about", "help"]} top={50} right={16}/>
      {/* =======================
          HOME PAGE
          ======================= */}
      {activePage === "home" && (
        <View style={styles.overlay}>
          <NamazTakipPage onBack={() => setActivePage("home")} />
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
          İFTAR SAYACI PAGE
          ======================= */}
      {activePage === "iftarSayaci" && (
        <IftarSayaciPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          İLHAM PAGE
          ======================= */}
      {activePage === "ilham" && (
        <IlhamPage onBack={() => setActivePage("home")} />
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
          YAKIN CAMİLER PAGE
          ======================= */}
      {activePage === "yakin_camiler" && (
        <NearbyMosquesPage onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          RUYET PAGE
          ======================= */}
      {activePage === "ruyet" && (
        <RuyetPage onBack={() => setActivePage("home")} />
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
      {activePage === "tecvid" && (
        <TecvidPage onBack={() => setActivePage("home")} />
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
          GÜNÜN AYETİ PAGE
          ======================= */}
      {activePage === "gunun_ayeti" && (
        <GununAyetiPage onBack={() => setActivePage("home")} />
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
        <SettingsPage
          onBack={() => setActivePage("home")}
          isPremium={isPremium}
          onGoPremium={() => setActivePage("paywall")}
          onSettingsChanged={(newSettings) => {
            setSettings(newSettings);
            scheduleDailyNotifications(newSettings);
            if (newSettings.backgroundChanged) {
              const idx = Math.floor(Math.random() * BACKGROUNDS.length);
              setBackgroundSource(BACKGROUNDS[idx]);
            }
          }}
        />
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

      {/* =======================
          PAYWALL PAGE
          ======================= */}
      {activePage === "paywall" && (
        <PaywallPage 
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        isPremium={isPremium} 
        onBack={() => setActivePage("home")} />
      )}

      {/* =======================
          APP LIBRARY OVERLAY
          ======================= */}
      {isAppLibraryOpen && (
        <View style={styles.appLibraryOverlay}>
          {/* Backdrop behind the library content */}
          <TouchableOpacity
            style={styles.appLibraryBackdrop}
            activeOpacity={1}
            onPress={toggleAppLibrary}
          />

          <View style={styles.appLibraryContent}>
            <Text style={styles.appLibraryTitle}> Uygulamalar </Text>

            <ScrollView contentContainerStyle={styles.appLibraryGrid}>
              {MENU_ITEMS.filter((item) => {
                if (item.key === "iftarSayaci" && !isRamadanNow) return false;
                return true;
              }).map((item) => (
                <TouchableOpacity
                  key={item.key}
                  style={styles.appTile}
                  onPress={() => {
                    handleMenuItemPress(item.key);
                    setIsAppLibraryOpen(false);
                  }}
                >
                  <View style={styles.appTileIcon}>
                    <Image
                      source={getIconForKey(item.key)}
                      style={{ width: 30, height: 30 }}
                      resizeMode="contain"
                    />
                  </View>

                  <ScaledText baseSize={14} style={styles.appTileLabel}>
                    {item.label}
                  </ScaledText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* =======================
          BANNER AD
          ======================= */}
      {activePage === "home" && settings.adsEnabled && !isPremium && BannerAd && BANNER_AD_UNIT_ID && (
        <View style={styles.adContainer}>
          <BannerAd
            unitId={BANNER_AD_UNIT_ID}
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

      {/* DockBar */}
      <DockBar activePage={activePage} onNavigate={(key) => key === "appLauncher" ? toggleAppLibrary() : setActivePage(key)} />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingRight: 15,
    paddingLeft: 20,
    paddingBottom: 90,
    alignItems: "stretch",
    justifyContent: "flex-start",
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
