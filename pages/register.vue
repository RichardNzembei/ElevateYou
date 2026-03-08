<template>
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
        <div class="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span class="text-[13px] font-bold text-neutral-900 tracking-tight">ElevateYou</span>
      </NuxtLink>
      <h1 class="text-[18px] font-extrabold text-neutral-900 tracking-tight">Create your account</h1>
      <p class="text-[12px] text-neutral-500 mt-1">Start managing your work today</p>
    </div>

    <div class="card p-5">
      <Transition name="slide">
        <div v-if="success" class="mb-3 p-3 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 text-center">
          <p class="font-semibold text-[12px]">Account created!</p>
          <p class="text-emerald-600 mt-0.5 text-[11px]">Check your email to verify.</p>
          <p v-if="inviteMessage" class="text-emerald-600 mt-1 font-semibold text-[11px]">{{ inviteMessage }}</p>
        </div>
      </Transition>

      <Transition name="slide">
        <div v-if="error" class="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-red-700 text-center text-[11px]">{{ error }}</div>
      </Transition>

      <form @submit.prevent="register" class="space-y-3">
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Email</label>
          <input v-model="email" type="email" required class="input-field" placeholder="you@example.com" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Password</label>
          <input v-model="password" type="password" required class="input-field" placeholder="8+ characters" />
          <div class="mt-1.5 flex items-center gap-1 text-[10px]">
            <svg class="w-4 h-4" :class="password.length >= 8 ? 'text-emerald-500' : 'text-neutral-300'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
            <span :class="password.length >= 8 ? 'text-emerald-600' : 'text-neutral-400'">8+ characters</span>
          </div>
        </div>
        <button type="submit" :disabled="loading || !isPasswordValid" class="btn-primary w-full !py-2">
          <span v-if="!loading">Create Account</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            Creating...
          </span>
        </button>
      </form>
    </div>

    <p class="mt-4 text-center text-[11px] text-neutral-500">
      Already have an account?
      <NuxtLink to="/login" class="font-semibold text-neutral-900 hover:underline">Sign in</NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import { useMemberStore } from '~/stores/useMemberStore'

definePageMeta({ layout: 'auth' })

const { auth, firestore } = useFirebase()
const router = useRouter()
const memberStore = useMemberStore()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)
const inviteMessage = ref('')
const isPasswordValid = computed(() => password.value.length >= 8)

const register = async () => {
  if (!isPasswordValid.value) { error.value = 'Password must be at least 8 characters'; return }
  loading.value = true; error.value = ''; success.value = false; inviteMessage.value = ''
  try {
    const { createUserWithEmailAndPassword, sendEmailVerification } = await import('firebase/auth')
    const { doc, setDoc } = await import('firebase/firestore')
    const credential = await createUserWithEmailAndPassword(auth, email.value.trim(), password.value)
    await sendEmailVerification(credential.user)
    await setDoc(doc(firestore, 'users', credential.user.uid), { email: credential.user.email, createdAt: new Date() })
    const { joinedCount, workspaceNames } = await memberStore.acceptInviteOnRegister(credential.user.uid, email.value.trim())
    success.value = true
    if (joinedCount > 0) inviteMessage.value = `You've been added to ${joinedCount} workspace${joinedCount > 1 ? 's' : ''}: ${workspaceNames.join(', ')}!`
    setTimeout(() => router.push('/login'), 2500)
  } catch (err: any) {
    error.value = err.code === 'auth/email-already-in-use' ? 'Email already in use' : 'Registration failed'
  } finally { loading.value = false }
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: all 0.3s ease; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
