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

const login = async () => {
  loading.value = true; error.value = ''
  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    await signInWithEmailAndPassword(auth, email.value, password.value)
    router.push('/dashboard')
  } catch { error.value = 'Invalid email or password' }
  finally { loading.value = false }
}
</script>
