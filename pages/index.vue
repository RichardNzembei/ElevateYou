<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4">
    <div class="w-full max-w-md">
      <div class="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/30">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl mb-4">
            <svg class="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Create Account</h1>
          <p class="text-gray-600 mt-2">Join thousands building better habits</p>
        </div>

        <!-- Success Message -->
        <Transition name="slide">
          <div v-if="success" class="mb-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center">
            <svg class="w-10 h-10 mx-auto mb-3 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <p class="font-semibold">Welcome aboard!</p>
            <p class="text-sm mt-1">Check your email to verify your account.</p>
          </div>
        </Transition>

        <!-- Error Message -->
        <Transition name="slide">
          <div v-if="error" class="mb-6 p-5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
            <p class="font-medium">{{ error }}</p>
          </div>
        </Transition>

        <!-- Form -->
        <form @submit.prevent="register" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
                v-model="email"
                type="email"
                required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-black"
                placeholder="you@awesome.com"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
                v-model="password"
                type="password"
                required
                class="w-full px-4 py-3.5 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white transition-all text-black"
                placeholder="••••••••"
            />

            <!-- Password Strength -->
            <div class="mt-3 space-y-1">
              <div class="flex items-center gap-2 text-xs">
                <svg class="w-4 h-4" :class="password.length >= 8 ? 'text-emerald-500' : 'text-gray-400'" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
                <span :class="password.length >= 8 ? 'text-emerald-600' : 'text-gray-500'">8+ characters</span>
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <button
              type="submit"
              :disabled="loading || !isPasswordValid"
              class="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else>Creating account...</span>
          </button>
        </form>

        <!-- Login Link -->
        <p class="mt-10 text-center text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/login" class="font-semibold text-indigo-600 hover:text-indigo-700 underline">
            Sign in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { auth, firestore } = useFirebase()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const isPasswordValid = computed(() => password.value.length >= 8)

const register = async () => {
  if (!isPasswordValid.value) {
    error.value = 'Password must be at least 8 characters'
    return
  }

  loading.value = true
  error.value = ''
  success.value = false

  try {
    const { createUserWithEmailAndPassword, sendEmailVerification } = await import('firebase/auth')
    const { doc, setDoc } = await import('firebase/firestore')

    const credential = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    const user = credential.user

    await sendEmailVerification(user)

    await setDoc(doc(firestore, 'users', user.uid), {
      email: user.email,
      createdAt: new Date()
    })

    success.value = true
    setTimeout(() => router.push('/login'), 3000)
  } catch (err: any) {
    error.value = err.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.4s ease;
}
.slide-enter-from, .slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>