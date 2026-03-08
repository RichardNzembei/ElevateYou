import { defineStore } from 'pinia'
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc, writeBatch, getDocs } from 'firebase/firestore'
import { ref } from 'vue'
import type { Project } from '~/types'

export const useProjectStore = defineStore('project', () => {
    const projects = ref<Project[]>([])
    const selectedProject = ref<Project | null>(null)
    let unsubscribe: (() => void) | null = null

    function listen(workspaceId: string) {
        if (unsubscribe) unsubscribe()

        const { firestore } = useFirebase()
        const q = query(
            collection(firestore, 'projects'),
            where('workspaceId', '==', workspaceId)
        )

        unsubscribe = onSnapshot(q, (snap) => {
            projects.value = snap.docs
                .map(d => ({ id: d.id, ...d.data() } as Project))
                .filter(p => !p.archivedAt)
                .sort((a, b) => a.name.localeCompare(b.name))

            if (!selectedProject.value && projects.value.length > 0) {
                selectedProject.value = projects.value[0]
            }
        })

        return unsubscribe
    }

    function stopListening() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
        projects.value = []
        selectedProject.value = null
    }

    async function create(project: Partial<Project>) {
        const { firestore } = useFirebase()
        const now = new Date()
        const optimistic = {
            ...project,
            id: '_temp_' + Date.now(),
            createdAt: now,
            updatedAt: now
        } as Project

        // Optimistic: show immediately
        projects.value = [...projects.value, optimistic].sort((a, b) => a.name.localeCompare(b.name))
        if (!selectedProject.value) selectedProject.value = optimistic

        try {
            const docRef = await addDoc(collection(firestore, 'projects'), {
                ...project,
                createdAt: now,
                updatedAt: now
            })
            return docRef.id
        } catch (err) {
            projects.value = projects.value.filter(p => p.id !== optimistic.id)
            if (selectedProject.value?.id === optimistic.id) selectedProject.value = projects.value[0] || null
            throw err
        }
    }

    async function update(projectId: string, updates: Partial<Project>) {
        const { firestore } = useFirebase()
        const idx = projects.value.findIndex(p => p.id === projectId)
        const previous = idx >= 0 ? { ...projects.value[idx] } : null

        // Optimistic: apply immediately
        if (idx >= 0) {
            projects.value[idx] = { ...projects.value[idx], ...updates, updatedAt: new Date() } as Project
            projects.value = [...projects.value]
            if (selectedProject.value?.id === projectId) {
                selectedProject.value = projects.value[idx]
            }
        }

        try {
            await updateDoc(doc(firestore, 'projects', projectId), {
                ...updates,
                updatedAt: new Date()
            })
        } catch (err) {
            if (previous && idx >= 0) {
                projects.value[idx] = previous as Project
                projects.value = [...projects.value]
            }
            throw err
        }
    }

    async function remove(projectId: string) {
        const { firestore } = useFirebase()
        const batch = writeBatch(firestore)
        batch.delete(doc(firestore, 'projects', projectId))

        // Clean up tasks associated with the project
        const tasksSnap = await getDocs(
            query(collection(firestore, 'tasks'), where('projectId', '==', projectId))
        )
        tasksSnap.docs.forEach(d => batch.delete(d.ref))

        // Clean up docs associated with the project
        const docsSnap = await getDocs(
            query(collection(firestore, 'docs'), where('projectId', '==', projectId))
        )
        docsSnap.docs.forEach(d => batch.delete(d.ref))

        await batch.commit()

        if (selectedProject.value?.id === projectId) {
            selectedProject.value = projects.value[0] || null
        }
    }

    return {
        projects,
        selectedProject,
        listen,
        stopListening,
        create,
        update,
        remove
    }
})
