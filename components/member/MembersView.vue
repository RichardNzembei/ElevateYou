<template>
  <div class="space-y-3">
    <!-- Header -->
    <div class="card px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
      <div>
        <h2 class="text-[14px] font-bold text-neutral-900">{{ projectName ? `${projectName} — Team` : 'Team Members' }}</h2>
        <p class="text-[11px] text-neutral-500 mt-0.5">{{ members.length }} member{{ members.length !== 1 ? 's' : '' }} on this project{{ pendingInvites?.length ? ` · ${pendingInvites.length} pending` : '' }}</p>
      </div>
      <button v-if="canManageMembers" @click="$emit('invite')" class="btn-primary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
        Invite Member
      </button>
    </div>

    <!-- Role Guide -->
    <div class="card overflow-hidden">
      <button @click="showRoleGuide = !showRoleGuide" class="w-full px-4 py-2.5 flex items-center justify-between hover:bg-neutral-50 transition-colors">
        <span class="text-[11px] font-semibold text-neutral-700">Role Permissions Guide</span>
        <svg :class="showRoleGuide ? 'rotate-180' : ''" class="w-4 h-4 text-neutral-400 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
      </button>
      <Transition name="collapse">
        <div v-if="showRoleGuide" class="px-4 pb-3 border-t border-neutral-100">
          <div class="overflow-x-auto mt-2">
            <table class="w-full text-[11px]">
              <thead>
                <tr class="border-b border-neutral-200">
                  <th class="text-left py-2 pr-4 text-neutral-500 font-medium">Permission</th>
                  <th v-for="role in roleColumns" :key="role" class="text-center py-2 px-3 text-neutral-500 font-medium capitalize">{{ role }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="perm in permissionRows" :key="perm.key" class="border-b border-neutral-50">
                  <td class="py-2.5 pr-4 text-neutral-700">{{ perm.label }}</td>
                  <td v-for="role in roleColumns" :key="role" class="text-center py-2.5 px-3">
                    <svg v-if="perm.roles.includes(role)" class="w-4 h-4 text-neutral-900 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" /></svg>
                    <svg v-else class="w-4 h-4 text-neutral-200 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Pending Invites -->
    <div v-if="pendingInvites.length > 0" class="card">
      <div class="px-4 py-2.5 border-b border-neutral-100 flex items-center gap-2">
        <div class="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
        <h3 class="text-[12px] font-semibold text-neutral-900">Pending Invites</h3>
        <span class="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">{{ pendingInvites.length }}</span>
      </div>
      <div>
        <div v-for="invite in pendingInvites" :key="invite.id" class="px-4 py-2 flex items-center gap-2.5 group border-b border-neutral-50 last:border-b-0">
          <div class="w-7 h-7 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-semibold flex-shrink-0">{{ invite.email[0].toUpperCase() }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-[12px] text-neutral-700 truncate">{{ invite.email }}</p>
            <p class="text-[10px] text-neutral-400">Invited {{ timeAgo(invite.invitedAt) }} · {{ invite.role }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button @click="$emit('resend-invite', invite)" class="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors opacity-0 group-hover:opacity-100">Resend</button>
            <button @click="$emit('cancel-invite', invite.id)" class="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Members -->
    <div v-if="members.length === 0" class="card py-10 text-center">
      <div class="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      </div>
      <p class="text-[12px] text-neutral-500">No team members yet. Invite your first teammate!</p>
    </div>

    <div v-else class="card overflow-hidden">
      <div class="px-4 py-2.5 border-b border-neutral-100">
        <h3 class="text-[12px] font-semibold text-neutral-900">Active Members</h3>
      </div>
      <div>
        <div v-for="member in members" :key="member.uid" class="px-4 py-2 flex items-center gap-2.5 hover:bg-neutral-50/60 transition-colors group border-b border-neutral-50 last:border-b-0">
          <div class="relative flex-shrink-0">
            <div class="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[11px] font-semibold">
              {{ member.displayName?.[0]?.toUpperCase() || member.email[0].toUpperCase() }}
            </div>
            <div v-if="member.isOnline" class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-1.5">
              <p class="font-semibold text-[12px] text-neutral-900 truncate">{{ member.displayName || member.email }}</p>
              <span v-if="isCurrentUser(member.uid)" class="text-[10px] text-neutral-400">(you)</span>
            </div>
            <p class="text-[11px] text-neutral-400 truncate">{{ member.email }}</p>
          </div>

          <div class="flex items-center gap-2">
            <div class="hidden sm:flex items-center gap-1 text-[11px] text-neutral-500">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              {{ getTaskCount(member.uid) }}
            </div>
            <span v-if="member.isOnline" class="hidden sm:inline text-[10px] text-emerald-600 font-medium">Online</span>
            <span :class="roleClass(member.role)" class="badge">{{ member.role }}</span>

            <div v-if="canManageMembers && member.role !== 'owner' && !isCurrentUser(member.uid)" class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <select :value="member.role" @click.stop @change="$emit('update-role', member.uid, ($event.target as HTMLSelectElement).value)" class="text-[11px] border border-neutral-200 rounded-md px-1.5 py-0.5 bg-white cursor-pointer">
                <option value="admin">Admin</option>
                <option value="member">Member</option>
                <option value="viewer">Viewer</option>
              </select>
              <button @click.stop="$emit('remove-member', member.uid)" class="p-1.5 hover:bg-red-50 rounded-lg text-neutral-400 hover:text-red-500 transition-colors" title="Remove member">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12h-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/useTaskStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useFirebase } from '@/composables/firebase-client'

const taskStore = useTaskStore()
const projectStore = useProjectStore()
const { auth } = useFirebase()

defineProps<{ members: any[]; pendingInvites?: any[]; canManageMembers?: boolean; projectName?: string }>()
defineEmits(['invite', 'update-role', 'remove-member', 'cancel-invite', 'resend-invite'])

const showRoleGuide = ref(false)
const roleColumns = ['owner', 'admin', 'member', 'viewer']
const permissionRows = [
  { key: 'workspace', label: 'Manage workspace settings', roles: ['owner'] },
  { key: 'members', label: 'Invite & manage members', roles: ['owner', 'admin'] },
  { key: 'projects', label: 'Create & edit projects', roles: ['owner', 'admin'] },
  { key: 'delete_projects', label: 'Delete projects', roles: ['owner', 'admin'] },
  { key: 'tasks', label: 'Create & manage tasks', roles: ['owner', 'admin', 'member'] },
  { key: 'docs', label: 'Create & edit documents', roles: ['owner', 'admin', 'member'] },
  { key: 'comments', label: 'Add comments', roles: ['owner', 'admin', 'member'] },
  { key: 'view', label: 'View projects & tasks', roles: ['owner', 'admin', 'member', 'viewer'] },
]

const isCurrentUser = (uid: string) => auth.currentUser?.uid === uid
const getTaskCount = (userId: string) => {
  if (!projectStore.selectedProject) return 0
  return taskStore.tasks.filter(t => t.projectId === projectStore.selectedProject!.id && t.assigneeIds?.includes(userId)).length
}

const roleClass = (role: string) => ({
  'bg-neutral-900 text-white': role === 'owner',
  'bg-neutral-200 text-neutral-700': role === 'admin',
  'bg-neutral-100 text-neutral-600': role === 'member',
  'bg-neutral-50 text-neutral-500 border border-neutral-200': role === 'viewer',
}[role] || 'bg-neutral-100 text-neutral-600')

const timeAgo = (date: any) => {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'just now'; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.collapse-enter-active, .collapse-leave-active { transition: all 0.2s ease; overflow: hidden; }
.collapse-enter-from, .collapse-leave-to { max-height: 0; opacity: 0; }
.collapse-enter-to, .collapse-leave-from { max-height: 500px; opacity: 1; }
</style>
