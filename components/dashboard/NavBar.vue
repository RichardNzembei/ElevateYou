<template>
  <nav class="bg-white border-b border-neutral-200 sticky top-0 z-40">
    <div class="max-w-full mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 bg-neutral-900 rounded-md flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-base font-semibold text-neutral-900 hidden sm:block">ElevateYou</span>
        </div>

        <div class="w-px h-6 bg-neutral-200 hidden sm:block"></div>

        <!-- View Tabs -->
        <div class="flex gap-0.5 bg-neutral-100 p-0.5 rounded-lg">
          <button
              v-for="tab in tabs"
              :key="tab.value"
              @click="$emit('update:activeView', tab.value)"
              :class="activeView === tab.value ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500 hover:text-neutral-700'"
              class="px-2.5 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5"
          >
            <component :is="tab.icon" class="w-3.5 h-3.5 hidden sm:block" />
            {{ tab.label }}
          </button>
        </div>

        <!-- Workspace Switcher -->
        <select
            v-if="workspaces.length > 0"
            :value="currentWorkspace"
            @change="$emit('workspace-change', $event)"
            class="text-sm border border-neutral-200 rounded-lg px-3 py-1.5 bg-white text-neutral-700 focus:ring-2 focus:ring-neutral-900 hidden lg:block"
        >
          <option v-for="ws in workspaces" :key="ws.id" :value="ws">{{ ws.name }}</option>
        </select>
      </div>

      <div class="flex items-center gap-3">
        <!-- Search -->
        <button @click="$emit('toggle-search')" class="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition-colors hidden sm:flex">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </button>

        <div class="w-px h-6 bg-neutral-200 hidden sm:block"></div>

        <div class="flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-semibold">
            {{ userInitials }}
          </div>
          <button @click="$emit('logout')" class="text-sm text-neutral-500 hover:text-neutral-900 font-medium hidden sm:block transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { h } from 'vue'
import type { Workspace } from '@/types'

defineProps<{
  activeView: string
  workspaces: Workspace[]
  currentWorkspace: Workspace | null
  userInitials: string
}>()

defineEmits(['update:activeView', 'workspace-change', 'logout', 'toggle-search'])

// Simple SVG icon components
const OverviewIcon = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-3.5 h-3.5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' })]) }
const TaskIcon = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-3.5 h-3.5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' })]) }
const DocIcon = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-3.5 h-3.5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' })]) }
const MemberIcon = { render: () => h('svg', { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24', class: 'w-3.5 h-3.5' }, [h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '2', d: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z' })]) }

const tabs = [
  { value: 'overview', label: 'Overview', icon: OverviewIcon },
  { value: 'tasks', label: 'Tasks', icon: TaskIcon },
  { value: 'docs', label: 'Docs', icon: DocIcon },
  { value: 'members', label: 'Team', icon: MemberIcon },
]
</script>
