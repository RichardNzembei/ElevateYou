<template>
  <div class="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
    <div
        v-for="col in columns"
        :key="col.value"
        class="flex-shrink-0 w-[240px] bg-neutral-50/80 rounded-lg border border-neutral-200/60 snap-start"
    >
      <!-- Column Header -->
      <div class="flex items-center justify-between px-3 py-2 border-b border-neutral-200/60">
        <div class="flex items-center gap-1.5">
          <div class="w-2 h-2 rounded-full" :class="col.dot"></div>
          <h3 class="text-[11px] font-semibold text-neutral-700">{{ col.label }}</h3>
          <span class="text-[10px] bg-neutral-200/70 text-neutral-600 px-1 py-0.5 rounded font-medium tabular-nums">
            {{ tasksByStatus(col.value).length }}
          </span>
        </div>
        <button
            @click="$emit('quick-add', col.value)"
            class="p-0.5 rounded hover:bg-neutral-200/60 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>

      <!-- Drop Zone -->
      <div
          @drop="onDrop($event, col.value)"
          @dragover.prevent
          @dragenter.prevent
          class="p-2 min-h-[180px] space-y-1.5"
      >
        <div
            v-for="task in tasksByStatus(col.value)"
            :key="task.id"
            draggable="true"
            @dragstart="startDrag($event, task)"
            @click="emit('edit-task', task)"
            class="bg-white rounded-md border border-neutral-200/80 p-2.5 cursor-pointer hover:border-neutral-300 transition-all duration-150 group"
        >
          <!-- Priority + title -->
          <div class="flex items-start gap-1.5 mb-0.5">
            <span :class="['w-1.5 h-1.5 rounded-full mt-1 shrink-0', priorityDot(task.priority)]"></span>
            <h4 class="font-semibold text-[12px] text-neutral-900 line-clamp-2 leading-snug">{{ task.title }}</h4>
          </div>

          <p v-if="task.description" class="text-[11px] text-neutral-400 line-clamp-2 mb-2 ml-3">{{ task.description }}</p>

          <!-- Subtask progress -->
          <div v-if="task.subtasks?.length" class="mb-2 ml-3">
            <div class="flex items-center gap-1.5">
              <div class="flex-1 h-1 bg-neutral-100 rounded-full overflow-hidden">
                <div class="h-full bg-emerald-500 rounded-full transition-all" :style="{ width: subtaskProgress(task) + '%' }"></div>
              </div>
              <span class="text-[10px] text-neutral-400 tabular-nums">{{ completedSubtasks(task) }}/{{ task.subtasks.length }}</span>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between ml-3">
            <div class="flex items-center gap-1.5">
              <div v-if="task.assigneeIds?.length" class="flex -space-x-1">
                <div
                    v-for="id in task.assigneeIds.slice(0, 2)"
                    :key="id"
                    class="w-4 h-4 rounded-full bg-neutral-200 text-neutral-600 text-[8px] flex items-center justify-center border border-white font-semibold"
                >{{ id[0].toUpperCase() }}</div>
                <div v-if="task.assigneeIds.length > 2" class="w-4 h-4 rounded-full bg-neutral-100 text-neutral-500 text-[8px] flex items-center justify-center border border-white font-medium">+{{ task.assigneeIds.length - 2 }}</div>
              </div>
              <div v-if="task.commentsCount" class="flex items-center gap-0.5 text-neutral-400">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                <span class="text-[10px]">{{ task.commentsCount }}</span>
              </div>
            </div>
            <span v-if="task.dueDate" :class="['text-[10px] tabular-nums', isOverdue(task) ? 'text-red-600 font-semibold' : 'text-neutral-400']">
              {{ formatDate(task.dueDate) }}
            </span>
          </div>
        </div>

        <!-- Empty -->
        <div v-if="tasksByStatus(col.value).length === 0" class="flex items-center justify-center h-16 text-neutral-300 text-[11px]">
          No tasks
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/useTaskStore'
import { useProjectStore } from '@/stores/useProjectStore'

const taskStore = useTaskStore()
const projectStore = useProjectStore()
const emit = defineEmits(['edit-task', 'quick-add'])

const columns = [
  { value: 'backlog', label: 'Backlog', dot: 'bg-neutral-300' },
  { value: 'todo', label: 'To Do', dot: 'bg-blue-400' },
  { value: 'in-progress', label: 'In Progress', dot: 'bg-amber-500' },
  { value: 'review', label: 'Review', dot: 'bg-purple-500' },
  { value: 'done', label: 'Done', dot: 'bg-emerald-500' }
]

const tasksByStatus = (status: string) => {
  if (!projectStore.selectedProject) return []
  return taskStore.filteredTasks.filter(t => t.projectId === projectStore.selectedProject!.id && t.status === status)
}

let draggedTask: any = null
const startDrag = (evt: DragEvent, task: any) => { draggedTask = task; evt.dataTransfer?.setData('taskId', task.id) }
const onDrop = async (evt: DragEvent, newStatus: string) => {
  const taskId = evt.dataTransfer?.getData('taskId')
  if (taskId && draggedTask?.status !== newStatus) await taskStore.update(taskId, { status: newStatus as any })
}

const isOverdue = (t: any) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
const formatDate = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const completedSubtasks = (t: any) => t.subtasks?.filter((s: any) => s.completed).length || 0
const subtaskProgress = (t: any) => t.subtasks?.length ? (completedSubtasks(t) / t.subtasks.length) * 100 : 0

const priorityDot = (p: string) => ({
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-emerald-500',
}[p] || 'bg-neutral-300')
</script>
