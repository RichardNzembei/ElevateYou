<!-- components/docs/DocEditor.vue -->
<template>
  <div class="h-full flex flex-col bg-white rounded-r-2xl shadow-2xl overflow-hidden">
    <!-- Toolbar -->
    <div class="border-b border-gray-200 px-8 py-4 flex items-center justify-between bg-gray-50">
      <div class="flex items-center gap-2">
        <button @click="format('bold')" :class="{ 'bg-purple-100 text-purple-700': isActive('bold') }"
                class="p-2 rounded hover:bg-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>

        <button @click="format('italic')" :class="{ 'bg-purple-100 text-purple-700': isActive('italic') }"
                class="p-2 rounded hover:bg-gray-200 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5h4M14 19H8M16 5l-4 14" />
          </svg>
        </button>

        <div class="w-px h-8 bg-gray-300 mx-2" />

        <button @click="format('heading', 1)" class="px-3 py-2 text-sm font-medium hover:bg-gray-200 rounded">H1</button>
        <button @click="format('heading', 2)" class="px-3 py-2 text-sm font-medium hover:bg-gray-200 rounded">H2</button>
        <button @click="format('heading', 3)" class="px-3 py-2 text-sm font-medium hover:bg-gray-200 rounded">H3</button>

        <div class="w-px h-8 bg-gray-300 mx-2" />

        <button @click="format('bulletList')" :class="{ 'bg-purple-100 text-purple-700': isActive('bulletList') }"
                class="p-2 rounded hover:bg-gray-200 transition">• List</button>
        <button @click="format('orderedList')" :class="{ 'bg-purple-100 text-purple-700': isActive('orderedList') }"
                class="p-2 rounded hover:bg-gray-200 transition">1. List</button>
        <button @click="format('codeBlock')" :class="{ 'bg-purple-100 text-purple-700': isActive('codeBlock') }"
                class="p-2 rounded hover:bg-gray-200 transition">Code</button>
      </div>

      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-500">Saved</span>
        <button @click="showRenameModal = true" class="text-purple-600 hover:text-purple-800 font-medium">
          Rename
        </button>
        <button @click="showDeleteModal = true" class="text-red-600 hover:text-red-800 font-medium">
          Delete
        </button>
      </div>
    </div>

    <!-- Title -->
    <div class="px-12 pt-10 pb-6">
      <input
          v-model="localTitle"
          @blur="saveTitle"
          placeholder="Untitled"
          class="text-4xl font-bold w-full outline-none bg-transparent"
      />
    </div>

    <!-- Editor -->
    <div class="flex-1 overflow-y-auto px-12 pb-32">
      <editor-content :editor="editor" class="prose prose-lg max-w-none focus:outline-none min-h-96" />
    </div>

    <!-- Rename Modal -->
    <Modal v-model="showRenameModal" title="Rename Document">
      <div class="space-y-4">
        <input
            v-model="renameInput"
            @keyup.enter="confirmRename"
            placeholder="New name..."
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            autofocus
        />
        <div class="flex gap-3">
          <button @click="confirmRename" class="flex-1 bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700">
            Save
          </button>
          <button @click="showRenameModal = false" class="flex-1 bg-gray-200 py-3 rounded-xl">
            Cancel
          </button>
        </div>
      </div>
    </Modal>

    <!-- Delete Modal -->
    <Modal v-model="showDeleteModal" title="Delete Document">
      <p class="text-gray-700 mb-6">Delete "<strong>{{ localTitle }}</strong>" forever?</p>
      <div class="flex gap-3">
        <button @click="confirmDelete" class="flex-1 bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700">
          Delete
        </button>
        <button @click="showDeleteModal = false" class="flex-1 bg-gray-200 py-3 rounded-xl">
          Cancel
        </button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { useDocStore } from '@/stores/useDocStore'
import Modal from '@/components/ui/Modal.vue'

const props = defineProps<{
  docId: string
  title: string
  content: string
}>()

const docStore = useDocStore()
const localTitle = ref(props.title || 'Untitled')

// Reactive modals
const showRenameModal = ref(false)
const showDeleteModal = ref(false)
const renameInput = ref(props.title)

// Tiptap editor
const editor = useEditor({
  content: props.content || '<p>Start writing...</p>',
  extensions: [StarterKit],
  onUpdate: ({ editor }) => debouncedSave(editor.getHTML()),
})

// Critical: expose isActive as a proper function
const isActive = (type: string, options?: any) => editor.value?.isActive(type, options) ?? false

const format = (command: string, value?: any) => {
  const e = editor.value!
  if (command === 'heading') {
    e.chain().focus().toggleHeading({ level: value as any }).run()
  } else if (command === 'bulletList') {
    e.chain().focus().toggleBulletList().run()
  } else if (command === 'orderedList') {
    e.chain().focus().toggleOrderedList().run()
  } else if (command === 'codeBlock') {
    e.chain().focus().toggleCodeBlock().run()
  } else {
    e.chain().focus().toggleMark(command).run()
  }
}

// Debounced save
let timeout: any
const debouncedSave = (html: string) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    docStore.update(props.docId, { title: localTitle.value, content: html })
  }, 1000)
}

const saveTitle = () => {
  docStore.update(props.docId, { title: localTitle.value })
}

const confirmRename = () => {
  if (renameInput.value?.trim()) {
    localTitle.value = renameInput.value.trim()
    saveTitle()
    showRenameModal.value = false
  }
}

const confirmDelete = async () => {
  await docStore.remove(props.docId)
  showDeleteModal.value = false
}

// Watch props
watch(() => props.content, (val) => {
  if (editor.value?.getHTML() !== val) {
    editor.value?.commands.setContent(val || '', false)
  }
})

watch(() => props.title, (val) => {
  if (localTitle.value !== val) {
    localTitle.value = val || 'Untitled'
    renameInput.value = val
  }
})

onMounted(() => editor.value?.chain().focus())
onBeforeUnmount(() => editor.value?.destroy())
</script>