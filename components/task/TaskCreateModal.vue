<template>
  <Modal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Create Task">
    <div class="space-y-3.5">
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Title *</label>
        <input v-model="form.title" placeholder="What needs to be done?" class="input-field" @keyup.enter="submit" />
      </div>
      <div>
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Description</label>
        <textarea v-model="form.description" placeholder="Add more details..." rows="2" class="input-field resize-none"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Status</label>
          <select v-model="form.status" class="input-field">
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
          </select>
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Priority</label>
          <select v-model="form.priority" class="input-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Due Date</label>
          <input v-model="form.dueDate" type="date" class="input-field" />
        </div>
        <div>
          <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Est. Hours</label>
          <input v-model.number="form.estimatedHours" type="number" min="0" step="0.5" placeholder="0" class="input-field" />
        </div>
      </div>
      <div v-if="members.length > 0">
        <label class="block text-[10px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Assign To</label>
        <div class="flex flex-wrap gap-1.5">
          <button v-for="member in members" :key="member.uid" @click="toggleAssignee(member.uid)"
              :class="form.assigneeIds.includes(member.uid) ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-700 border-neutral-200 hover:border-neutral-400'"
              class="flex items-center gap-1 px-2 py-1 rounded-md border text-[11px] font-medium transition-all">
            <div class="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold" :class="form.assigneeIds.includes(member.uid) ? 'bg-white text-neutral-900' : 'bg-neutral-200 text-neutral-600'">{{ (member.displayName || member.email)[0].toUpperCase() }}</div>
            {{ member.displayName || member.email.split('@')[0] }}
          </button>
        </div>
      </div>
      <div class="flex gap-2 pt-1">
        <button @click="submit" :disabled="loading || !form.title.trim()" class="flex-1 btn-primary disabled:opacity-50">{{ loading ? 'Creating...' : 'Create Task' }}</button>
        <button @click="$emit('update:modelValue', false)" class="flex-1 btn-secondary">Cancel</button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'

defineProps<{ modelValue: boolean; loading: boolean; members?: any[] }>()
const emit = defineEmits(['update:modelValue', 'create'])

const form = ref({ title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: null as number | null, assigneeIds: [] as string[] })
const toggleAssignee = (uid: string) => { const idx = form.value.assigneeIds.indexOf(uid); if (idx >= 0) form.value.assigneeIds.splice(idx, 1); else form.value.assigneeIds.push(uid) }
const submit = () => { if (!form.value.title.trim()) return; emit('create', { ...form.value }); form.value = { title: '', description: '', status: 'todo', priority: 'medium', dueDate: '', estimatedHours: null, assigneeIds: [] } }
defineExpose({ form })
</script>
