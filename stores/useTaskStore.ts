import { defineStore } from 'pinia'
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, deleteDoc, doc, getDocs, arrayUnion, arrayRemove } from 'firebase/firestore'
import { computed, ref } from 'vue'
import type { Task, Comment, Subtask } from '@/types'

export const useTaskStore = defineStore('task', () => {
    const tasks = ref<Task[]>([])
    const searchQuery = ref('')
    const filterStatus = ref<'all' | 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'>('all')
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
        const now = new Date()
        const optimistic = {
            ...task,
            id: '_temp_' + Date.now(),
            assigneeIds: task.assigneeIds || [],
            tags: task.tags || [],
            createdAt: now,
            updatedAt: now
        } as Task

        // Optimistic: show immediately
        tasks.value = [...tasks.value, optimistic]

        try {
            await addDoc(collection(firestore, 'tasks'), {
                ...task,
                assigneeIds: task.assigneeIds || [],
                tags: task.tags || [],
                createdAt: now,
                updatedAt: now
            })
        } catch (err) {
            // Rollback on failure
            tasks.value = tasks.value.filter(t => t.id !== optimistic.id)
            throw err
        }
    }

    async function update(id: string, updates: Partial<Task>) {
        const { firestore } = useFirebase()
        const idx = tasks.value.findIndex(t => t.id === id)
        const previous = idx >= 0 ? { ...tasks.value[idx] } : null

        // Optimistic: apply immediately
        if (idx >= 0) {
            tasks.value[idx] = { ...tasks.value[idx], ...updates, updatedAt: new Date() } as Task
            tasks.value = [...tasks.value]
        }

        try {
            await updateDoc(doc(firestore, 'tasks', id), {
                ...updates,
                updatedAt: new Date()
            })
        } catch (err) {
            // Rollback on failure
            if (previous && idx >= 0) {
                tasks.value[idx] = previous as Task
                tasks.value = [...tasks.value]
            }
            throw err
        }
    }

    async function remove(id: string) {
        const { firestore } = useFirebase()
        const previous = tasks.value.find(t => t.id === id)

        // Optimistic: remove immediately
        tasks.value = tasks.value.filter(t => t.id !== id)

        try {
            await deleteDoc(doc(firestore, 'tasks', id))
        } catch (err) {
            // Rollback on failure
            if (previous) tasks.value = [...tasks.value, previous]
            throw err
        }
    }

    async function addComment(taskId: string, comment: { authorId: string, authorName: string, authorEmail: string, content: string }) {
        const { firestore } = useFirebase()
        await addDoc(collection(firestore, 'tasks', taskId, 'comments'), {
            authorId: comment.authorId,
            authorName: comment.authorName,
            authorEmail: comment.authorEmail,
            content: comment.content,
            createdAt: new Date()
        })
    }

    async function getComments(taskId: string): Promise<Comment[]> {
        const { firestore } = useFirebase()
        const q = query(
            collection(firestore, 'tasks', taskId, 'comments'),
            orderBy('createdAt', 'desc')
        )
        const snap = await getDocs(q)
        return snap.docs.map(d => ({ id: d.id, taskId, ...d.data() } as Comment))
    }

    async function toggleSubtask(taskId: string, subtaskIndex: number) {
        const task = tasks.value.find(t => t.id === taskId)
        if (!task || !task.subtasks) return

        const updatedSubtasks = [...task.subtasks]
        updatedSubtasks[subtaskIndex] = {
            ...updatedSubtasks[subtaskIndex],
            completed: !updatedSubtasks[subtaskIndex].completed
        }

        await update(taskId, { subtasks: updatedSubtasks })
    }

    async function addSubtask(taskId: string, title: string) {
        const task = tasks.value.find(t => t.id === taskId)
        if (!task) return

        const newSubtask: Subtask = {
            id: crypto.randomUUID(),
            title,
            completed: false
        }

        const updatedSubtasks = [...(task.subtasks || []), newSubtask]
        await update(taskId, { subtasks: updatedSubtasks })
    }

    async function removeSubtask(taskId: string, subtaskId: string) {
        const task = tasks.value.find(t => t.id === taskId)
        if (!task || !task.subtasks) return

        const updatedSubtasks = task.subtasks.filter(s => s.id !== subtaskId)
        await update(taskId, { subtasks: updatedSubtasks })
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
        remove,
        addComment,
        getComments,
        toggleSubtask,
        addSubtask,
        removeSubtask
    }
})
