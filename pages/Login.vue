<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
    <div class="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md mx-4">
      <div class="flex justify-center mb-6">
        <div class="bg-gradient-to-r from-green-400 to-blue-500 p-3 rounded-full shadow-lg">
          <svg class="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      <h1 class="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back</h1>
      <p class="text-center text-gray-500 mb-8">Sign in to continue your journey</p>

      <form @submit.prevent="login" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
              v-model="email"
              type="email"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black"
              placeholder="you@example.com"
              required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
              v-model="password"
              type="password"
              class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-black"
              placeholder="••••••••"
              required
          />
        </div>

        <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium rounded-xl hover:from-green-600 hover:to-blue-600 transition disabled:opacity-70"
        >
          <span v-if="!loading">Log In</span>
          <span v-else>Processing...</span>
        </button>
      </form>

      <p class="mt-8 text-center text-sm text-gray-600">
        Don't have an account?
        <NuxtLink to="/" class="font-medium text-green-600 hover:text-green-700 underline">Sign up</NuxtLink>
      </p>

      <p v-if="error" class="mt-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
const { auth } = useFirebase()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  loading.value = true
  error.value = ''

  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = 'Invalid email or password'
  } finally {
    loading.value = false
  }
}
</script>