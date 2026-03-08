<template>
  <div class="h-full flex flex-col bg-white overflow-hidden">
    <!-- Toolbar -->
    <div class="border-b border-neutral-100 px-5 sm:px-6 py-2.5 flex items-center justify-between bg-white">
      <div class="flex items-center gap-0.5">
        <button @click="format('bold')" :class="{ 'bg-neutral-100 text-neutral-900': isActive('bold') }" class="p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
        </button>
        <button @click="format('italic')" :class="{ 'bg-neutral-100 text-neutral-900': isActive('italic') }" class="p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5h4M14 19H8M16 5l-4 14" /></svg>
        </button>
        <div class="w-px h-5 bg-neutral-200 mx-1.5" />
        <button @click="format('heading', 1)" class="px-2 py-1.5 text-[12px] font-bold hover:bg-neutral-100 rounded-lg text-neutral-500">H1</button>
        <button @click="format('heading', 2)" class="px-2 py-1.5 text-[12px] font-bold hover:bg-neutral-100 rounded-lg text-neutral-500">H2</button>
        <button @click="format('heading', 3)" class="px-2 py-1.5 text-[12px] font-bold hover:bg-neutral-100 rounded-lg text-neutral-500">H3</button>
        <div class="w-px h-5 bg-neutral-200 mx-1.5" />
        <button @click="format('bulletList')" :class="{ 'bg-neutral-100 text-neutral-900': isActive('bulletList') }" class="p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-500 text-[12px] font-semibold">List</button>
        <button @click="format('orderedList')" :class="{ 'bg-neutral-100 text-neutral-900': isActive('orderedList') }" class="p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-500 text-[12px] font-semibold">1.</button>
        <button @click="format('codeBlock')" :class="{ 'bg-neutral-100 text-neutral-900': isActive('codeBlock') }" class="p-2 rounded-lg hover:bg-neutral-100 transition text-neutral-500 text-[12px] font-semibold">Code</button>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-[12px] text-neutral-400">Auto-saved</span>
        <button @click="showRenameModal = true" class="text-[13px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors">Rename</button>
        <button @click="showDeleteModal = true" class="text-[13px] text-red-400 hover:text-red-600 font-medium transition-colors">Delete</button>
      </div>
    </div>

    <!-- Title -->
    <div class="px-8 sm:px-12 pt-8 pb-4">
      <input v-model="localTitle" @blur="saveTitle" placeholder="Untitled" class="text-[28px] font-bold w-full outline-none bg-transparent text-neutral-900 placeholder:text-neutral-300 tracking-tight" />
    </div>

    <!-- Editor -->
    <div class="flex-1 overflow-y-auto px-8 sm:px-12 pb-24">
      <editor-content :editor="editor" class="prose prose-neutral max-w-none focus:outline-none min-h-96" />
    </div>

    <Modal v-model="showRenameModal" title="Rename Document">
      <div class="space-y-4">
        <input v-model="renameInput" @keyup.enter="confirmRename" placeholder="New name..." class="input-field" autofocus />
        <div class="flex gap-3">
          <button @click="confirmRename" class="flex-1 btn-primary py-2.5">Save</button>
          <button @click="showRenameModal = false" class="flex-1 btn-secondary py-2.5">Cancel</button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showDeleteModal" title="Delete Document">
      <p class="text-[14px] text-neutral-600 mb-5 leading-relaxed">Delete "<strong class="text-neutral-900">{{ localTitle }}</strong>" forever?</p>
      <div class="flex gap-3">
        <button @click="confirmDelete" class="flex-1 btn-danger py-2.5">Delete</button>
        <button @click="showDeleteModal = false" class="flex-1 btn-secondary py-2.5">Cancel</button>
      </div>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import DOMPurify from 'dompurify'
import { useDocStore } from '@/stores/useDocStore'
import Modal from '@/components/ui/Modal.vue'

const props = defineProps<{ docId: string; title: string; content: string }>()
const docStore = useDocStore()
const localTitle = ref(props.title || 'Untitled')
const showRenameModal = ref(false)
const showDeleteModal = ref(false)
const renameInput = ref(props.title)

const sanitize = (html: string) => DOMPurify.sanitize(html)
const editor = useEditor({ content: sanitize(props.content || '<p>Start writing...</p>'), extensions: [StarterKit], onUpdate: ({ editor }) => debouncedSave(editor.getHTML()) })
const isActive = (type: string, options?: any) => editor.value?.isActive(type, options) ?? false

const format = (command: string, value?: any) => {
  const e = editor.value!
  if (command === 'heading') e.chain().focus().toggleHeading({ level: value as any }).run()
  else if (command === 'bulletList') e.chain().focus().toggleBulletList().run()
  else if (command === 'orderedList') e.chain().focus().toggleOrderedList().run()
  else if (command === 'codeBlock') e.chain().focus().toggleCodeBlock().run()
  else e.chain().focus().toggleMark(command).run()
}

let timeout: any
const debouncedSave = (html: string) => { clearTimeout(timeout); timeout = setTimeout(() => docStore.update(props.docId, { title: localTitle.value, content: html }), 1000) }
const saveTitle = () => docStore.update(props.docId, { title: localTitle.value })
const confirmRename = () => { if (renameInput.value?.trim()) { localTitle.value = renameInput.value.trim(); saveTitle(); showRenameModal.value = false } }
const confirmDelete = async () => { await docStore.remove(props.docId); showDeleteModal.value = false }

watch(() => props.content, (val) => { const clean = sanitize(val || ''); if (editor.value?.getHTML() !== clean) editor.value?.commands.setContent(clean, { emitUpdate: false }) })
watch(() => props.title, (val) => { if (localTitle.value !== val) { localTitle.value = val || 'Untitled'; renameInput.value = val } })
onMounted(() => editor.value?.chain().focus())
onBeforeUnmount(() => editor.value?.destroy())
</script>
