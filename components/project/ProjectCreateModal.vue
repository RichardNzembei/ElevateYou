<template>
  <Modal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Create Project">
    <div class="space-y-3.5">
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Project Name *</label>
        <input v-model="form.name" placeholder="e.g. Website Redesign, Mobile App..." class="input-field" @keyup.enter="submit" />
      </div>
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Description</label>
        <textarea v-model="form.description" placeholder="What is this project about?" rows="2" class="input-field resize-none"></textarea>
      </div>
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Color</label>
        <div class="flex items-center gap-2.5">
          <input v-model="form.color" type="color" class="w-8 h-8 rounded-md border border-neutral-200 cursor-pointer p-0.5" />
          <div class="flex gap-1.5 flex-wrap">
            <button v-for="c in presetColors" :key="c" @click="form.color = c" class="w-6 h-6 rounded-full border-2 transition-all hover:scale-110" :class="form.color === c ? 'border-neutral-900 scale-110' : 'border-transparent'" :style="{ backgroundColor: c }"></button>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Start Date</label>
          <input v-model="form.startDate" type="date" class="input-field" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">End Date</label>
          <input v-model="form.endDate" type="date" class="input-field" />
        </div>
      </div>
      <div class="flex gap-2 pt-1">
        <button @click="submit" :disabled="loading || !form.name.trim()" class="flex-1 btn-primary disabled:opacity-50">{{ loading ? 'Creating...' : 'Create Project' }}</button>
        <button @click="$emit('update:modelValue', false)" class="flex-1 btn-secondary">Cancel</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'

defineProps<{ modelValue: boolean; loading: boolean }>()
const emit = defineEmits(['update:modelValue', 'create'])

const presetColors = ['#171717', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']
const form = ref({ name: '', description: '', color: '#171717', startDate: '', endDate: '' })
const submit = () => { if (!form.value.name.trim()) return; emit('create', { ...form.value }); form.value = { name: '', description: '', color: '#171717', startDate: '', endDate: '' } }
</script>
