<template>
  <div>
    <div
        class="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer group transition-colors"
        :class="{ 'bg-neutral-100': isSelected }"
        @click="$emit('select-doc', doc)"
    >
      <button
          v-if="hasChildren"
          @click.stop="toggle"
          class="text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        <svg class="w-3.5 h-3.5 transition-transform" :class="{ 'rotate-90': isOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <span v-else class="w-3.5"></span>

      <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>

      <span class="flex-1 text-sm text-neutral-700 truncate">{{ doc.title }}</span>

      <button
          @click.stop="$emit('create-child', doc.id)"
          class="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-neutral-900 transition-all"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>

    <!-- Children -->
    <div v-if="isOpen && hasChildren" class="ml-5 mt-0.5">
      <DocTreeItem
          v-for="child in children"
          :key="child.id"
          :doc="child"
          :depth="depth + 1"
          @select-doc="$emit('select-doc', $event)"
          @create-child="docId => $emit('create-child', docId)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDocStore } from '@/stores/useDocStore'

const props = defineProps<{
  doc: any
  depth: number
}>()

const emit = defineEmits(['select-doc', 'create-child'])

const docStore = useDocStore()
const isOpen = ref(true)

const children = computed(() => {
  return docStore.docs
      .filter(d => d.parentId === props.doc.id)
      .sort((a, b) => a.order - b.order)
})

const hasChildren = computed(() => children.value.length > 0)
const isSelected = computed(() => docStore.currentDoc?.id === props.doc.id)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
