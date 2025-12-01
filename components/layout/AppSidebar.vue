<template>
  <div class="w-80 bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
    <button
        @click="$emit('new-project')"
        class="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 mb-6 hover:scale-105 transition"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      New Project
    </button>

    <div class="space-y-2">
      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Projects</h3>

      <div v-if="projectStore.projects.length === 0" class="text-center py-8">
        <p class="text-gray-500 text-sm">No projects yet</p>
      </div>

      <button
          v-for="project in projectStore.projects"
          :key="project.id"
          @click="projectStore.selectedProject = project"
          :class="[
          'w-full text-left p-4 rounded-lg flex items-center justify-between transition group',
          projectStore.selectedProject?.id === project.id
            ? 'bg-purple-50 text-purple-700 shadow-md'
            : 'hover:bg-gray-100 text-gray-700'
        ]"
      >
        <div class="flex items-center gap-3 flex-1">
          <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: project.color }" />
          <span class="font-medium truncate">{{ project.name }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
            {{ getTaskCount(project.id) }}
          </span>
          <button
              @click.stop="$emit('delete-project', project.id)"
              class="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded text-red-600 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/useProjectStore'
import { useTaskStore } from '@/stores/useTaskStore'

const projectStore = useProjectStore()
const taskStore = useTaskStore()

defineEmits(['new-project', 'delete-project'])

const getTaskCount = (projectId: string) => {
  return taskStore.tasks.filter(t => t.projectId === projectId).length
}
</script>