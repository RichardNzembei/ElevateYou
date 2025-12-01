// plugins/firebase.client.js   ← rename to .client.js !
import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check'

export default defineNuxtPlugin((nuxtApp) => {
    // This file is .client.js → runs ONLY on client → no double init!
    const config = useRuntimeConfig().public

    const firebaseConfig = {
        apiKey: config.firebaseApiKey,
        authDomain: config.firebaseAuthDomain,
        projectId: config.firebaseProjectId,
        storageBucket: config.firebaseStorageBucket,
        messagingSenderId: config.firebaseMessagingSenderId,
        appId: config.firebaseAppId,
        measurementId: config.firebaseMeasurementId,
    }

    // THIS IS THE KEY: Prevent double initialization
    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const storage = getStorage(app)

    // Optional: App Check
    if (config.recaptchaSiteKey) {
        initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(config.recaptchaSiteKey),
            isTokenAutoRefreshEnabled: true,
        })
    }

    return {
        provide: {
            firebaseApp: app,
            auth,
            firestore,
            storage,
        },
    }
})