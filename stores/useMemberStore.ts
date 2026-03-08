// stores/useMemberStore.ts
import { defineStore } from 'pinia'
import { collection, doc, query, where, getDocs, getDoc, setDoc, deleteDoc, onSnapshot, addDoc, serverTimestamp, updateDoc, arrayUnion } from 'firebase/firestore'
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

export interface PendingInvite {
    id: string
    email: string
    workspaceId: string
    workspaceName: string
    role: Role
    invitedBy: string
    invitedAt: Date
    status: 'pending' | 'accepted' | 'cancelled'
}

// Permission definitions
const PERMISSIONS: Record<Role, string[]> = {
    owner: ['manage_workspace', 'manage_members', 'manage_projects', 'manage_tasks', 'manage_docs', 'view_all'],
    admin: ['manage_members', 'manage_projects', 'manage_tasks', 'manage_docs', 'view_all'],
    member: ['manage_tasks', 'manage_docs', 'view_all'],
    viewer: ['view_all']
}

export const useMemberStore = defineStore('member', () => {
    const { firestore, auth } = useFirebase()
    const members = ref<Map<string, Member>>(new Map())
    const loading = ref(false)
    let unsubscribe: (() => void) | null = null

    // ── Permission helpers ──────────────────────────────────────

    function hasPermission(permission: string): boolean {
        const uid = auth.currentUser?.uid
        if (!uid) return false
        const member = members.value.get(uid)
        if (!member) return false
        return PERMISSIONS[member.role]?.includes(permission) ?? false
    }

    function currentUserRole(): Role | null {
        const uid = auth.currentUser?.uid
        if (!uid) return null
        return members.value.get(uid)?.role ?? null
    }

    // ── Real-time listeners ─────────────────────────────────────

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

                // Fetch all user profiles in parallel (fixes N+1 query)
                const profilePromises = snapshot.docs.map(async (memberDoc) => {
                    const memberData = memberDoc.data()
                    const userRef = doc(firestore, 'users', memberDoc.id)
                    const userSnap = await getDoc(userRef)
                    return { memberDoc, memberData, userSnap }
                })

                const results = await Promise.all(profilePromises)

                for (const { memberDoc, memberData, userSnap } of results) {
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

    // ── Invite member (supports pending invites) ────────────────

    /**
     * Invite a member to workspace
     * If user exists → add them directly
     * If user doesn't exist → create a pending invite in the `invites` collection
     */
    async function inviteMember(
        email: string,
        workspaceId: string,
        role: Role = 'member',
        workspaceName: string = '',
        projectId?: string
    ): Promise<{ success: boolean; pending: boolean }> {
        try {
            const normalizedEmail = email.toLowerCase().trim()

            // Find user by email
            const usersRef = collection(firestore, 'users')
            const q = query(usersRef, where('email', '==', normalizedEmail))
            const snapshot = await getDocs(q)

            if (!snapshot.empty) {
                // ── User exists → add them directly ──
                const userDoc = snapshot.docs[0]
                const userData = userDoc.data()
                const userId = userDoc.id

                // Check if already a workspace member
                const existingMember = members.value.get(userId)
                if (!existingMember) {
                    // Add to workspace members
                    await setDoc(doc(firestore, 'workspaces', workspaceId, 'members', userId), {
                        email: userData.email,
                        displayName: userData.displayName || normalizedEmail.split('@')[0],
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
                }

                // Add user to the project's memberIds
                if (projectId) {
                    await updateDoc(doc(firestore, 'projects', projectId), {
                        memberIds: arrayUnion(userId)
                    })
                }

                return { success: true, pending: false }
            } else {
                // ── User doesn't exist → store a pending invite ──

                // Check if there is already a pending invite for this email + workspace + project
                const invitesRef = collection(firestore, 'invites')
                const existingInviteQuery = query(
                    invitesRef,
                    where('email', '==', normalizedEmail),
                    where('workspaceId', '==', workspaceId),
                    where('status', '==', 'pending')
                )
                const existingInvites = await getDocs(existingInviteQuery)
                if (!existingInvites.empty) {
                    // If same workspace invite exists but for a different project, update it
                    if (projectId) {
                        const existingDoc = existingInvites.docs[0]
                        const existingData = existingDoc.data()
                        const existingProjectIds = existingData.projectIds || []
                        if (!existingProjectIds.includes(projectId)) {
                            await updateDoc(doc(firestore, 'invites', existingDoc.id), {
                                projectIds: arrayUnion(projectId)
                            })
                        }
                        return { success: true, pending: true }
                    }
                    throw new Error('A pending invite already exists for this email')
                }

                const invitedByUid = auth.currentUser?.uid || 'unknown'

                await addDoc(collection(firestore, 'invites'), {
                    email: normalizedEmail,
                    workspaceId,
                    workspaceName,
                    role,
                    projectIds: projectId ? [projectId] : [],
                    invitedBy: invitedByUid,
                    invitedAt: serverTimestamp(),
                    status: 'pending'
                })

                return { success: true, pending: true }
            }
        } catch (error: any) {
            console.error('Error inviting member:', error)
            throw error
        }
    }

    // ── Pending invite management ───────────────────────────────

    /**
     * Get all pending invites for a workspace
     */
    async function getPendingInvites(workspaceId: string): Promise<PendingInvite[]> {
        try {
            const invitesRef = collection(firestore, 'invites')
            const q = query(
                invitesRef,
                where('workspaceId', '==', workspaceId),
                where('status', '==', 'pending')
            )
            const snapshot = await getDocs(q)

            return snapshot.docs.map((d) => ({
                id: d.id,
                email: d.data().email,
                workspaceId: d.data().workspaceId,
                workspaceName: d.data().workspaceName,
                role: d.data().role,
                projectIds: d.data().projectIds || [],
                invitedBy: d.data().invitedBy,
                invitedAt: d.data().invitedAt?.toDate() || new Date(),
                status: d.data().status
            }))
        } catch (error) {
            console.error('Error fetching pending invites:', error)
            return []
        }
    }

    /**
     * Cancel (delete) a pending invite
     */
    async function cancelInvite(inviteId: string): Promise<{ success: boolean }> {
        try {
            await deleteDoc(doc(firestore, 'invites', inviteId))
            return { success: true }
        } catch (error) {
            console.error('Error cancelling invite:', error)
            throw error
        }
    }

    /**
     * Called after registration to check for pending invites and auto-join workspaces.
     * Returns the number of workspaces the user was added to.
     */
    async function acceptInviteOnRegister(
        userId: string,
        email: string
    ): Promise<{ joinedCount: number; workspaceNames: string[] }> {
        const normalizedEmail = email.toLowerCase().trim()
        const workspaceNames: string[] = []

        try {
            const invitesRef = collection(firestore, 'invites')
            const q = query(
                invitesRef,
                where('email', '==', normalizedEmail),
                where('status', '==', 'pending')
            )
            const snapshot = await getDocs(q)

            for (const inviteDoc of snapshot.docs) {
                const invite = inviteDoc.data()

                // Add user to workspace members
                await setDoc(doc(firestore, 'workspaces', invite.workspaceId, 'members', userId), {
                    email: normalizedEmail,
                    displayName: normalizedEmail.split('@')[0],
                    photoURL: null,
                    role: invite.role || 'member',
                    joinedAt: new Date(),
                    isOnline: false
                })

                // Add workspace to user's workspaces
                await setDoc(doc(firestore, 'users', userId, 'workspaces', invite.workspaceId), {
                    role: invite.role || 'member',
                    joinedAt: new Date()
                })

                // Add user to each project they were invited to
                const projectIds = invite.projectIds || []
                for (const pid of projectIds) {
                    await updateDoc(doc(firestore, 'projects', pid), {
                        memberIds: arrayUnion(userId)
                    })
                }

                // Mark invite as accepted
                await setDoc(doc(firestore, 'invites', inviteDoc.id), {
                    status: 'accepted',
                    acceptedAt: serverTimestamp()
                }, { merge: true })

                workspaceNames.push(invite.workspaceName || invite.workspaceId)
            }

            return { joinedCount: snapshot.size, workspaceNames }
        } catch (error) {
            console.error('Error processing pending invites on register:', error)
            return { joinedCount: 0, workspaceNames: [] }
        }
    }

    // ── Existing member management ──────────────────────────────

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
        stopListening,
        hasPermission,
        currentUserRole,
        getPendingInvites,
        cancelInvite,
        acceptInviteOnRegister
    }
})
