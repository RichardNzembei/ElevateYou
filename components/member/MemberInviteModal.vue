<template>
  <Modal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" :title="projectName ? `Invite to ${projectName}` : 'Invite Team Members'">
    <div class="space-y-5">
      <!-- Invite link results -->
      <div v-if="inviteLinks.length > 0" class="space-y-2">
        <div class="flex items-center gap-2 mb-1">
          <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          <span class="text-[12px] font-semibold text-neutral-900">Invitations sent — share these links</span>
        </div>
        <div v-for="link in inviteLinks" :key="link.email" class="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
          <p class="text-[11px] text-neutral-500 mb-1.5">{{ link.email }}</p>
          <div class="flex gap-2">
            <input :value="link.url" readonly class="input-field flex-1 !text-[11px] !py-1.5 bg-white" @click="($event.target as HTMLInputElement).select()" />
            <button @click="copyLink(link.url)" class="btn-secondary px-3 py-1.5 text-[11px] flex-shrink-0 flex items-center gap-1">
              <svg v-if="copiedUrl !== link.url" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <svg v-else class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
              {{ copiedUrl === link.url ? 'Copied' : 'Copy' }}
            </button>
            <a :href="mailtoLink(link.email, link.url)" class="btn-secondary px-3 py-1.5 text-[11px] flex-shrink-0 flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Email
            </a>
          </div>
        </div>
        <button @click="inviteLinks = []; email = ''; emailList = []" class="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors">Invite more</button>
      </div>

      <!-- Email input -->
      <div v-if="inviteLinks.length === 0">
        <div>
          <label class="block text-[13px] font-medium text-neutral-700 mb-1.5">Email Address</label>
          <div class="flex gap-2">
            <input v-model="email" type="email" placeholder="colleague@company.com" class="input-field flex-1" @keyup.enter="addToList" />
            <button @click="addToList" class="btn-secondary px-4 flex-shrink-0">Add</button>
          </div>
        </div>

        <div v-if="emailList.length > 0" class="space-y-2 mt-3">
          <div v-for="(item, i) in emailList" :key="i" class="flex items-center gap-2.5 bg-neutral-50 rounded-lg px-3 py-2.5">
            <div class="w-7 h-7 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[11px] font-semibold flex-shrink-0">{{ item.email[0].toUpperCase() }}</div>
            <span class="flex-1 text-[14px] text-neutral-700 truncate">{{ item.email }}</span>
            <select v-model="item.role" class="text-[13px] border border-neutral-200 rounded-lg px-2 py-1 bg-white cursor-pointer">
              <option value="member">Member</option>
              <option value="admin">Admin</option>
              <option value="viewer">Viewer</option>
            </select>
            <button @click="emailList.splice(i, 1)" class="text-neutral-400 hover:text-red-500 transition-colors p-0.5">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        <div v-if="emailList.length === 0" class="mt-3">
          <label class="block text-[13px] font-medium text-neutral-700 mb-1.5">Role</label>
          <select v-model="defaultRole" class="input-field">
            <option value="member">Member — can manage tasks and docs</option>
            <option value="admin">Admin — can manage members and projects</option>
            <option value="viewer">Viewer — read-only access</option>
          </select>
        </div>

        <div class="bg-neutral-50 border border-neutral-200/60 rounded-lg p-3.5 mt-4">
          <div class="flex gap-2.5">
            <svg class="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div class="text-[13px] text-neutral-500 space-y-1 leading-relaxed">
              <p>An invite link will be generated for each member to join.</p>
              <p>If they already have an account, they'll be added instantly.</p>
            </div>
          </div>
        </div>

        <div v-if="pendingInvites && pendingInvites.length > 0" class="mt-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-[13px] font-medium text-neutral-500">Pending Invites</span>
            <span class="text-[12px] text-neutral-400">{{ pendingInvites.length }} waiting</span>
          </div>
          <div class="space-y-1">
            <div v-for="invite in pendingInvites" :key="invite.id" class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <div class="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
              <span class="flex-1 text-[13px] text-neutral-700 truncate">{{ invite.email }}</span>
              <button @click="copyInviteLink(invite.id)" class="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                {{ copiedUrl === getInviteUrl(invite.id) ? 'Copied!' : 'Copy link' }}
              </button>
              <button @click="$emit('cancel-invite', invite.id)" class="text-neutral-400 hover:text-red-500 transition-colors p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-3">
          <button @click="submit" :disabled="sending || (emailList.length === 0 && !email.trim())" class="flex-1 btn-primary py-2.5 disabled:opacity-50 flex items-center justify-center gap-2">
            <svg v-if="sending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            {{ sending ? 'Sending...' : emailList.length > 1 ? `Invite ${emailList.length} Members` : 'Send Invite' }}
          </button>
          <button @click="$emit('update:modelValue', false)" class="flex-1 btn-secondary py-2.5">Cancel</button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'

const props = defineProps<{ modelValue: boolean; pendingInvites?: any[]; projectName?: string }>()
const emit = defineEmits(['update:modelValue', 'invite', 'cancel-invite'])

const email = ref('')
const defaultRole = ref('member')
const sending = ref(false)
const emailList = ref<{ email: string; role: string }[]>([])
const inviteLinks = ref<{ email: string; url: string }[]>([])
const copiedUrl = ref('')

const getInviteUrl = (inviteId: string) => {
  return `${window.location.origin}/invite/${inviteId}`
}

const copyLink = async (url: string) => {
  await navigator.clipboard.writeText(url)
  copiedUrl.value = url
  setTimeout(() => { copiedUrl.value = '' }, 2000)
}

const copyInviteLink = async (inviteId: string) => {
  const url = getInviteUrl(inviteId)
  await copyLink(url)
}

const mailtoLink = (toEmail: string, inviteUrl: string) => {
  const subject = encodeURIComponent(`You're invited to ${props.projectName || 'a project'} on ElevateYou`)
  const body = encodeURIComponent(`Hi,\n\nYou've been invited to collaborate on ElevateYou.\n\nClick here to join: ${inviteUrl}\n\nSee you there!`)
  return `mailto:${toEmail}?subject=${subject}&body=${body}`
}

const addToList = () => {
  const trimmed = email.value.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || emailList.value.some(e => e.email === trimmed)) return
  emailList.value.push({ email: trimmed, role: defaultRole.value })
  email.value = ''
}

const submit = async () => {
  const list = emailList.value.length > 0
    ? [...emailList.value]
    : email.value.trim()
      ? [{ email: email.value.trim().toLowerCase(), role: defaultRole.value }]
      : []

  if (list.length === 0) return

  sending.value = true
  emit('invite', list)
}

// Called by parent after invites are processed — receives invite IDs
const setInviteResults = (results: { email: string; inviteId: string }[]) => {
  inviteLinks.value = results.map(r => ({
    email: r.email,
    url: getInviteUrl(r.inviteId)
  }))
  sending.value = false
}

defineExpose({ setInviteResults })
</script>
