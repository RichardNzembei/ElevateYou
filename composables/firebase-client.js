import { useNuxtApp } from "#app";

export const useFirebase = () => {
  const { $firebaseApp, $auth, $firestore, $storage, $authReady } = useNuxtApp();
  return {
    app: $firebaseApp,
    auth: $auth,
    firestore: $firestore,
    storage: $storage,
    authReady: $authReady,
  };
};
