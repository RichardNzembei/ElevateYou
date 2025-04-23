import { defineNuxtPlugin } from "#app";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

export default defineNuxtPlugin((nuxtApp) => {
  if (!process.client) return {};

  const config = nuxtApp.$config.public;
  const requiredKeys = [
    "firebaseApiKey",
    "firebaseAuthDomain",
    "firebaseProjectId",
    "firebaseAppId",
  ];
  if (!requiredKeys.every((key) => config[key])) {
    console.error("Missing Firebase configuration");
    return {};
  }

  const firebaseConfig = {
    apiKey: config.firebaseApiKey,
    authDomain: config.firebaseAuthDomain,
    projectId: config.firebaseProjectId,
    storageBucket: config.firebaseStorageBucket,
    messagingSenderId: config.firebaseMessagingSenderId,
    appId: config.firebaseAppId,
    measurementId: config.firebaseMeasurementId,
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  if (config.recaptchaSiteKey) {
    initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(config.recaptchaSiteKey),
      isTokenAutoRefreshEnabled: true,
    });
  }

  // Provide Firebase services to Nuxt context
  nuxtApp.vueApp.provide("firebaseApp", app);
  nuxtApp.vueApp.provide("auth", auth);
  nuxtApp.vueApp.provide("firestore", firestore);
  nuxtApp.vueApp.provide("storage", storage);

  return {
    provide: {
      firebaseApp: app,
      auth,
      firestore,
      storage,
    },
  };
});
