<template>
  <div>
    <!-- Filters -->
    <div class="card px-3.5 py-2.5 mb-3 flex flex-wrap items-center gap-2">
      <div class="flex-1 min-w-[180px] flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-md px-2.5 py-1.5">
        <svg class="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input v-model="taskStore.searchQuery" type="text" placeholder="Search tasks..." class="bg-transparent outline-none flex-1 text-[11px] placeholder:text-neutral-400" />
      </div>
      <select v-model="taskStore.filterStatus" class="text-[11px] border border-neutral-200 rounded-md px-2.5 py-1.5 bg-white text-neutral-700 cursor-pointer">
        <option value="all">All Status</option>
        <option value="backlog">Backlog</option>
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="review">Review</option>
        <option value="done">Done</option>
      </select>
      <select v-model="taskStore.filterPriority" class="text-[11px] border border-neutral-200 rounded-md px-2.5 py-1.5 bg-white text-neutral-700 cursor-pointer">
        <option value="all">All Priority</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </div>

    <!-- Empty State -->
    <div v-if="tasks.length === 0" class="card py-12 text-center">
      <div class="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-3">
        <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
      </div>
      <p class="text-[11px] text-neutral-500">No tasks found</p>
    </div>

    <!-- Task List -->
    <div v-else class="space-y-1">
      <!-- Table Header (desktop) -->
      <div class="hidden sm:grid grid-cols-12 gap-2 px-4 py-2 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
        <div class="col-span-5">Task</div>
        <div class="col-span-2">Status</div>
        <div class="col-span-1">Priority</div>
        <div class="col-span-2">Due Date</div>
        <div class="col-span-1">Assignee</div>
        <div class="col-span-1"></div>
      </div>

      <!-- Task rows -->
      <div
          v-for="task in tasks"
          :key="task.id"
          class="card px-4 py-2.5 hover:bg-neutral-50/60 transition-all duration-150 cursor-pointer group border-l-[3px]"
          :class="borderClass(task)"
          @click="$emit('edit', task)"
      >
        <!-- Mobile layout -->
        <div class="sm:hidden">
          <div class="flex items-start justify-between gap-2 mb-2">
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-neutral-900 text-[12px] truncate">{{ task.title }}</h3>
              <p v-if="task.description" class="text-neutral-400 text-[11px] line-clamp-1 mt-0.5">{{ task.description }}</p>
            </div>
            <button @click.stop="$emit('delete', task.id)" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-md text-red-400 hover:text-red-600 transition-all flex-shrink-0">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <select :value="task.status" @click.stop @change="$emit('update-status', task.id, ($event.target as HTMLSelectElement).value)" class="text-[11px] border border-neutral-200 rounded-md px-2 py-1 bg-white text-neutral-700">
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <span :class="['badge', priorityClass(task.priority)]">{{ task.priority }}</span>
            <span v-if="task.dueDate" :class="['text-[11px]', isOverdue(task) ? 'text-red-600 font-semibold' : 'text-neutral-400']">{{ formatDate(task.dueDate) }}</span>
            <div v-if="task.subtasks?.length" class="flex items-center gap-1 text-[11px] text-neutral-400">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              {{ task.subtasks.filter((s: any) => s.completed).length }}/{{ task.subtasks.length }}
            </div>
          </div>
        </div>

        <!-- Desktop layout -->
        <div class="hidden sm:grid grid-cols-12 gap-2 items-center">
          <div class="col-span-5 min-w-0">
            <div class="flex items-center gap-1.5">
              <h3 class="font-semibold text-neutral-900 text-[12px] truncate">{{ task.title }}</h3>
              <div v-if="task.subtasks?.length" class="flex items-center gap-0.5 text-[10px] text-neutral-400 flex-shrink-0">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                {{ task.subtasks.filter((s: any) => s.completed).length }}/{{ task.subtasks.length }}
              </div>
            </div>
            <p v-if="task.description" class="text-neutral-400 text-[11px] line-clamp-1 mt-0.5">{{ task.description }}</p>
          </div>

          <div class="col-span-2">
            <select :value="task.status" @click.stop @change="$emit('update-status', task.id, ($event.target as HTMLSelectElement).value)" class="text-[11px] border border-neutral-200 rounded-md px-2 py-1 bg-white w-full text-neutral-700 cursor-pointer">
              <option value="backlog">Backlog</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div class="col-span-1">
            <span :class="['badge', priorityClass(task.priority)]">{{ task.priority }}</span>
          </div>

          <div class="col-span-2">
            <span v-if="task.dueDate" :class="['text-[11px] flex items-center gap-1.5', isOverdue(task) ? 'text-red-600 font-semibold' : 'text-neutral-500']">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              {{ formatDate(task.dueDate) }}
            </span>
            <span v-else class="text-[11px] text-neutral-300">No date</span>
          </div>

          <div class="col-span-1">
            <div v-if="task.assigneeIds?.length" class="flex -space-x-1">
              <div v-for="id in task.assigneeIds.slice(0, 2)" :key="id" class="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 text-[10px] flex items-center justify-center border-2 border-white font-semibold">{{ id[0].toUpperCase() }}</div>
              <div v-if="task.assigneeIds.length > 2" class="w-6 h-6 rounded-full bg-neutral-100 text-neutral-500 text-[10px] flex items-center justify-center border-2 border-white font-medium">+{{ task.assigneeIds.length - 2 }}</div>
            </div>
            <span v-else class="text-[11px] text-neutral-300">&mdash;</span>
          </div>

          <div class="col-span-1 text-right">
            <button @click.stop="$emit('delete', task.id)" class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-md text-neutral-300 hover:text-red-500 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/useTaskStore'
import type { Task } from '@/types'
const taskStore = useTaskStore()
defineProps<{ tasks: Task[] }>()
defineEmits(['edit', 'delete', 'update-status'])

const isOverdue = (t: Task) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''

const borderClass = (t: Task) => ({
  'border-l-red-500': isOverdue(t),
  'border-l-emerald-500': t.status === 'done',
  'border-l-amber-500': t.status === 'in-progress' && !isOverdue(t),
  'border-l-purple-400': t.status === 'review' && !isOverdue(t),
  'border-l-blue-300': t.status === 'todo' && !isOverdue(t),
  'border-l-neutral-200': t.status === 'backlog' && !isOverdue(t),
})

const priorityClass = (p: string) => ({
  'bg-red-50 text-red-700': p === 'high',
  'bg-amber-50 text-amber-700': p === 'medium',
  'bg-emerald-50 text-emerald-700': p === 'low',
}[p] || 'bg-neutral-50 text-neutral-600')
</script>
