import { defineStore } from 'pinia'
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { computed, ref } from 'vue'
import type { Task } from '@/types'

export const useTaskStore = defineStore('task', () => {
    const tasks = ref<Task[]>([])
    const searchQuery = ref('')
    const filterStatus = ref('all')
    const filterPriority = ref('all')
    let unsubscribe: (() => void) | null = null

    const filteredTasks = computed(() => {
        return tasks.value.filter(task => {
            if (filterStatus.value !== 'all' && task.status !== filterStatus.value) return false
            if (filterPriority.value !== 'all' && task.priority !== filterPriority.value) return false
            if (searchQuery.value && !task.title.toLowerCase().includes(searchQuery.value.toLowerCase())) return false
            return true
        }).sort((a, b) => {
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        })
    })

    function listen(workspaceId: string) {
        if (unsubscribe) unsubscribe()

        const { firestore } = useFirebase()
        const q = query(
            collection(firestore, 'tasks'),
            where('workspaceId', '==', workspaceId)
        )

        unsubscribe = onSnapshot(q, (snap) => {
            tasks.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task))
        })

        return unsubscribe
    }

    function stopListening() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
        tasks.value = []
        searchQuery.value = ''
        filterStatus.value = 'all'
        filterPriority.value = 'all'
    }

    async function create(task: Partial<Task>) {
        const { firestore } = useFirebase()
        await addDoc(collection(firestore, 'tasks'), {
            ...task,
            assigneeIds: task.assigneeIds || [],
            tags: task.tags || [],
            createdAt: new Date(),
            updatedAt: new Date()
        })
    }

    async function update(id: string, updates: Partial<Task>) {
        const { firestore } = useFirebase()
        await updateDoc(doc(firestore, 'tasks', id), {
            ...updates,
            updatedAt: new Date()
        })
    }

    async function remove(id: string) {
        const { firestore } = useFirebase()
        await deleteDoc(doc(firestore, 'tasks', id))
    }

    return {
        tasks,
        filteredTasks,
        searchQuery,
        filterStatus,
        filterPriority,
        listen,
        stopListening,
        create,
        update,
        remove
    }
})