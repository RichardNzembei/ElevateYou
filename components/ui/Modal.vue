<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-screen items-center justify-center p-5">
          <div class="fixed inset-0 bg-black/30 backdrop-blur-sm" @click="$emit('update:modelValue', false)" />
          <div class="relative bg-white rounded-lg shadow-lg w-full max-w-sm p-5 border border-neutral-200/60">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-[13px] font-bold text-neutral-900">{{ title }}</h2>
              <button @click="$emit('update:modelValue', false)" class="text-neutral-400 hover:text-neutral-600 p-1.5 rounded-md hover:bg-neutral-100 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title: string }>()
defineEmits(['update:modelValue'])
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .relative, .modal-leave-to .relative { transform: scale(0.96) translateY(8px); }
</style>
