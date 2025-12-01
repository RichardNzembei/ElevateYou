import { defineStore } from 'pinia'
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore'
import { ref } from 'vue'
import type { Workspace } from '@/types'

export const useWorkspaceStore = defineStore('workspace', () => {
    const { firestore } = useFirebase()
    const workspaces = ref<Workspace[]>([])
    const currentWorkspace = ref<Workspace | null>(null)
    const loading = ref(true)
    let unsubscribe: (() => void) | null = null

    function listen(userId: string) {
        if (unsubscribe) unsubscribe()

        const q = query(
            collection(firestore, 'workspaces'),
            where('ownerId', '==', userId)
        )

        unsubscribe = onSnapshot(q, (snap) => {
            workspaces.value = snap.docs.map(d => ({
                id: d.id,
                ...d.data()
            } as Workspace))

            if (!currentWorkspace.value && workspaces.value.length > 0) {
                currentWorkspace.value = workspaces.value[0]
            }
            loading.value = false
        })

        return unsubscribe
    }

    function stopListening() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
        workspaces.value = []
        currentWorkspace.value = null
        loading.value = true
    }

    async function create(name: string, userId: string) {
        const docRef = await addDoc(collection(firestore, 'workspaces'), {
            name,
            ownerId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        const newWorkspace = {
            id: docRef.id,
            name,
            ownerId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        } as Workspace

        currentWorkspace.value = newWorkspace
        return newWorkspace
    }

    async function update(id: string, updates: Partial<Workspace>) {
        await updateDoc(doc(firestore, 'workspaces', id), {
            ...updates,
            updatedAt: new Date()
        })
    }

    return {
        workspaces,
        currentWorkspace,
        loading,
        listen,
        stopListening,
        create,
        update
    }
})