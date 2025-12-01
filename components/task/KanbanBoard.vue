<!-- components/tasks/KanbanBoard.vue -->
<template>
  <div class="grid grid-cols-3 gap-6">
    <div v-for="status in statuses" :key="status.value" class="bg-gray-50 rounded-2xl p-4">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-gray-700 uppercase text-xs tracking-wider">
          {{ status.label }} ({{ tasksByStatus(status.value).length }})
        </h3>
        <button @click="showNewTaskModal = true; newTaskForm.status = status.value"
                class="text-gray-400 hover:text-purple-600 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      <div
          @drop="onDrop($event, status.value)"
          @dragover.prevent
          @dragenter.prevent
          class="min-h-screen space-y-3"
      >
        <div
            v-for="task in tasksByStatus(status.value)"
            :key="task.id"
            draggable="true"
            @dragstart="startDrag($event, task)"
            @click="editTask(task)"
            class="bg-white rounded-xl shadow-md p-4 cursor-pointer hover:shadow-lg transition border-l-4"
            :class="{
            'border-red-500': isOverdue(task),
            'border-green-500': task.status === 'done',
            'border-blue-500': task.status === 'in-progress',
            'border-gray-300': task.status === 'todo'
          }"
        >
          <h4 class="font-semibold text-gray-900">{{ task.title }}</h4>
          <p v-if="task.description" class="text-sm text-gray-600 mt-1 line-clamp-2">{{ task.description }}</p>

          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <span :class="['text-xs px-2 py-1 rounded-full font-medium', getPriorityColor(task.priority)]">
                {{ task.priority }}
              </span>
              <div v-if="task.assigneeIds?.length" class="flex -space-x-2">
                <div v-for="id in task.assigneeIds.slice(0, 2)" :key="id"
                     class="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center border-2 border-white font-bold">
                  {{ id[0].toUpperCase() }}
                </div>
              </div>
            </div>
            <span v-if="task.dueDate" class="text-xs text-gray-500">
              {{ formatDate(task.dueDate) }}
            </span>
          </div>
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

const emit = defineEmits(['edit-task'])
const props = defineProps<{
  showNewTaskModal: boolean
  newTaskForm: any
}>()

const statuses = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]

const tasksByStatus = (status: string) => {
  if (!projectStore.selectedProject) return []
  return taskStore.filteredTasks
      .filter(t => t.projectId === projectStore.selectedProject!.id && t.status === status)
}

let draggedTask: any = null

const startDrag = (evt: DragEvent, task: any) => {
  draggedTask = task
  evt.dataTransfer?.setData('taskId', task.id)
}

const onDrop = async (evt: DragEvent, newStatus: string) => {
  const taskId = evt.dataTransfer?.getData('taskId')
  if (taskId && draggedTask?.status !== newStatus) {
    await taskStore.update(taskId, { status: newStatus })
  }
}

const editTask = (task: any) => {
  emit('edit-task', task)
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'bg-red-100 text-red-700'
    case 'medium': return 'bg-yellow-100 text-yellow-700'
    case 'low': return 'bg-green-100 text-green-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const isOverdue = (task: any) => {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate) < new Date()
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
</script>