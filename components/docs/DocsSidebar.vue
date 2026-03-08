<template>
  <div>
    <div v-if="rootDocs.length === 0" class="text-center py-4">
      <p class="text-neutral-400 text-xs">No documents yet</p>
    </div>
    <div class="space-y-0.5">
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
