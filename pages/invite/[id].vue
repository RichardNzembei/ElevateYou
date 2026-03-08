<template>
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <NuxtLink to="/" class="inline-flex items-center gap-2 mb-6">
        <div class="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
          <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span class="text-[13px] font-bold text-neutral-900 tracking-tight">ElevateYou</span>
      </NuxtLink>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="card p-8 text-center">
      <svg class="animate-spin h-6 w-6 text-neutral-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
      <p class="text-[12px] text-neutral-500">Loading invitation...</p>
    </div>

    <!-- Invalid / expired -->
    <div v-else-if="error" class="card p-8 text-center">
      <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center mx-auto mb-3">
        <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </div>
      <h2 class="text-[14px] font-bold text-neutral-900 mb-1">Invalid Invitation</h2>
      <p class="text-[12px] text-neutral-500">{{ error }}</p>
      <NuxtLink to="/login" class="btn-primary mt-4 inline-block">Go to Login</NuxtLink>
    </div>

    <!-- Invite details -->
    <div v-else-if="invite" class="card p-6 text-center">
      <div class="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <svg class="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </div>
      <h2 class="text-[14px] font-bold text-neutral-900 mb-1">You're invited!</h2>
      <p class="text-[12px] text-neutral-500 mb-4">
        Join <span class="font-semibold text-neutral-700">{{ invite.workspaceName }}</span> as
        <span class="font-semibold text-neutral-700">{{ invite.role }}</span>
      </p>

      <!-- Already accepted -->
      <div v-if="invite.status === 'accepted'" class="p-3 bg-emerald-50 border border-emerald-200 rounded-lg mb-4">
        <p class="text-[12px] text-emerald-700 font-medium">This invite has already been accepted.</p>
      </div>

      <!-- Not logged in -->
      <div v-if="!currentUser && invite.status === 'pending'" class="space-y-2.5">
        <p class="text-[11px] text-neutral-400">Sign in or create an account to accept</p>
        <NuxtLink :to="`/login?redirect=/invite/${route.params.id}`" class="btn-primary w-full block text-center">Sign In</NuxtLink>
        <NuxtLink :to="`/register?redirect=/invite/${route.params.id}`" class="btn-secondary w-full block text-center">Create Account</NuxtLink>
      </div>

      <!-- Logged in — accept -->
      <div v-if="currentUser && invite.status === 'pending'" class="space-y-2.5">
        <p class="text-[11px] text-neutral-400">Signed in as <span class="font-medium text-neutral-600">{{ currentUser.email }}</span></p>
        <button @click="acceptInvite" :disabled="accepting" class="btn-primary w-full">
          <span v-if="!accepting">Accept Invitation</span>
          <span v-else class="flex items-center justify-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
            Joining...
          </span>
        </button>
      </div>

      <!-- Logged in — already accepted -->
      <div v-if="currentUser && invite.status === 'accepted'">
        <NuxtLink to="/dashboard" class="btn-primary w-full block text-center">Go to Dashboard</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMemberStore } from '~/stores/useMemberStore'

definePageMeta({ layout: 'auth', ssr: false })

const route = useRoute()
const router = useRouter()
const { auth, firestore, authReady } = useFirebase()
const memberStore = useMemberStore()

const loading = ref(true)
const error = ref('')
const invite = ref<any>(null)
const currentUser = ref<any>(null)
const accepting = ref(false)

onMounted(async () => {
  await authReady
  currentUser.value = auth.currentUser

  try {
    const { doc, getDoc } = await import('firebase/firestore')
    const inviteSnap = await getDoc(doc(firestore, 'invites', route.params.id as string))

    if (!inviteSnap.exists()) {
      error.value = 'This invitation link is invalid or has expired.'
      return
    }

    invite.value = { id: inviteSnap.id, ...inviteSnap.data() }
  } catch {
    error.value = 'Failed to load invitation.'
  } finally {
    loading.value = false
  }
})

const acceptInvite = async () => {
  if (!currentUser.value || !invite.value) return
  accepting.value = true

  try {
    const { doc, setDoc, updateDoc, arrayUnion, serverTimestamp } = await import('firebase/firestore')
    const uid = currentUser.value.uid
    const inv = invite.value

    // Add to workspace members
    await setDoc(doc(firestore, 'workspaces', inv.workspaceId, 'members', uid), {
      email: currentUser.value.email,
      displayName: currentUser.value.displayName || currentUser.value.email?.split('@')[0] || '',
      photoURL: currentUser.value.photoURL || null,
      role: inv.role || 'member',
      joinedAt: new Date(),
      isOnline: true
    })

    // Add workspace to user's workspaces
    await setDoc(doc(firestore, 'users', uid, 'workspaces', inv.workspaceId), {
      role: inv.role || 'member',
      joinedAt: new Date()
    })

    // Add to project memberIds
    const projectIds = inv.projectIds || []
    for (const pid of projectIds) {
      await updateDoc(doc(firestore, 'projects', pid), {
        memberIds: arrayUnion(uid)
      })
    }

    // Mark invite as accepted
    await setDoc(doc(firestore, 'invites', inv.id), {
      status: 'accepted',
      acceptedAt: serverTimestamp(),
      acceptedBy: uid
    }, { merge: true })

    invite.value.status = 'accepted'

    // Redirect to dashboard after short delay
    setTimeout(() => router.push('/dashboard'), 1000)
  } catch (err) {
    console.error('Error accepting invite:', err)
    error.value = 'Failed to accept invitation. Please try again.'
  } finally {
    accepting.value = false
  }
}
</script>
