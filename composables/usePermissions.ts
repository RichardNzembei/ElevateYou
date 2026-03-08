// composables/usePermissions.ts
import { useMemberStore } from '~/stores/useMemberStore'

export const usePermissions = () => {
    const memberStore = useMemberStore()

    const canManageWorkspace = computed(() => memberStore.hasPermission('manage_workspace'))
    const canManageMembers = computed(() => memberStore.hasPermission('manage_members'))
    const canManageProjects = computed(() => memberStore.hasPermission('manage_projects'))
    const canManageTasks = computed(() => memberStore.hasPermission('manage_tasks'))
    const canManageDocs = computed(() => memberStore.hasPermission('manage_docs'))
    const canView = computed(() => memberStore.hasPermission('view_all'))
    const isOwner = computed(() => memberStore.currentUserRole() === 'owner')
    const isAdmin = computed(() => ['owner', 'admin'].includes(memberStore.currentUserRole() || ''))

    return {
        canManageWorkspace,
        canManageMembers,
        canManageProjects,
        canManageTasks,
        canManageDocs,
        canView,
        isOwner,
        isAdmin
    }
}
