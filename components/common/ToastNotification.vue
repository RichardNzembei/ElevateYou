<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="successMessage" class="fixed bottom-5 right-5 bg-neutral-900 text-white px-5 py-3.5 rounded-xl shadow-lg text-[14px] font-medium z-50 flex items-center gap-2.5 max-w-sm">
        <svg class="w-5 h-5 text-emerald-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
        {{ successMessage }}
      </div>
    </Transition>
    <Transition name="toast">
      <div v-if="errorMessage" class="fixed bottom-5 right-5 bg-red-600 text-white px-5 py-3.5 rounded-xl shadow-lg text-[14px] font-medium z-50 flex items-center gap-2.5 max-w-sm">
        <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
        {{ errorMessage }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{ successMessage: string; errorMessage: string }>()
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(12px); }
</style>
