// files/useAds.js
import { useEffect, useRef, useState, useCallback } from "react";
import { Platform } from "react-native";
import Constants from "expo-constants";

const IS_EXPO_GO = Constants.appOwnership === "expo";
const ADS_ENABLED = !IS_EXPO_GO;

let mobileAds = null;
let InterstitialAd = null;
let AdEventType = null;
let TestIds = null;
let INTERSTITIAL_AD_UNIT_ID = "";
let interstitial = null;

if (ADS_ENABLED) {
  try {
    const googleMobileAds = require("react-native-google-mobile-ads");
    mobileAds = googleMobileAds.default;
    InterstitialAd = googleMobileAds.InterstitialAd;
    AdEventType = googleMobileAds.AdEventType;
    TestIds = googleMobileAds.TestIds;

    INTERSTITIAL_AD_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : Platform.select({ ios: "ca-app-pub-8919233762784771/2566591222", android: "ca-app-pub-8919233762784771/7773354281", });

    interstitial = InterstitialAd.createForAdRequest( INTERSTITIAL_AD_UNIT_ID, { requestNonPersonalizedAdsOnly: false, } );
  } catch (e) {
    console.log("Google Mobile Ads init error:", e);
  }
}

export function useInterstitialAds(adsEnabled) {
  const [isLoaded, setIsLoaded] = useState(false);
  const lastShownRef = useRef(0);

  // ads SDK : no-op hook 
  if (!ADS_ENABLED || !interstitial || !AdEventType || !mobileAds) {
    const noop = useCallback(() => {}, []);
    return { maybeShowInterstitial: noop };
  }

  useEffect(() => {
    // SDK initialize
    mobileAds()
      .initialize()
      .catch((e) => {
        console.log("mobileAds initialize error:", e);
      });

    if (!interstitial) {
      return;
    }

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setIsLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        lastShownRef.current = Date.now();
        setIsLoaded(false);
        interstitial.load();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.log("Interstitial error:", error);
        setIsLoaded(false);
      }
    );

    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const maybeShowInterstitial = useCallback(
    () => {
      if (!adsEnabled) return;
      if (!isLoaded) return;

      const now = Date.now();
      const MIN_INTERVAL = 3 * 60 * 1000;

      if (now - lastShownRef.current < MIN_INTERVAL) {
        return;
      }

      try {
        interstitial.show();
      } catch (e) {
        console.log("Interstitial show error:", e);
      }
    },
    [adsEnabled, isLoaded]
  );

  return { maybeShowInterstitial };
}
