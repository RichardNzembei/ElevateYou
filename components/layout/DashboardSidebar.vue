<template>
  <div>
    <!-- Mobile overlay -->
    <Transition name="fade">
      <div v-if="mobileOpen" class="fixed inset-0 bg-black/25 backdrop-blur-sm z-40 lg:hidden" @click="$emit('close-mobile')"></div>
    </Transition>

    <!-- Sidebar -->
    <aside
        :class="[
          'fixed top-0 left-0 h-full z-50 flex flex-col bg-neutral-950 text-white transition-all duration-200',
          collapsed ? 'w-[52px]' : 'w-[220px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
    >
      <!-- Logo -->
      <div class="flex items-center justify-between h-11 px-3 border-b border-white/[0.08] flex-shrink-0">
        <div class="flex items-center gap-2 overflow-hidden">
          <div class="w-6 h-6 bg-white rounded-md flex items-center justify-center flex-shrink-0">
            <svg class="w-3 h-3 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span v-if="!collapsed" class="text-[13px] font-bold tracking-tight whitespace-nowrap">ElevateYou</span>
        </div>
        <button v-if="!collapsed" @click="$emit('toggle-collapse')" class="p-1 rounded hover:bg-white/10 text-neutral-500 hover:text-white transition-colors hidden lg:flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
        </button>
        <button v-if="collapsed" @click="$emit('toggle-collapse')" class="p-1 rounded hover:bg-white/10 text-neutral-500 hover:text-white transition-colors hidden lg:flex items-center justify-center">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
        </button>
      </div>

      <!-- Workspace selector -->
      <div v-if="!collapsed" class="px-2.5 py-2.5 border-b border-white/[0.08]">
        <div class="relative">
          <select
              v-if="workspaces.length > 0"
              :value="currentWorkspace?.id"
              @change="$emit('workspace-change', $event)"
              class="w-full bg-white/[0.06] border border-white/[0.1] rounded-md px-2.5 py-1.5 text-[11px] text-neutral-300 outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
          >
            <option v-for="ws in workspaces" :key="ws.id" :value="ws.id" class="bg-neutral-900 text-white">{{ workspaceLabel(ws) }}</option>
          </select>
          <div v-if="workspaces.length > 1" class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <span class="text-[9px] bg-white/10 text-neutral-400 px-1 py-0.5 rounded">{{ workspaces.length }}</span>
            <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5">
        <!-- Quick add -->
        <button
            @click="$emit('new-task')"
            :class="collapsed ? 'justify-center px-0' : 'px-2.5'"
            class="w-full flex items-center gap-2 py-1.5 rounded-md text-[12px] font-semibold bg-white/[0.08] hover:bg-white/[0.12] text-white transition-colors mb-3"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
          <span v-if="!collapsed">New Task</span>
        </button>

        <!-- Nav items -->
        <button
            v-for="item in navItems"
            :key="item.id"
            @click="$emit('navigate', item.id)"
            :class="[
              collapsed ? 'justify-center px-0' : 'px-2.5',
              activeView === item.id
                ? 'bg-white/[0.12] text-white'
                : 'text-neutral-400 hover:text-white hover:bg-white/[0.06]'
            ]"
            class="w-full flex items-center gap-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all duration-150"
            :title="collapsed ? item.label : undefined"
        >
          <div v-html="item.icon" class="w-4 h-4 flex-shrink-0"></div>
          <span v-if="!collapsed">{{ item.label }}</span>
        </button>

        <!-- Divider -->
        <div class="border-t border-white/[0.06] !my-3"></div>

        <!-- Projects section -->
        <div v-if="!collapsed" class="px-0.5">
          <div class="flex items-center justify-between mb-2 px-2">
            <span class="text-[10px] font-semibold text-neutral-500 uppercase tracking-widest">Projects</span>
            <button @click="$emit('new-project')" class="p-1 rounded hover:bg-white/10 text-neutral-500 hover:text-white transition-colors">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            </button>
          </div>

          <div v-if="projects.length === 0" class="text-center py-4">
            <p class="text-neutral-600 text-[11px]">No projects yet</p>
          </div>

          <button
              v-for="project in projects"
              :key="project.id"
              @click="$emit('select-project', project)"
              :class="selectedProjectId === project.id
                ? 'bg-white/[0.1] text-white'
                : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/[0.05]'"
              class="w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[12px] transition-all duration-150 group"
          >
            <div class="w-2.5 h-2.5 rounded-full flex-shrink-0 ring-1 ring-white/10" :style="{ backgroundColor: project.color }"></div>
            <span class="flex-1 text-left truncate">{{ project.name }}</span>
            <span class="text-[11px] text-neutral-600 group-hover:text-neutral-400 tabular-nums">{{ getTaskCount(project.id) }}</span>
          </button>
        </div>

        <!-- Collapsed projects -->
        <div v-if="collapsed" class="flex flex-col items-center gap-2 px-1">
          <button
              v-for="project in projects"
              :key="project.id"
              @click="$emit('select-project', project)"
              :class="selectedProjectId === project.id ? 'ring-2 ring-white/30 scale-110' : 'hover:ring-2 hover:ring-white/20'"
              class="w-5 h-5 rounded-full flex-shrink-0 transition-all duration-150"
              :style="{ backgroundColor: project.color }"
              :title="project.name"
          ></button>
        </div>
      </nav>

      <!-- Bottom section -->
      <div class="border-t border-white/[0.08] p-2 space-y-0.5">
        <button
            @click="$emit('open-settings')"
            :class="collapsed ? 'justify-center px-0' : 'px-2.5'"
            class="w-full flex items-center gap-2.5 py-1.5 rounded-md text-[12px] font-medium text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-all duration-150"
        >
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span v-if="!collapsed">Settings</span>
        </button>

        <!-- User -->
        <div :class="collapsed ? 'justify-center px-0' : 'px-2.5'" class="flex items-center gap-2.5 py-2">
          <div class="w-7 h-7 rounded-full bg-white text-neutral-900 flex items-center justify-center text-[11px] font-bold flex-shrink-0">
            {{ userInitials }}
          </div>
          <div v-if="!collapsed" class="flex-1 min-w-0">
            <p class="text-[12px] font-medium text-neutral-200 truncate">{{ userEmail }}</p>
            <p class="text-[10px] text-neutral-500 truncate capitalize">{{ userRole || 'member' }}</p>
          </div>
          <button v-if="!collapsed" @click="$emit('logout')" class="p-1.5 rounded hover:bg-white/10 text-neutral-500 hover:text-white transition-colors" title="Sign out">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { useTaskStore } from '@/stores/useTaskStore'

const taskStore = useTaskStore()

const props = defineProps<{
  collapsed: boolean
  mobileOpen: boolean
  activeView: string
  workspaces: any[]
  currentWorkspace: any
  projects: any[]
  selectedProjectId: string | null
  userId: string
  userInitials: string
  userEmail: string
  userRole: string
}>()

const workspaceLabel = (ws: any) => {
  if (ws.ownerId === props.userId) return ws.name
  return `${ws.name} (shared)`
}

defineEmits([
  'toggle-collapse', 'close-mobile', 'navigate', 'workspace-change',
  'new-project', 'select-project', 'new-task', 'open-settings', 'logout'
])

const getTaskCount = (projectId: string) => taskStore.tasks.filter(t => t.projectId === projectId).length

const navItems = [
  { id: 'overview', label: 'Overview', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>' },
  { id: 'tasks', label: 'Tasks', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>' },
  { id: 'docs', label: 'Documents', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>' },
  { id: 'members', label: 'Team', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>' },
  { id: 'activity', label: 'Activity', icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>' },
]
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
