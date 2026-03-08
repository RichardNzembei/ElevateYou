<template>
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
        <div class="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span class="text-[13px] font-bold text-neutral-900 tracking-tight">ElevateYou</span>
      </NuxtLink>
      <h1 class="text-[18px] font-extrabold text-neutral-900 tracking-tight">Reset your password</h1>
      <p class="text-[12px] text-neutral-500 mt-1">We'll send you a link to get back in</p>
    </div>

    <div class="card p-5">
      <!-- Success state -->
      <Transition name="slide" mode="out-in">
        <div v-if="sent" key="sent" class="text-center py-1">
          <div class="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          </div>
          <h2 class="text-[14px] font-bold text-neutral-900 mb-1">Check your email</h2>
          <p class="text-[11px] text-neutral-500 leading-relaxed mb-0.5">
            We sent a password reset link to
          </p>
          <p class="text-[12px] font-semibold text-neutral-900 mb-4">{{ email }}</p>
          <p class="text-[10px] text-neutral-400 mb-4">
            Didn't receive it? Check spam or
            <button @click="resend" :disabled="cooldown > 0" class="font-semibold text-neutral-900 hover:underline disabled:text-neutral-400 disabled:no-underline">
              {{ cooldown > 0 ? `resend in ${cooldown}s` : 'resend' }}
            </button>
          </p>
          <Transition name="slide">
            <div v-if="error" class="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-center text-[11px]">{{ error }}</div>
          </Transition>
          <NuxtLink to="/login" class="btn-primary w-full !py-2 inline-flex items-center justify-center">Back to Sign In</NuxtLink>
        </div>
      </Transition>

      <!-- Form state -->
      <Transition name="slide" mode="out-in">
        <div v-if="!sent" key="form">
          <Transition name="slide">
            <div v-if="error" class="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-center text-[11px]">{{ error }}</div>
          </Transition>

          <form @submit.prevent="sendReset" class="space-y-3">
            <div>
              <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Email address</label>
              <input v-model="email" type="email" required class="input-field" placeholder="you@example.com" autofocus />
            </div>
            <button type="submit" :disabled="loading || !email.trim()" class="btn-primary w-full !py-2">
              <span v-if="!loading">Send Reset Link</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                Sending...
              </span>
            </button>
          </form>
        </div>
      </Transition>
    </div>

    <p class="mt-4 text-center text-[11px] text-neutral-500">
      Remember your password?
      <NuxtLink to="/login" class="font-semibold text-neutral-900 hover:underline">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { auth } = useFirebase()
const email = ref('')
const loading = ref(false)
const error = ref('')
const sent = ref(false)
const cooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

const sendReset = async () => {
  if (!email.value.trim()) return
  loading.value = true
  error.value = ''
  try {
    const { sendPasswordResetEmail } = await import('firebase/auth')
    await sendPasswordResetEmail(auth, email.value.trim())
    sent.value = true
    startCooldown()
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      sent.value = true
      startCooldown()
    } else if (err.code === 'auth/too-many-requests') {
      error.value = 'Too many requests. Please try again later.'
    } else if (err.code === 'auth/invalid-email') {
      error.value = 'Please enter a valid email address.'
    } else {
      error.value = 'Something went wrong. Please try again.'
    }
  } finally {
    loading.value = false
  }
}

const resend = async () => {
  if (cooldown.value > 0) return
  loading.value = true
  error.value = ''
  try {
    const { sendPasswordResetEmail } = await import('firebase/auth')
    await sendPasswordResetEmail(auth, email.value.trim())
    startCooldown()
  } catch (err: any) {
    if (err.code === 'auth/too-many-requests') {
      error.value = 'Too many requests. Please wait before trying again.'
    } else {
      error.value = err.message || 'Failed to resend. Please try again.'
    }
    console.error('Resend error:', err.code, err.message)
  } finally { loading.value = false }
}

const startCooldown = () => {
  cooldown.value = 60
  if (cooldownTimer) clearInterval(cooldownTimer)
  cooldownTimer = setInterval(() => {
    cooldown.value--
    if (cooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onBeforeUnmount(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
