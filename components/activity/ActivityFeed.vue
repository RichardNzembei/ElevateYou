<template>
  <div class="card">
    <div class="px-4 py-2.5 border-b border-neutral-100">
      <h2 class="text-[12px] font-semibold text-neutral-900">Activity</h2>
    </div>

    <!-- Empty -->
    <div v-if="activities.length === 0" class="px-4 py-10 text-center">
      <div class="w-8 h-8 rounded-lg bg-neutral-100 mx-auto mb-2 flex items-center justify-center">
        <svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      </div>
      <p class="text-[12px] text-neutral-500 font-medium">No activity yet</p>
      <p class="text-[11px] text-neutral-400 mt-0.5">Activity will appear here as your team works.</p>
    </div>

    <!-- Timeline -->
    <div v-else class="px-4 py-2">
      <div v-for="(activity, i) in activities" :key="activity.id || i" class="flex items-start gap-2.5 py-2 border-b border-neutral-50 last:border-b-0">
        <!-- Icon -->
        <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-neutral-500" :class="actionBg(activity.action)">
          <svg v-if="activity.action === 'task_created'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          <svg v-else-if="activity.action === 'task_completed'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
          <svg v-else-if="activity.action === 'task_assigned'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          <svg v-else-if="activity.action === 'doc_created' || activity.action === 'doc_updated'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          <svg v-else-if="activity.action === 'member_joined' || activity.action === 'member_invited'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          <svg v-else-if="activity.action === 'project_created' || activity.action === 'project_updated'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
          <svg v-else-if="activity.action === 'comment_added'" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0 pt-0.5">
          <p class="text-[12px] text-neutral-700 leading-relaxed">
            <span class="font-semibold text-neutral-900">{{ displayName(activity) }}</span>
            {{ ' ' }}
            <span>{{ actionVerb(activity.action) }}</span>
            {{ ' ' }}
            <span v-if="activity.targetTitle" class="font-semibold text-neutral-900">{{ activity.targetTitle }}</span>
          </p>
          <p class="text-[10px] text-neutral-400 mt-0.5">{{ timeAgo(activity.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Timestamp } from 'firebase/firestore'

interface ActivityItem { id?: string; action: string; userName?: string; userEmail?: string; targetTitle?: string; details?: string; createdAt: any }
defineProps<{ activities: ActivityItem[] }>()

function actionBg(action: string): string {
  if (action === 'task_completed') return 'bg-emerald-50 text-emerald-600'
  if (action.includes('member')) return 'bg-blue-50 text-blue-600'
  if (action.includes('project')) return 'bg-purple-50 text-purple-600'
  if (action.includes('doc')) return 'bg-amber-50 text-amber-600'
  return 'bg-neutral-100 text-neutral-500'
}

function actionVerb(action: string): string {
  const verbs: Record<string, string> = {
    task_created: 'created task', task_updated: 'updated task', task_completed: 'completed task',
    task_assigned: 'assigned task', task_deleted: 'deleted task', doc_created: 'created document',
    doc_updated: 'updated document', member_invited: 'invited', member_joined: 'joined the workspace',
    project_created: 'created project', project_updated: 'updated project', comment_added: 'commented on',
  }
  return verbs[action] || action
}

function displayName(activity: ActivityItem): string {
  if (activity.userName) return activity.userName
  if (activity.userEmail) { const p = activity.userEmail.split('@'); return p[0].charAt(0).toUpperCase() + p[0].slice(1) }
  return 'Someone'
}

function timeAgo(date: Timestamp | Date | string | undefined): string {
  if (!date) return ''
  let d: Date
  if (typeof date === 'string') d = new Date(date)
  else if (date && typeof date === 'object' && 'toDate' in date) d = (date as Timestamp).toDate()
  else if (date instanceof Date) d = date
  else d = new Date(date)
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'just now'; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString()
}
</script>
