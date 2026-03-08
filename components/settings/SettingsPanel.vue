<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="modelValue" class="fixed inset-0 z-50">
        <div class="fixed inset-0 bg-black/20 backdrop-blur-sm" @click="close" />
        <div class="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-lg flex flex-col border-l border-neutral-200/60">
          <div class="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <h2 class="text-[13px] font-bold text-neutral-900">Settings</h2>
            <button @click="close" class="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-md hover:bg-neutral-100 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <!-- Workspace Settings -->
            <div v-if="canEditWorkspace" class="px-5 py-4 border-b border-neutral-100">
              <h3 class="text-[12px] font-semibold text-neutral-900 mb-3">Workspace</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Name</label>
                  <input v-model="workspaceName" type="text" class="input-field" placeholder="My Workspace" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Description</label>
                  <textarea v-model="workspaceDescription" rows="3" class="input-field resize-none" placeholder="What is this workspace for?" />
                </div>
                <button @click="saveWorkspace" :disabled="!workspaceDirty" class="btn-primary disabled:opacity-40">Save changes</button>
              </div>
            </div>

            <!-- Notifications -->
            <div class="px-5 py-4 border-b border-neutral-100">
              <h3 class="text-[12px] font-semibold text-neutral-900 mb-3">Notifications</h3>
              <div class="space-y-4">
                <div v-for="pref in notificationPrefs" :key="pref.key" class="flex items-center justify-between py-1">
                  <span class="text-[11px] text-neutral-700">{{ pref.label }}</span>
                  <button @click="pref.value = !pref.value" class="relative w-12 h-7 rounded-full transition-colors duration-200 flex-shrink-0" :class="pref.value ? 'bg-neutral-900' : 'bg-neutral-200'">
                    <div class="absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200" :class="pref.value ? 'translate-x-[22px]' : 'translate-x-1'" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Account -->
            <div class="px-5 py-4 border-b border-neutral-100">
              <h3 class="text-[12px] font-semibold text-neutral-900 mb-3">Account</h3>
              <div class="space-y-3">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Display Name</label>
                  <input v-model="displayName" type="text" class="input-field" placeholder="Your name" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Email</label>
                  <input :value="userEmail" type="email" class="input-field bg-neutral-50 text-neutral-500 cursor-not-allowed" readonly />
                </div>
                <div class="flex items-center gap-3">
                  <button @click="saveProfile" :disabled="!profileDirty || savingProfile" class="btn-primary disabled:opacity-40 flex items-center gap-2">
                    <svg v-if="savingProfile" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    {{ savingProfile ? 'Saving...' : 'Save profile' }}
                  </button>
                  <Transition name="fade">
                    <span v-if="profileSaved" class="text-[11px] text-emerald-600 font-medium">Saved!</span>
                  </Transition>
                  <Transition name="fade">
                    <span v-if="profileError" class="text-[11px] text-red-600 font-medium">{{ profileError }}</span>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Password -->
            <div class="px-6 py-6 border-b border-neutral-100">
              <h3 class="text-[14px] font-semibold text-neutral-900 mb-2">Password</h3>
              <p class="text-[11px] text-neutral-500 mb-3">Change your password or reset it via email.</p>
              <div class="space-y-3">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Current Password</label>
                  <input v-model="currentPassword" type="password" class="input-field" placeholder="Enter current password" />
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">New Password</label>
                  <input v-model="newPassword" type="password" class="input-field" placeholder="At least 8 characters" />
                  <div v-if="newPassword" class="mt-2 flex items-center gap-2 text-[14px]">
                    <svg class="w-4 h-4" :class="newPassword.length >= 8 ? 'text-emerald-500' : 'text-neutral-300'" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                    <span :class="newPassword.length >= 8 ? 'text-emerald-600' : 'text-neutral-400'">8+ characters</span>
                  </div>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Confirm New Password</label>
                  <input v-model="confirmPassword" type="password" class="input-field" placeholder="Confirm new password" />
                  <div v-if="confirmPassword && confirmPassword !== newPassword" class="mt-2 text-[14px] text-red-500">Passwords don't match</div>
                </div>
                <div class="flex items-center gap-3">
                  <button @click="changePassword" :disabled="!canChangePassword || changingPassword" class="btn-primary disabled:opacity-40 flex items-center gap-2">
                    <svg v-if="changingPassword" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path></svg>
                    {{ changingPassword ? 'Updating...' : 'Update password' }}
                  </button>
                  <Transition name="fade">
                    <span v-if="passwordSaved" class="text-[11px] text-emerald-600 font-medium">Password updated!</span>
                  </Transition>
                  <Transition name="fade">
                    <span v-if="passwordError" class="text-[11px] text-red-600 font-medium">{{ passwordError }}</span>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div v-if="isOwner" class="px-5 py-4">
              <div class="rounded-lg border border-red-200 bg-red-50/50 p-4">
                <h3 class="text-[12px] font-semibold text-red-700 mb-1.5">Danger Zone</h3>
                <p class="text-[11px] text-neutral-500 mb-3 leading-relaxed">Deleting this workspace is permanent. All projects, tasks, and documents will be lost.</p>
                <button @click="confirmDelete" class="btn-danger">Delete Workspace</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { useFirebase } from '@/composables/firebase-client'

const props = defineProps<{ modelValue: boolean; workspace: any; userRole: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'update-workspace': [data: { name: string; description: string }]; 'delete-workspace': [] }>()

const workspaceName = ref('')
const workspaceDescription = ref('')
const displayName = ref('')
const userEmail = ref('')
const originalDisplayName = ref('')
const savingProfile = ref(false)
const profileSaved = ref(false)
const profileError = ref('')

// Password change
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const changingPassword = ref(false)
const passwordSaved = ref(false)
const passwordError = ref('')

const notificationPrefs = reactive([
  { key: 'email', label: 'Email notifications', value: true },
  { key: 'assignments', label: 'Task assignments', value: true },
  { key: 'dueDate', label: 'Due date reminders', value: true },
  { key: 'comments', label: 'Comments', value: true },
])

const canEditWorkspace = computed(() => props.userRole === 'owner' || props.userRole === 'admin')
const isOwner = computed(() => props.userRole === 'owner')
const workspaceDirty = computed(() => props.workspace && (workspaceName.value !== (props.workspace.name || '') || workspaceDescription.value !== (props.workspace.description || '')))
const profileDirty = computed(() => displayName.value !== originalDisplayName.value)
const canChangePassword = computed(() => currentPassword.value && newPassword.value.length >= 8 && newPassword.value === confirmPassword.value)

watch(() => [props.modelValue, props.workspace], () => {
  if (!props.modelValue) return
  if (props.workspace) { workspaceName.value = props.workspace.name || ''; workspaceDescription.value = props.workspace.description || '' }
  try {
    const { auth } = useFirebase()
    const user = auth.currentUser
    displayName.value = user?.displayName || ''
    originalDisplayName.value = user?.displayName || ''
    userEmail.value = user?.email || ''
  } catch {
    displayName.value = ''; originalDisplayName.value = ''; userEmail.value = ''
  }
}, { immediate: true })

function close() { emit('update:modelValue', false) }
function saveWorkspace() { emit('update-workspace', { name: workspaceName.value.trim(), description: workspaceDescription.value.trim() }) }

async function saveProfile() {
  savingProfile.value = true
  profileSaved.value = false
  profileError.value = ''
  try {
    const { auth, firestore } = useFirebase()
    const user = auth.currentUser
    if (!user) throw new Error('Not authenticated')

    const { updateProfile } = await import('firebase/auth')
    const { doc, updateDoc } = await import('firebase/firestore')

    // Update Firebase Auth profile
    await updateProfile(user, { displayName: displayName.value.trim() })

    // Update Firestore user document
    await updateDoc(doc(firestore, 'users', user.uid), {
      displayName: displayName.value.trim(),
      updatedAt: new Date()
    })

    originalDisplayName.value = displayName.value.trim()
    profileSaved.value = true
    setTimeout(() => { profileSaved.value = false }, 3000)
  } catch (err: any) {
    profileError.value = err.message || 'Failed to save profile'
    setTimeout(() => { profileError.value = '' }, 4000)
  } finally {
    savingProfile.value = false
  }
}

async function changePassword() {
  if (!canChangePassword.value) return
  changingPassword.value = true
  passwordSaved.value = false
  passwordError.value = ''
  try {
    const { auth } = useFirebase()
    const user = auth.currentUser
    if (!user || !user.email) throw new Error('Not authenticated')

    const { EmailAuthProvider, reauthenticateWithCredential, updatePassword } = await import('firebase/auth')

    // Re-authenticate first
    const credential = EmailAuthProvider.credential(user.email, currentPassword.value)
    await reauthenticateWithCredential(user, credential)

    // Update password
    await updatePassword(user, newPassword.value)

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordSaved.value = true
    setTimeout(() => { passwordSaved.value = false }, 3000)
  } catch (err: any) {
    if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
      passwordError.value = 'Current password is incorrect'
    } else if (err.code === 'auth/weak-password') {
      passwordError.value = 'New password is too weak'
    } else {
      passwordError.value = err.message || 'Failed to update password'
    }
    setTimeout(() => { passwordError.value = '' }, 4000)
  } finally {
    changingPassword.value = false
  }
}

function confirmDelete() { if (window.confirm('Are you sure you want to delete this workspace? This action cannot be undone.')) { emit('delete-workspace'); close() } }
</script>

<style scoped>
.panel-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.panel-enter-active > div:last-child { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.panel-leave-active { transition: all 0.2s ease; }
.panel-leave-active > div:last-child { transition: transform 0.2s ease; }
.panel-enter-from { opacity: 0; }
.panel-enter-from > div:last-child { transform: translateX(100%); }
.panel-leave-to { opacity: 0; }
.panel-leave-to > div:last-child { transform: translateX(100%); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
