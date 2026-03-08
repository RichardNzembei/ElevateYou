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
import { useFirebase } from '~/composables/firebase-client'

export const useDocStore = defineStore('doc', {
    state: () => ({
        docs: [] as any[],
        loading: true,
        currentDoc: null as any,
        unsubscribe: null as (() => void) | null
    }),

    actions: {
        listen(workspaceId: string, projectId?: string) {
            const { firestore } = useFirebase()
            if (!workspaceId) return

            if (this.unsubscribe) {
                this.unsubscribe()
            }

            const constraints = [
                where('workspaceId', '==', workspaceId)
            ]

            if (projectId) {
                constraints.push(where('projectId', '==', projectId))
            }

            const q = query(
                collection(firestore, 'docs'),
                ...constraints,
                orderBy('createdAt')
            )

            this.loading = true
            this.unsubscribe = onSnapshot(q, (snap) => {
                this.docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
                this.loading = false
            }, (error) => {
                console.warn('Docs listener error:', error.message)
                this.loading = false
            })
        },

        listenByProject(workspaceId: string, projectId: string) {
            this.listen(workspaceId, projectId)
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
            const { firestore } = useFirebase()
            const ref = await addDoc(collection(firestore, 'docs'), {
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            return ref.id
        },

        async update(id: string, updates: any) {
            const { firestore } = useFirebase()
            await updateDoc(doc(firestore, 'docs', id), {
                ...updates,
                updatedAt: new Date()
            })
        },

        async remove(id: string) {
            const { firestore } = useFirebase()
            await deleteDoc(doc(firestore, 'docs', id))
        }
    }
})
