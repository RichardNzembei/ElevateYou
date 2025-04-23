import { defineNuxtConfig } from "nuxt/config";
import { VitePWA } from "vite-plugin-pwa";

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@pinia/nuxt"],

  compatibilityDate: "2025-02-15",
  plugins: ["~/plugins/firebase.js"],

  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
      recaptchaSiteKey: process.env.NUXT_PUBLIC_RECAPTCHA_SITE_KEY,
    },
  },

  vite: {
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "Growth Tracker",
          short_name: "Growth",
          theme_color: "#10B981",
          icons: [
            {
              src: "/icon-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  },
});
