<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-quicksand font-bold text-navy-800 text-center mb-6">Create Your Account</h1>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" id="email"
            class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required />
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" id="password"
            class="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            required />
        </div>
        <div id="recaptcha-container"></div>
        <button type="submit"
          class="w-full py-2 px-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
          :disabled="loading">
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>
      <p class="mt-4 text-sm text-gray-600 text-center">
        Already have an account? <NuxtLink to="/login" class="text-green-500 hover:underline">Log in</NuxtLink>
      </p>
      <p v-if="success" class="mt-4 text-sm text-green-500 text-center">
        Account created! Please check your email to verify your account.
      </p>
      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useFirebase } from '#imports';
import { createUserWithEmailAndPassword, RecaptchaVerifier, sendEmailVerification, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'vue-router';

const { auth, firestore } = useFirebase();
const email = ref('');
const password = ref('');
const error = ref('');
const success = ref(false);
const loading = ref(false);
const router = useRouter();

const errorMessages = {
  'auth/email-already-in-use': 'This email is already registered. Please log in or reset your password.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/weak-password': 'Password must be at least 6 characters long.',
  'auth/operation-not-allowed': 'Email/password registration is disabled.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
};

onMounted(() => {
  if (!auth) {
    error.value = 'Authentication service is not available.';
  }
});

const register = async () => {
  if (!auth) {
    error.value = 'Authentication service is not available.';
    return;
  }
  loading.value = true;
  error.value = '';
  success.value = false;
  try {
    // Check if email is already in use
    const signInMethods = await fetchSignInMethodsForEmail(auth, email.value);
    if (signInMethods.length > 0) {
      error.value = errorMessages['auth/email-already-in-use'];
      return;
    }

    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => {
        console.log('reCAPTCHA verified');
      },
    });

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user;
    console.log('Authenticated user UID:', user.uid);

    await sendEmailVerification(user);
    console.log('Verification email sent');

    await setDoc(doc(firestore, 'Users', user.uid), {
      profile: {
        connectedAccounts: {
          coding: { github: null },
          workouts: { googleFit: null },
          screenTime: { devicePermissions: false },
          finances: { manual: false },
        },
      },
      devTracker: [],
      workouts: [],
      screenTime: [],
      finances: { expenses: [], income: [] },
      reminders: [],
      insights: [],
    });
    console.log('User document created in Firestore');

    success.value = true;
    setTimeout(() => router.push('/login'), 2000);
  } catch (err) {
    error.value = errorMessages[err.code] || `An error occurred: ${err.message}`;
    if (!errorMessages[err.code]) {
      console.error('Registration error:', err); // Log only unhandled errors
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.font-quicksand {
  font-family: 'Quicksand', sans-serif;
}
</style>