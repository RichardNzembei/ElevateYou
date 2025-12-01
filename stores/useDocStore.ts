import { defineStore } from 'pinia'
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc
} from 'firebase/firestore'

export const useDocStore = defineStore('doc', {
    state: () => ({
        docs: [] as any[],
        loading: true,
        currentDoc: null as any,
        unsubscribe: null as (() => void) | null
    }),

    actions: {
        listen(workspaceId: string) {
            const { $firestore } = useNuxtApp()
            if (!workspaceId) return

            // Clean up previous listener
            if (this.unsubscribe) {
                this.unsubscribe()
            }

            const q = query(
                collection($firestore, 'docs'),
                where('workspaceId', '==', workspaceId),
                orderBy('order'),
                orderBy('createdAt')
            )

            this.loading = true
            this.unsubscribe = onSnapshot(q, (snap) => {
                this.docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                this.loading = false
            })
        },

        stopListening() {
            if (this.unsubscribe) {
                this.unsubscribe()
                this.unsubscribe = null
            }
            this.docs = []
            this.currentDoc = null
            this.loading = true
        },

        async create(data: any) {
            const { $firestore } = useNuxtApp()
            const ref = await addDoc(collection($firestore, 'docs'), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            return ref.id
        },

        async update(id: string, updates: any) {
            const { $firestore } = useNuxtApp()
            await updateDoc(doc($firestore, 'docs', id), {
                ...updates,
                updatedAt: new Date()
            })
        },

        async remove(id: string) {
            const { $firestore } = useNuxtApp()
            await deleteDoc(doc($firestore, 'docs', id))
        }
    }
})