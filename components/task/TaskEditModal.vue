<template>
  <Modal :modelValue="modelValue" @update:modelValue="$emit('update:modelValue', $event)" title="Edit Task">
    <div v-if="task" class="space-y-4">
      <div>
        <label class="block text-xs font-medium text-neutral-500 mb-1.5">Task Title</label>
        <input
            v-model="task.title"
            placeholder="Enter task title..."
            class="input-field"
        />
      </div>
      <div>
        <label class="block text-xs font-medium text-neutral-500 mb-1.5">Description</label>
        <textarea
            v-model="task.description"
            placeholder="Task description..."
            rows="3"
            class="input-field resize-none"
        ></textarea>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-xs font-medium text-neutral-500 mb-1.5">Priority</label>
          <select v-model="task.priority" class="input-field">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-500 mb-1.5">Due Date</label>
          <input
              v-model="task.dueDate"
              type="date"
              class="input-field"
          />
        </div>
      </div>
      <div class="flex gap-2.5 pt-1">
        <button
            @click="$emit('update-task')"
            :disabled="loading"
            class="flex-1 btn-primary py-2.5 disabled:opacity-50"
        >
          {{ loading ? 'Updating...' : 'Update Task' }}
        </button>
        <button
            @click="$emit('update:modelValue', false)"
            class="flex-1 btn-secondary py-2.5"
        >
          Cancel
        </button>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/ui/Modal.vue'

defineProps<{
  modelValue: boolean
  task: any
  loading: boolean
}>()

defineEmits(['update:modelValue', 'update-task'])
</script>
