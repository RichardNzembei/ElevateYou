<template>

<button @click="logout" class="mt-4 px-4 py-2 bg-red-500 text-white rounded-full text-sm hover:bg-red-600">
          Log Out
        </button>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue';  
import { useFirebase } from '#imports';
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  linkWithCredential,
  fetchSignInMethodsForEmail,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const { auth, firestore } = useFirebase();
const router = useRouter();
const logout = async () => {
  if (!process.client || !auth) return;
  try {
    await signOut(auth);
    router.push('/login');
  } catch (err) {
    error.value = errorMessages[err.code] || 'Failed to log out. Please try again.';
    console.error('Logout error:', err);
  }
};
</script>