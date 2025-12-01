// stores/useMemberStore.ts
import { defineStore } from 'pinia'
import { collection, doc, query, where, getDocs, getDoc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { useFirebase } from '~/composables/firebase-client'

export type Role = 'owner' | 'admin' | 'member' | 'viewer'

export interface Member {
    uid: string
    email: string
    displayName?: string
    photoURL?: string
    role: Role
    joinedAt: Date
    isOnline?: boolean
    lastSeen?: Date
}

export const useMemberStore = defineStore('member', () => {
    const { firestore } = useFirebase()
    const members = ref<Map<string, Member>>(new Map())
    const loading = ref(false)
    let unsubscribe: (() => void) | null = null

    /**
     * Listen to member updates (real-time)
     * Alias for loadMembers to match other stores
     */
    function listen(workspaceId: string) {
        return loadMembers(workspaceId)
    }

    /**
     * Load members for a workspace
     * Listens to workspace members and fetches their profiles
     */
    async function loadMembers(workspaceId: string) {
        if (unsubscribe) unsubscribe()

        loading.value = true

        try {
            // Listen to workspace members subcollection
            const membersRef = collection(firestore, 'workspaces', workspaceId, 'members')

            unsubscribe = onSnapshot(membersRef, async (snapshot) => {
                const newMembers = new Map<string, Member>()

                // Fetch user profiles for each member
                for (const memberDoc of snapshot.docs) {
                    const memberData = memberDoc.data()

                    // Get user profile from users collection
                    const userRef = doc(firestore, 'users', memberDoc.id)
                    const userSnap = await getDoc(userRef)

                    if (userSnap.exists()) {
                        const userData = userSnap.data()
                        newMembers.set(memberDoc.id, {
                            uid: memberDoc.id,
                            email: userData.email || memberData.email,
                            displayName: userData.displayName || memberData.displayName,
                            photoURL: userData.photoURL || memberData.photoURL,
                            role: memberData.role || 'member',
                            joinedAt: memberData.joinedAt?.toDate() || new Date(),
                            isOnline: memberData.isOnline || false,
                            lastSeen: memberData.lastSeen?.toDate()
                        })
                    } else {
                        // Fallback if user profile doesn't exist
                        newMembers.set(memberDoc.id, {
                            uid: memberDoc.id,
                            email: memberData.email || 'unknown@example.com',
                            displayName: memberData.displayName || 'Unknown User',
                            photoURL: memberData.photoURL || null,
                            role: memberData.role || 'member',
                            joinedAt: memberData.joinedAt?.toDate() || new Date(),
                            isOnline: false
                        })
                    }
                }

                members.value = newMembers
                loading.value = false
            })
        } catch (error) {
            console.error('Error loading members:', error)
            loading.value = false
        }
    }

    /**
     * Invite a member to workspace
     * The user must already have an account
     */
    async function inviteMember(email: string, workspaceId: string, role: Role = 'member') {
        try {
            const normalizedEmail = email.toLowerCase().trim()

            // Find user by email
            const usersRef = collection(firestore, 'users')
            const q = query(usersRef, where('email', '==', normalizedEmail))
            const snapshot = await getDocs(q)

            console.log('🔍 Searching for user with email:', normalizedEmail)
            console.log('📊 Found users:', snapshot.size)

            if (snapshot.empty) {
                // List all users for debugging
                const allUsersSnap = await getDocs(collection(firestore, 'users'))
                console.log('👥 All users in database:')
                allUsersSnap.forEach(doc => {
                    console.log(`  - ${doc.id}: ${doc.data().email}`)
                })
                throw new Error(`User with email "${email}" not found. They need to create an account first.`)
            }

            const userDoc = snapshot.docs[0]
            const userData = userDoc.data()
            const userId = userDoc.id

            console.log('✅ Found user:', userId, userData.email)

            // Check if already a member
            const existingMember = members.value.get(userId)
            if (existingMember) {
                throw new Error('User is already a member of this workspace')
            }

            // Add to workspace members
            await setDoc(doc(firestore, 'workspaces', workspaceId, 'members', userId), {
                email: userData.email,
                displayName: userData.displayName || email.split('@')[0],
                photoURL: userData.photoURL || null,
                role,
                joinedAt: new Date(),
                isOnline: false
            })

            // Add workspace to user's workspaces
            await setDoc(doc(firestore, 'users', userId, 'workspaces', workspaceId), {
                role,
                joinedAt: new Date()
            })

            console.log('🎉 Successfully invited user to workspace')

            return { success: true, userId }
        } catch (error: any) {
            console.error('❌ Error inviting member:', error)
            throw error
        }
    }

    /**
     * Update member role
     */
    async function updateMemberRole(workspaceId: string, userId: string, newRole: Role) {
        try {
            await setDoc(doc(firestore, 'workspaces', workspaceId, 'members', userId), {
                role: newRole
            }, { merge: true })

            await setDoc(doc(firestore, 'users', userId, 'workspaces', workspaceId), {
                role: newRole
            }, { merge: true })

            return { success: true }
        } catch (error) {
            console.error('Error updating role:', error)
            throw error
        }
    }

    /**
     * Remove member from workspace
     */
    async function removeMember(workspaceId: string, userId: string) {
        try {
            await deleteDoc(doc(firestore, 'workspaces', workspaceId, 'members', userId))
            await deleteDoc(doc(firestore, 'users', userId, 'workspaces', workspaceId))

            // Remove from local map
            members.value.delete(userId)

            return { success: true }
        } catch (error) {
            console.error('Error removing member:', error)
            throw error
        }
    }

    /**
     * Get member by ID
     */
    function getMember(userId: string): Member | undefined {
        return members.value.get(userId)
    }

    /**
     * Get all members as array
     */
    const membersList = computed(() => {
        return Array.from(members.value.values()).sort((a, b) => {
            // Owner first
            if (a.role === 'owner') return -1
            if (b.role === 'owner') return 1
            // Then by role
            const roleOrder = { admin: 1, member: 2, viewer: 3 }
            return (roleOrder[a.role as keyof typeof roleOrder] || 999) -
                (roleOrder[b.role as keyof typeof roleOrder] || 999)
        })
    })

    /**
     * Stop listening to member updates
     */
    function stopListening() {
        if (unsubscribe) {
            unsubscribe()
            unsubscribe = null
        }
        members.value.clear()
        loading.value = false
    }

    return {
        members,
        membersList,
        loading,
        listen,
        loadMembers,
        inviteMember,
        updateMemberRole,
        removeMember,
        getMember,
        stopListening
    }
})