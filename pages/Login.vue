<template>
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
        <div class="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span class="text-[13px] font-bold text-neutral-900 tracking-tight">ElevateYou</span>
      </NuxtLink>
      <h1 class="text-[18px] font-extrabold text-neutral-900 tracking-tight">Welcome back</h1>
      <p class="text-[12px] text-neutral-500 mt-1">Sign in to your workspace</p>
    </div>

    <div class="card p-5">
      <button @click="googleSignIn" :disabled="googleLoading" class="w-full flex items-center justify-center gap-2 py-2 px-3 border border-neutral-200 rounded-lg text-[12px] font-medium text-neutral-700 hover:bg-neutral-50 transition-colors">
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
        <span v-if="!googleLoading">Continue with Google</span>
        <span v-else>Signing in...</span>
      </button>

      <div class="flex items-center gap-3 my-3">
        <div class="flex-1 h-px bg-neutral-200"></div>
        <span class="text-[10px] text-neutral-400 uppercase">or</span>
        <div class="flex-1 h-px bg-neutral-200"></div>
      </div>

      <form @submit.prevent="login" class="space-y-3">
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Email</label>
          <input v-model="email" type="email" required class="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <div class="flex items-center justify-between mb-1">
            <label class="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide">Password</label>
            <NuxtLink to="/forgot-password" class="text-[10px] font-medium text-neutral-400 hover:text-neutral-900 transition-colors">Forgot?</NuxtLink>
          </div>
          <input v-model="password" type="password" required class="input-field" placeholder="Enter your password" />
        </div>
        <button type="submit" :disabled="loading" class="btn-primary w-full !py-2">
          <span v-if="!loading">Sign In</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            Signing in...
          </span>
        </button>
      </form>

      <div v-if="error" class="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-center text-[11px]">{{ error }}</div>
    </div>

    <p class="mt-4 text-center text-[11px] text-neutral-500">
      Don't have an account?
      <NuxtLink to="/register" class="font-semibold text-neutral-900 hover:underline">Sign up</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { auth } = useFirebase()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const googleLoading = ref(false)

const login = async () => {
  loading.value = true; error.value = ''
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch { error.value = 'Invalid email or password' }
  finally { loading.value = false }
}

const googleSignIn = async () => {
  googleLoading.value = true; error.value = ''
  try {
    const { signInWithPopup, GoogleAuthProvider } = await import('firebase/auth')
    await signInWithPopup(auth, new GoogleAuthProvider())
    router.push('/dashboard')
  } catch (err: any) {
    if (err.code !== 'auth/popup-closed-by-user') {
      error.value = 'Google sign-in failed. Please try again.'
    }
  } finally { googleLoading.value = false }
}
</script>
