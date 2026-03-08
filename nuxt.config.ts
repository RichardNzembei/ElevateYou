import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@vite-pwa/nuxt",
  ],

  compatibilityDate: "2025-02-15",

  plugins: [
    '~/plugins/firebase.client.js'
  ],

  app: {
    head: {
      title: 'ElevateYou',
      meta: [
        { name: 'description', content: 'Open source project management platform' }
      ]
    }
  },

  pwa: {
    registerType: "autoUpdate",
    manifest: {
      name: "ElevateYou",
      short_name: "ElevateYou",
      description: "Open source project management platform",
      theme_color: "#171717",
      background_color: "#ffffff",
      icons: [
        {
          src: "/icon/192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
      ],
    },
    devOptions: {
      enabled: false,
    },
  },

  runtimeConfig: {
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
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
});
