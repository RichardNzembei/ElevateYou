import { defineNuxtPlugin } from '#app'
import { initializeApp, getApps } from 'firebase/app'
import { getAuth, browserLocalPersistence, setPersistence, onAuthStateChanged } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

export default defineNuxtPlugin((nuxtApp) => {
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

    const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

    const auth = getAuth(app)
    const firestore = getFirestore(app)
    const storage = getStorage(app)

    // Ensure auth persists across page reloads (localStorage)
    setPersistence(auth, browserLocalPersistence).catch(() => {})

    // Create a promise that resolves once Firebase has restored the auth session
    const authReady = new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, () => {
            unsubscribe()
            resolve(true)
        })
    })

    // Enable offline persistence for faster loads and offline support
    enableIndexedDbPersistence(firestore).catch((err) => {
        if (err.code === 'failed-precondition') {
            console.warn('Firestore persistence unavailable: multiple tabs open')
        } else if (err.code === 'unimplemented') {
            console.warn('Firestore persistence not supported in this browser')
        }
    })

    // Only initialize App Check in production with a valid key
    if (config.recaptchaSiteKey && typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
        import('firebase/app-check').then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
            initializeAppCheck(app, {
                provider: new ReCaptchaV3Provider(config.recaptchaSiteKey),
                isTokenAutoRefreshEnabled: true,
            })
        })
    }

    return {
        provide: {
            firebaseApp: app,
            auth,
            firestore,
            storage,
            authReady,
        },
    }
})
