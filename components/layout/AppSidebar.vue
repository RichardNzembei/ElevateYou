<template>
  <div class="space-y-1.5">
    <button
        @click="$emit('new-project')"
        class="w-full btn-primary flex items-center justify-center gap-2 mb-4"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
      New Project
    </button>

    <p class="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-2">Projects</p>

    <div v-if="projectStore.projects.length === 0" class="text-center py-6">
      <p class="text-neutral-400 text-sm">No projects yet</p>
    </div>

    <button
        v-for="project in projectStore.projects"
        :key="project.id"
        @click="projectStore.selectedProject = project"
        :class="[
          'w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition-all group text-sm',
          projectStore.selectedProject?.id === project.id
            ? 'bg-neutral-900 text-white'
            : 'hover:bg-neutral-100 text-neutral-700'
        ]"
    >
      <div class="flex items-center gap-2.5 flex-1 min-w-0">
        <div class="w-3 h-3 rounded-full flex-shrink-0 border-2" :style="{ borderColor: project.color, backgroundColor: projectStore.selectedProject?.id === project.id ? project.color : 'transparent' }" />
        <span class="font-medium truncate">{{ project.name }}</span>
      </div>
      <div class="flex items-center gap-1.5">
        <span :class="['text-xs px-1.5 py-0.5 rounded', projectStore.selectedProject?.id === project.id ? 'bg-white/20 text-white/80' : 'bg-neutral-100 text-neutral-500']">
          {{ getTaskCount(project.id) }}
        </span>
        <button
            @click.stop="$emit('delete-project', project.id)"
            :class="['opacity-0 group-hover:opacity-100 p-0.5 rounded transition-all', projectStore.selectedProject?.id === project.id ? 'hover:bg-white/20 text-white/60' : 'hover:bg-red-50 text-red-500']"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
        </button>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useProjectStore } from '@/stores/useProjectStore'
import { useTaskStore } from '@/stores/useTaskStore'
const projectStore = useProjectStore()
const taskStore = useTaskStore()
defineEmits(['new-project', 'delete-project'])
const getTaskCount = (projectId: string) => taskStore.tasks.filter(t => t.projectId === projectId).length
</script>
