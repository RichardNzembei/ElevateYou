import { defineStore } from 'pinia'
import { collection, query, where, onSnapshot, addDoc, deleteDoc, doc, writeBatch, getDocs } from 'firebase/firestore'
import { ref } from 'vue'
import type { Project } from '@/types'

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
        const docRef = await addDoc(collection(firestore, 'projects'), {
            ...project,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return docRef.id
    }

    async function remove(projectId: string) {
        const { firestore } = useFirebase()
        const batch = writeBatch(firestore)
        batch.delete(doc(firestore, 'projects', projectId))

        const tasksSnap = await getDocs(
            query(collection(firestore, 'tasks'), where('projectId', '==', projectId))
        )
        tasksSnap.docs.forEach(d => batch.delete(d.ref))

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
        remove
    }
})