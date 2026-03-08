<template>
  <Modal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Invite Team Members">
    <div class="space-y-5">
      <div>
        <label class="block text-[13px] font-medium text-neutral-700 mb-1.5">Email Address</label>
        <div class="flex gap-2">
          <input v-model="email" type="email" placeholder="colleague@company.com" class="input-field flex-1" @keyup.enter="addToList" />
          <button @click="addToList" class="btn-secondary px-4 flex-shrink-0">Add</button>
        </div>
      </div>

      <div v-if="emailList.length > 0" class="space-y-2">
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

      <div v-if="emailList.length === 0">
        <label class="block text-[13px] font-medium text-neutral-700 mb-1.5">Role</label>
        <select v-model="defaultRole" class="input-field">
          <option value="member">Member — can manage tasks and docs</option>
          <option value="admin">Admin — can manage members and projects</option>
          <option value="viewer">Viewer — read-only access</option>
        </select>
      </div>

      <div class="bg-neutral-50 border border-neutral-200/60 rounded-lg p-3.5">
        <div class="flex gap-2.5">
          <svg class="w-4 h-4 text-neutral-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div class="text-[13px] text-neutral-500 space-y-1 leading-relaxed">
            <p>If the user has an account, they'll be added instantly.</p>
            <p>If not, a pending invite will be saved. They'll auto-join when they register.</p>
          </div>
        </div>
      </div>

      <div v-if="pendingInvites.length > 0">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[13px] font-medium text-neutral-500">Pending Invites</span>
          <span class="text-[12px] text-neutral-400">{{ pendingInvites.length }} waiting</span>
        </div>
        <div class="space-y-1">
          <div v-for="invite in pendingInvites" :key="invite.id" class="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
            <div class="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0"></div>
            <span class="flex-1 text-[13px] text-neutral-700 truncate">{{ invite.email }}</span>
            <span class="badge text-[11px] bg-amber-100 text-amber-700">Pending</span>
            <button @click="$emit('cancel-invite', invite.id)" class="text-neutral-400 hover:text-red-500 transition-colors p-0.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-1">
        <button @click="submit" :disabled="sending || (emailList.length === 0 && !email.trim())" class="flex-1 btn-primary py-2.5 disabled:opacity-50 flex items-center justify-center gap-2">
          <svg v-if="sending" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" /><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
          {{ sending ? 'Sending...' : emailList.length > 1 ? `Invite ${emailList.length} Members` : 'Send Invite' }}
        </button>
        <button @click="$emit('update:modelValue', false)" class="flex-1 btn-secondary py-2.5">Cancel</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'

defineProps<{ modelValue: boolean; pendingInvites?: any[] }>()
const emit = defineEmits(['update:modelValue', 'invite', 'cancel-invite'])

const email = ref('')
const defaultRole = ref('member')
const sending = ref(false)
const emailList = ref<{ email: string; role: string }[]>([])

const addToList = () => {
  const trimmed = email.value.trim().toLowerCase()
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) || emailList.value.some(e => e.email === trimmed)) return
  emailList.value.push({ email: trimmed, role: defaultRole.value })
  email.value = ''
}

const submit = async () => {
  if (emailList.value.length === 0 && email.value.trim()) {
    emit('invite', [{ email: email.value.trim().toLowerCase(), role: defaultRole.value }])
  } else {
    emit('invite', [...emailList.value])
  }
  email.value = ''; emailList.value = []
}
</script>
