import { defineStore } from 'pinia'
import { collection, query, where, onSnapshot, addDoc, updateDoc, doc, getDoc, getDocs, setDoc, deleteDoc, writeBatch } from 'firebase/firestore'
import { ref } from 'vue'
import type { Workspace } from '@/types'

export const useWorkspaceStore = defineStore('workspace', () => {
    const { firestore } = useFirebase()
    const workspaces = ref<Workspace[]>([])
    const currentWorkspace = ref<Workspace | null>(null)
    const loading = ref(true)
    let unsubscribeOwned: (() => void) | null = null
    let unsubscribeMember: (() => void) | null = null

    function listen(userId: string) {
        if (unsubscribeOwned) unsubscribeOwned()
        if (unsubscribeMember) unsubscribeMember()
        loading.value = true

        const ownedMap = new Map<string, Workspace>()
        const memberMap = new Map<string, Workspace>()
        let ownedReady = false
        let memberReady = false

        const mergeWorkspaces = () => {
            const merged = new Map([...ownedMap, ...memberMap])
            workspaces.value = Array.from(merged.values())
            if (!currentWorkspace.value && workspaces.value.length > 0) {
                currentWorkspace.value = workspaces.value[0]
            }
            // Only set loading=false once both listeners have fired at least once
            if (ownedReady && memberReady) {
                loading.value = false
            }
        }

        // Listen to owned workspaces
        const ownedQuery = query(
            collection(firestore, 'workspaces'),
            where('ownerId', '==', userId)
        )

        unsubscribeOwned = onSnapshot(ownedQuery, (snap) => {
            ownedMap.clear()
            snap.docs.forEach(d => ownedMap.set(d.id, { id: d.id, ...d.data() } as Workspace))
            ownedReady = true
            mergeWorkspaces()
        })

        // Listen to workspaces where user is a member (via user's workspaces subcollection)
        const memberWsRef = collection(firestore, 'users', userId, 'workspaces')
        unsubscribeMember = onSnapshot(memberWsRef, async (snap) => {
            memberMap.clear()
            const fetches = snap.docs.map(async (wsDoc) => {
                const wsId = wsDoc.id
                if (ownedMap.has(wsId)) return // skip already tracked owned workspaces
                const wsSnap = await getDoc(doc(firestore, 'workspaces', wsId))
                if (wsSnap.exists()) {
                    memberMap.set(wsId, { id: wsId, ...wsSnap.data() } as Workspace)
                }
            })
            await Promise.all(fetches)
            memberReady = true
            mergeWorkspaces()
        })

        return () => {
            if (unsubscribeOwned) unsubscribeOwned()
            if (unsubscribeMember) unsubscribeMember()
        }
    }

    function stopListening() {
        if (unsubscribeOwned) { unsubscribeOwned(); unsubscribeOwned = null }
        if (unsubscribeMember) { unsubscribeMember(); unsubscribeMember = null }
        workspaces.value = []
        currentWorkspace.value = null
        loading.value = true
    }

    async function create(name: string, userId: string) {
        const { auth } = useFirebase()
        const user = auth.currentUser

        const docRef = await addDoc(collection(firestore, 'workspaces'), {
            name,
            ownerId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        })

        // Add creator as owner in the members subcollection
        await setDoc(doc(firestore, 'workspaces', docRef.id, 'members', userId), {
            email: user?.email || '',
            displayName: user?.displayName || user?.email?.split('@')[0] || '',
            photoURL: user?.photoURL || null,
            role: 'owner',
            joinedAt: new Date(),
            isOnline: true
        })

        // Add workspace to user's workspaces subcollection
        await setDoc(doc(firestore, 'users', userId, 'workspaces', docRef.id), {
            role: 'owner',
            joinedAt: new Date()
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

    async function remove(workspaceId: string) {
        const batch = writeBatch(firestore)

        // Delete all projects in this workspace
        const projectsSnap = await getDocs(query(collection(firestore, 'projects'), where('workspaceId', '==', workspaceId)))
        for (const pDoc of projectsSnap.docs) {
            // Delete tasks for each project
            const tasksSnap = await getDocs(query(collection(firestore, 'tasks'), where('projectId', '==', pDoc.id)))
            tasksSnap.docs.forEach(t => batch.delete(t.ref))
            batch.delete(pDoc.ref)
        }

        // Delete docs in this workspace
        const docsSnap = await getDocs(query(collection(firestore, 'docs'), where('workspaceId', '==', workspaceId)))
        docsSnap.docs.forEach(d => batch.delete(d.ref))

        // Delete activity in this workspace
        const activitySnap = await getDocs(query(collection(firestore, 'activity'), where('workspaceId', '==', workspaceId)))
        activitySnap.docs.forEach(a => batch.delete(a.ref))

        // Delete pending invites for this workspace
        const invitesSnap = await getDocs(query(collection(firestore, 'invites'), where('workspaceId', '==', workspaceId)))
        invitesSnap.docs.forEach(i => batch.delete(i.ref))

        // Delete members subcollection
        const membersSnap = await getDocs(collection(firestore, 'workspaces', workspaceId, 'members'))
        for (const mDoc of membersSnap.docs) {
            batch.delete(mDoc.ref)
            // Remove workspace from each member's workspaces subcollection
            batch.delete(doc(firestore, 'users', mDoc.id, 'workspaces', workspaceId))
        }

        // Delete workspace doc itself
        batch.delete(doc(firestore, 'workspaces', workspaceId))

        await batch.commit()

        // Switch to another workspace
        if (currentWorkspace.value?.id === workspaceId) {
            currentWorkspace.value = workspaces.value.find(w => w.id !== workspaceId) || null
        }
    }

    return {
        workspaces,
        currentWorkspace,
        loading,
        listen,
        stopListening,
        create,
        update,
        remove
    }
})