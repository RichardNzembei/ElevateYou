<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
    <div class="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md mx-4 transition-all duration-500 hover:shadow-2xl">
      <!-- Registration Header with Distinct Style -->
      <div class="text-center mb-8">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-full shadow-lg inline-block mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">A World of Codes</h1>
        <p class="text-gray-500 mt-2">Create your account to get started</p>
      </div>

      <form @submit.prevent="register" class="space-y-6">
        <div class="space-y-1">
          <label for="email" class="block text-sm font-medium text-gray-700">Email Address</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input v-model="email" type="email" id="email"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="you@example.com"
              required />
          </div>
        </div>

        <div class="space-y-1">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
              </svg>
            </div>
            <input v-model="password" type="password" id="password"
              class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              placeholder="••••••••"
              required />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span class="text-xs text-gray-500">8+ chars</span>
            </div>
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="bg-blue-50 p-3 rounded-lg">
          <h4 class="text-xs font-medium text-blue-800 mb-1">PASSWORD REQUIREMENTS</h4>
          <ul class="text-xs text-gray-600 space-y-1">
            <li class="flex items-center" :class="{'text-green-600': password.length >= 8}">
              <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Minimum 8 characters
            </li>
            <li class="flex items-center" :class="{'text-green-600': /[A-Z]/.test(password)}">
              <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              At least one uppercase letter
            </li>
            <li class="flex items-center" :class="{'text-green-600': /\d/.test(password)}">
              <svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              At least one number
            </li>
          </ul>
        </div>

        <div id="recaptcha-container" class="flex justify-center"></div>

        <button type="submit"
          class="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] shadow-md"
          :disabled="loading"
          :class="{'opacity-70 cursor-not-allowed': loading}">
          <span v-if="!loading" class="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
            </svg>
            Create Account
          </span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Account...
          </span>
        </button>
      </form>

      <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Or sign up with</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button @click="signInWithGoogle" type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            <span class="ml-2">Google</span>
          </button>

          <button @click="signInWithGitHub" type="button"
            class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-xl shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
            <span class="ml-2">GitHub</span>
          </button>
        </div>
      </div>

      <p class="mt-8 text-center text-sm text-gray-600">
        Already have an account?
        <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-700 hover:underline transition duration-200">Sign in</NuxtLink>
      </p>

      <div v-if="success" class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 animate-fade-in">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">
              Account created successfully! Please check your email to verify your account.
            </p>
          </div>
        </div>
      </div>

      <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200 animate-shake">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>
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
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out forwards;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}
</style>