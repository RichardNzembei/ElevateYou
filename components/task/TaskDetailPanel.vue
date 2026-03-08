<template>
  <Teleport to="body">
    <Transition name="panel">
      <div v-if="modelValue" class="fixed inset-0 z-50">
        <div class="fixed inset-0 bg-black/20 backdrop-blur-sm" @click="close" />
        <div class="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-lg flex flex-col border-l border-neutral-200/60">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
            <div class="flex items-center gap-2.5">
              <!-- Status dropdown -->
              <div class="relative">
                <button @click="showStatusMenu = !showStatusMenu" class="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold hover:bg-neutral-50 transition-colors border border-neutral-200">
                  <span class="w-2 h-2 rounded-full" :class="statusColors[localStatus]" />
                  <span class="text-neutral-700">{{ statusLabels[localStatus] }}</span>
                  <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div v-if="showStatusMenu" class="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-0.5 z-10 min-w-[140px]">
                  <button v-for="s in statuses" :key="s" @click="setStatus(s)" class="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-neutral-50 transition-colors" :class="localStatus === s ? 'bg-neutral-50 font-semibold' : ''">
                    <span class="w-2 h-2 rounded-full" :class="statusColors[s]" />
                    <span class="text-neutral-700">{{ statusLabels[s] }}</span>
                  </button>
                </div>
              </div>
              <button @click="cyclePriority" class="badge cursor-pointer transition-colors" :class="priorityBadgeClass">{{ localPriority }}</button>
            </div>
            <button @click="close" class="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-md hover:bg-neutral-100 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Scrollable content -->
          <div class="flex-1 overflow-y-auto">
            <!-- Title -->
            <div class="px-5 pt-4 pb-1">
              <input v-model="localTitle" @blur="saveTitle" @keydown.enter="($event.target as HTMLInputElement).blur()" class="w-full text-[16px] font-bold text-neutral-900 placeholder:text-neutral-300 border-0 outline-none bg-transparent" placeholder="Task title..." />
            </div>

            <!-- Meta -->
            <div class="px-5 py-2 flex flex-wrap gap-2">
              <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-300 transition-colors">
                <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <input v-model="localDueDate" type="date" @change="saveDueDate" class="text-[11px] text-neutral-700 border-0 outline-none bg-transparent cursor-pointer" />
              </div>

              <div class="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-300 transition-colors">
                <div class="flex -space-x-1.5">
                  <div v-for="assignee in assignedMembers" :key="assignee.uid" class="w-6 h-6 rounded-full bg-neutral-200 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-neutral-600" :title="assignee.displayName || assignee.email">
                    {{ (assignee.displayName || assignee.email)?.[0]?.toUpperCase() || '?' }}
                  </div>
                </div>
                <button @click="showAssigneeMenu = !showAssigneeMenu" class="w-6 h-6 rounded-full border border-dashed border-neutral-300 flex items-center justify-center hover:border-neutral-400 hover:bg-neutral-50 transition-colors">
                  <svg class="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                </button>
                <div v-if="showAssigneeMenu" class="absolute top-full left-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg py-0.5 z-10 min-w-[200px] max-h-48 overflow-y-auto">
                  <button v-for="m in members" :key="m.uid" @click="toggleAssignee(m.uid)" class="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] hover:bg-neutral-50 transition-colors">
                    <div class="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-semibold text-neutral-600">{{ (m.displayName || m.email)?.[0]?.toUpperCase() || '?' }}</div>
                    <span class="text-neutral-700 flex-1 text-left truncate">{{ m.displayName || m.email }}</span>
                    <svg v-if="localAssigneeIds.includes(m.uid)" class="w-4 h-4 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-300 transition-colors">
                <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <input v-model.number="localEstimatedHours" type="number" min="0" step="0.5" @blur="saveEstimatedHours" placeholder="Hours" class="w-12 text-[11px] text-neutral-700 border-0 outline-none bg-transparent" />
              </div>

              <div v-if="project" class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-neutral-50 border border-neutral-100">
                <span class="w-2 h-2 rounded-full" :style="{ backgroundColor: project.color || '#a3a3a3' }" />
                <span class="text-[11px] text-neutral-600 font-medium">{{ project.name }}</span>
              </div>
            </div>

            <!-- Description -->
            <div class="px-5 py-2">
              <textarea v-model="localDescription" @blur="saveDescription" placeholder="Add a description..." rows="3" class="input-field resize-none text-[12px]" />
            </div>

            <div class="border-t border-neutral-100 mx-5" />

            <!-- Subtasks -->
            <div class="px-5 py-3">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-1.5">
                  <h3 class="text-[12px] font-semibold text-neutral-900">Subtasks</h3>
                  <span class="text-[11px] text-neutral-400 tabular-nums">{{ completedSubtasks }}/{{ totalSubtasks }}</span>
                </div>
              </div>

              <div v-if="totalSubtasks > 0" class="w-full h-1 bg-neutral-100 rounded-full mb-2 overflow-hidden">
                <div class="h-full bg-neutral-900 rounded-full transition-all duration-300" :style="{ width: subtaskProgress + '%' }" />
              </div>

              <div class="space-y-0.5">
                <div v-for="(subtask, index) in localSubtasks" :key="subtask.id" class="group flex items-center gap-2 py-1.5 px-1.5 -mx-1.5 rounded-md hover:bg-neutral-50 transition-colors">
                  <button @click="handleToggleSubtask(index)" class="flex-shrink-0">
                    <div class="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors" :class="subtask.completed ? 'bg-neutral-900 border-neutral-900' : 'border-neutral-300 hover:border-neutral-400'">
                      <svg v-if="subtask.completed" class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </button>
                  <span class="flex-1 text-[12px] transition-colors" :class="subtask.completed ? 'line-through text-neutral-400' : 'text-neutral-700'">{{ subtask.title }}</span>
                  <button @click="handleRemoveSubtask(subtask.id)" class="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-neutral-500 p-0.5 transition-all">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-1.5">
                <svg class="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                <input v-model="newSubtaskTitle" @keydown.enter="handleAddSubtask" placeholder="Add subtask..." class="flex-1 text-[12px] text-neutral-700 placeholder:text-neutral-300 border-0 outline-none bg-transparent py-1" />
              </div>
            </div>

            <div class="border-t border-neutral-100 mx-5" />

            <!-- Comments -->
            <div class="px-5 py-3">
              <h3 class="text-[12px] font-semibold text-neutral-900 mb-3">Activity</h3>

              <div class="flex items-start gap-2.5 mb-3">
                <div class="w-6 h-6 rounded-full bg-neutral-900 text-white flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5">{{ currentUserInitial }}</div>
                <div class="flex-1 flex gap-1.5">
                  <textarea v-model="newComment" placeholder="Write a comment..." rows="2" class="input-field resize-none text-[12px]" />
                  <button @click="handleAddComment" :disabled="!newComment.trim()" class="btn-primary px-2 py-1.5 self-end disabled:opacity-40">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  </button>
                </div>
              </div>

              <div class="space-y-3">
                <div v-for="comment in comments" :key="comment.id" class="flex items-start gap-2.5">
                  <div class="w-6 h-6 rounded-full bg-neutral-100 flex-shrink-0 flex items-center justify-center text-[9px] font-semibold text-neutral-500">{{ (comment.authorName || comment.authorEmail)?.[0]?.toUpperCase() || '?' }}</div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="text-[11px] font-semibold text-neutral-900">{{ comment.authorName || comment.authorEmail || 'Unknown' }}</span>
                      <span class="text-[10px] text-neutral-400">{{ timeAgo(comment.createdAt) }}</span>
                    </div>
                    <p class="text-[12px] text-neutral-600 whitespace-pre-wrap break-words leading-relaxed">{{ comment.content }}</p>
                  </div>
                </div>
              </div>

              <p v-if="comments.length === 0" class="text-[11px] text-neutral-400 text-center py-4">No comments yet</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-5 py-3 border-t border-neutral-100">
            <button @click="handleDelete" class="text-[11px] font-medium text-red-500 hover:text-red-700 transition-colors">Delete task</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTaskStore } from '@/stores/useTaskStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useFirebase } from '@/composables/firebase-client'
import type { Task, Comment as TaskComment, Subtask } from '@/types'
import type { Timestamp } from 'firebase/firestore'

const props = defineProps<{ modelValue: boolean; task: any; members: any[] }>()
const emit = defineEmits<{ 'update:modelValue': [value: boolean]; 'update-task': [data: Partial<Task>]; 'delete-task': [id: string] }>()

const taskStore = useTaskStore()
const projectStore = useProjectStore()

const localTitle = ref('')
const localDescription = ref('')
const localStatus = ref<Task['status']>('todo')
const localPriority = ref<Task['priority']>('medium')
const localDueDate = ref<string>('')
const localEstimatedHours = ref<number | undefined>(undefined)
const localAssigneeIds = ref<string[]>([])
const localSubtasks = ref<Subtask[]>([])

const showStatusMenu = ref(false)
const showAssigneeMenu = ref(false)
const newSubtaskTitle = ref('')
const newComment = ref('')
const comments = ref<TaskComment[]>([])

const statuses: Task['status'][] = ['backlog', 'todo', 'in-progress', 'review', 'done']
const statusLabels: Record<string, string> = { backlog: 'Backlog', todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done' }
const statusColors: Record<string, string> = { backlog: 'bg-neutral-300', todo: 'bg-blue-400', 'in-progress': 'bg-amber-500', review: 'bg-purple-500', done: 'bg-emerald-500' }

const priorities: Task['priority'][] = ['low', 'medium', 'high']
const priorityBadgeClass = computed(() => ({
  high: 'bg-red-50 text-red-700', medium: 'bg-amber-50 text-amber-700', low: 'bg-emerald-50 text-emerald-700'
}[localPriority.value] || 'bg-neutral-100 text-neutral-500'))

const project = computed(() => props.task?.projectId ? projectStore.projects.find(p => p.id === props.task.projectId) || null : null)
const assignedMembers = computed(() => props.members.filter(m => localAssigneeIds.value.includes(m.uid)))
const totalSubtasks = computed(() => localSubtasks.value.length)
const completedSubtasks = computed(() => localSubtasks.value.filter(s => s.completed).length)
const subtaskProgress = computed(() => totalSubtasks.value === 0 ? 0 : Math.round((completedSubtasks.value / totalSubtasks.value) * 100))
const currentUserInitial = computed(() => { try { const { auth } = useFirebase(); return auth.currentUser?.email?.[0]?.toUpperCase() || 'U' } catch { return 'U' } })

watch(() => props.task, (t) => {
  if (!t) return
  localTitle.value = t.title || ''; localDescription.value = t.description || ''; localStatus.value = t.status || 'todo'
  localPriority.value = t.priority || 'medium'; localDueDate.value = t.dueDate || ''; localEstimatedHours.value = t.estimatedHours
  localAssigneeIds.value = [...(t.assigneeIds || [])]; localSubtasks.value = [...(t.subtasks || [])]; loadComments()
}, { immediate: true })

watch(() => props.modelValue, (open) => { if (!open) { showStatusMenu.value = false; showAssigneeMenu.value = false } })

function close() { showStatusMenu.value = false; showAssigneeMenu.value = false; emit('update:modelValue', false) }
function emitUpdate(updates: Partial<Task>) { emit('update-task', { id: props.task?.id, ...updates }) }
function saveTitle() { if (localTitle.value !== props.task?.title) emitUpdate({ title: localTitle.value }) }
function saveDescription() { if (localDescription.value !== (props.task?.description || '')) emitUpdate({ description: localDescription.value }) }
function saveDueDate() { emitUpdate({ dueDate: localDueDate.value || null }) }
function saveEstimatedHours() { emitUpdate({ estimatedHours: localEstimatedHours.value }) }
function setStatus(s: Task['status']) { localStatus.value = s; showStatusMenu.value = false; emitUpdate({ status: s }) }
function cyclePriority() { const idx = priorities.indexOf(localPriority.value); const next = priorities[(idx + 1) % priorities.length]; localPriority.value = next; emitUpdate({ priority: next }) }
function toggleAssignee(uid: string) { const idx = localAssigneeIds.value.indexOf(uid); if (idx >= 0) localAssigneeIds.value.splice(idx, 1); else localAssigneeIds.value.push(uid); emitUpdate({ assigneeIds: [...localAssigneeIds.value] }) }

async function handleToggleSubtask(index: number) { if (!props.task?.id) return; await taskStore.toggleSubtask(props.task.id, index) }
async function handleAddSubtask() { const title = newSubtaskTitle.value.trim(); if (!title || !props.task?.id) return; newSubtaskTitle.value = ''; await taskStore.addSubtask(props.task.id, title) }
async function handleRemoveSubtask(subtaskId: string) { if (!props.task?.id) return; await taskStore.removeSubtask(props.task.id, subtaskId) }

async function loadComments() { if (!props.task?.id) { comments.value = []; return }; try { comments.value = await taskStore.getComments(props.task.id) } catch { comments.value = [] } }
async function handleAddComment() {
  const content = newComment.value.trim(); if (!content || !props.task?.id) return
  try { const { auth } = useFirebase(); const user = auth.currentUser; await taskStore.addComment(props.task.id, { authorId: user?.uid || '', authorName: user?.displayName || '', authorEmail: user?.email || '', content }); newComment.value = ''; await loadComments() } catch {}
}

function handleDelete() { if (!props.task?.id) return; emit('delete-task', props.task.id); close() }

function timeAgo(date: Timestamp | Date | string | undefined): string {
  if (!date) return ''
  let d: Date
  if (typeof date === 'string') d = new Date(date)
  else if ('toDate' in (date as any)) d = (date as Timestamp).toDate()
  else d = date as Date
  const diff = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diff < 60) return 'just now'; if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`; if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`
  return d.toLocaleDateString()
}
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
</style>
