<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
      <h1 class="text-2xl font-quicksand font-bold text-navy-800 text-center mb-6">Log In</h1>
      <form @submit.prevent="login">
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
        <button type="submit"
          class="w-full py-2 px-4 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300"
          :disabled="loading">
          {{ loading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
      <p class="mt-4 text-sm text-gray-600 text-center">
        Don’t have an account? <NuxtLink to="/" class="text-green-500 hover:underline">Register</NuxtLink>
      </p>
      <p v-if="error" class="mt-4 text-sm text-red-500 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useFirebase } from '#imports';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';

const { auth } = useFirebase();
const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

const login = async () => {
  loading.value = true;
  error.value = '';
  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = err.message;
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