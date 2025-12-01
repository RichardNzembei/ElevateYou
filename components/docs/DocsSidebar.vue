<!-- components/docs/DocsSidebar.vue -->
<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Docs & Pages</h3>
      <button @click="$emit('create-root')" class="text-purple-600 hover:text-purple-700">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <div class="space-y-1">
      <DocTreeItem
          v-for="doc in rootDocs"
          :key="doc.id"
          :doc="doc"
          :depth="0"
          @select-doc="$emit('select-doc', $event)"
          @create-child="docId => $emit('create-child', docId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDocStore } from '@/stores/useDocStore'
import DocTreeItem from './DocTreeItem.vue'

const docStore = useDocStore()

// Only root docs (no parent)
const rootDocs = computed(() => {
  return docStore.docs
      .filter(d => !d.parentId)
      .sort((a, b) => a.order - b.order)
})

// Declare all emitted events
defineEmits(['select-doc', 'create-root', 'create-child'])
</script>