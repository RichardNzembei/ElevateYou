<template>
  <div class="min-h-screen bg-[#fafafa] text-neutral-900">
    <!-- Sidebar -->
    <DashboardSidebar
      :collapsed="sidebarCollapsed"
      :mobile-open="mobileSidebarOpen"
      :active-view="activeView"
      :workspaces="workspaceStore.workspaces"
      :current-workspace="workspaceStore.currentWorkspace"
      :projects="projectStore.projects"
      :selected-project-id="projectStore.selectedProject?.id || null"
      :user-id="user?.uid || ''"
      :user-initials="userInitials"
      :user-email="user?.email || ''"
      :user-role="currentUserRole || 'member'"
      @toggle-collapse="sidebarCollapsed = !sidebarCollapsed"
      @close-mobile="mobileSidebarOpen = false"
      @navigate="activeView = $event"
      @workspace-change="onWorkspaceChange($event)"
      @new-project="showNewProjectModal = true"
      @select-project="selectProject($event)"
      @new-task="showNewTaskModal = true"
      @open-settings="showSettings = true"
      @logout="logout"
    />

    <!-- Main area -->
    <div :class="sidebarCollapsed ? 'lg:pl-[52px]' : 'lg:pl-[220px]'" class="transition-all duration-200">
      <!-- Top bar -->
      <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/60">
        <div class="flex items-center justify-between h-11 px-4 sm:px-5 lg:px-6">
          <div class="flex items-center gap-2">
            <button @click="mobileSidebarOpen = true" class="lg:hidden p-1.5 rounded-md hover:bg-neutral-100 text-neutral-500 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>

            <nav class="flex items-center gap-1.5 text-[12px]">
              <span class="text-neutral-400 hidden sm:inline">{{ workspaceStore.currentWorkspace?.name }}</span>
              <svg v-if="projectStore.selectedProject" class="w-3.5 h-3.5 text-neutral-300 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              <span v-if="projectStore.selectedProject" class="font-semibold text-neutral-900 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full" :style="{ backgroundColor: projectStore.selectedProject.color }"></span>
                {{ projectStore.selectedProject.name }}
              </span>
              <span v-else class="font-semibold text-neutral-900">Dashboard</span>
            </nav>
          </div>

          <div class="flex items-center gap-2">
            <button @click="showSearch = !showSearch" class="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <button v-if="projectStore.selectedProject && canManageTasks" @click="showNewTaskModal = true" class="btn-primary hidden sm:flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
              New Task
            </button>
          </div>
        </div>

        <!-- Search bar -->
        <Transition name="slide-down">
          <div v-if="showSearch" class="px-4 sm:px-5 lg:px-6 pb-2.5">
            <div class="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 max-w-sm">
              <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input v-model="taskStore.searchQuery" ref="searchInput" type="text" placeholder="Search tasks..." class="bg-transparent outline-none flex-1 text-[12px] placeholder:text-neutral-400" />
              <button @click="showSearch = false; taskStore.searchQuery = ''" class="text-neutral-400 hover:text-neutral-600 transition-colors p-0.5">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
        </Transition>
      </header>

      <!-- Content -->
      <div class="px-4 sm:px-5 lg:px-6 py-4 max-w-[1280px]">
        <!-- No Project Selected -->
        <div v-if="!projectStore.selectedProject" class="flex items-center justify-center" style="min-height: calc(100vh - 160px)">
          <div class="text-center max-w-xs">
            <div class="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <svg class="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
              </svg>
            </div>
            <h2 class="text-[14px] font-bold text-neutral-900 mb-1">Select or create a project</h2>
            <p class="text-[12px] text-neutral-500 mb-4 leading-relaxed">Projects organize your tasks, docs, and team.</p>
            <button v-if="canManageProjects" @click="showNewProjectModal = true" class="btn-primary">
              Create Project
            </button>
          </div>
        </div>

        <!-- Project Selected -->
        <div v-else>
          <!-- View tabs -->
          <div class="flex items-center justify-between mb-4">
            <div class="flex gap-0.5 bg-neutral-100/80 p-0.5 rounded-md">
              <button
                  v-for="tab in viewTabs"
                  :key="tab.value"
                  @click="activeView = tab.value"
                  :class="activeView === tab.value
                    ? 'bg-white shadow-sm text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-700'"
                  class="px-2.5 py-1 rounded text-[11px] font-medium transition-all duration-150"
              >{{ tab.label }}</button>
            </div>
            <div class="flex items-center gap-3">
              <span class="text-[11px] text-neutral-400 tabular-nums">{{ allProjectTasks.length }} task{{ allProjectTasks.length !== 1 ? 's' : '' }}</span>
              <div v-if="allProjectTasks.length > 0" class="flex items-center gap-1.5">
                <div class="w-20 h-1 bg-neutral-100 rounded-full overflow-hidden">
                  <div class="h-full bg-neutral-900 rounded-full transition-all duration-500" :style="{ width: completionPercent + '%' }"></div>
                </div>
                <span class="text-[11px] font-semibold text-neutral-900 tabular-nums">{{ completionPercent }}%</span>
              </div>
            </div>
          </div>

          <!-- OVERVIEW -->
          <ProjectOverview
              v-if="activeView === 'overview'"
              :project="projectStore.selectedProject"
              :tasks="allProjectTasks"
              :members="memberStore.membersList"
              @edit-project="showEditProjectModal = true"
              @new-task="showNewTaskModal = true"
              @view-task="openTaskDetail"
          />

          <!-- TASKS -->
          <div v-if="activeView === 'tasks'">
            <div class="flex items-center justify-between mb-3">
              <div class="flex gap-0.5 bg-neutral-100/80 p-0.5 rounded-md">
                <button @click="taskViewMode = 'list'" :class="taskViewMode === 'list' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'" class="px-2.5 py-1 rounded text-[11px] font-medium transition-all">List</button>
                <button @click="taskViewMode = 'board'" :class="taskViewMode === 'board' ? 'bg-white shadow-sm text-neutral-900' : 'text-neutral-500'" class="px-2.5 py-1 rounded text-[11px] font-medium transition-all">Board</button>
              </div>
              <span class="text-[11px] text-neutral-400 tabular-nums">{{ filteredProjectTasks.length }} of {{ allProjectTasks.length }}</span>
            </div>

            <TaskListView
                v-if="taskViewMode === 'list'"
                :tasks="filteredProjectTasks"
                @edit="openTaskDetail"
                @delete="deleteTask"
                @update-status="updateTaskStatus"
            />
            <KanbanBoard
                v-if="taskViewMode === 'board'"
                @edit-task="openTaskDetail"
                @quick-add="showNewTaskModal = true"
            />
          </div>

          <!-- DOCS -->
          <div v-if="activeView === 'docs'" class="flex flex-col lg:flex-row gap-3" style="min-height: calc(100vh - 160px)">
            <div class="w-full lg:w-48 card p-2.5 flex-shrink-0">
              <div class="flex items-center justify-between mb-2 px-1">
                <span class="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Documents</span>
                <button v-if="canManageDocs" @click="showNewDocModal = true" class="text-neutral-400 hover:text-neutral-700 transition-colors">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                </button>
              </div>
              <DocsSidebar @select-doc="openDoc" @create-root="createNewRootDoc" @create-child="createNewChildDoc" />
            </div>
            <div class="flex-1 card overflow-hidden">
              <DocEditor
                  v-if="currentDoc && currentDoc.id"
                  :doc-id="currentDoc.id"
                  :title="currentDoc.title || 'Untitled'"
                  :content="currentDoc.content || ''"
                  @save="saveDoc"
              />
              <div v-else class="h-full flex items-center justify-center text-neutral-300 min-h-[300px]">
                <div class="text-center">
                  <svg class="w-8 h-8 mx-auto mb-2 text-neutral-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  <p class="text-[11px] text-neutral-400">Select or create a document</p>
                </div>
              </div>
            </div>
          </div>

          <!-- MEMBERS -->
          <MembersView
              v-if="activeView === 'members'"
              :members="projectMembers"
              :pending-invites="projectPendingInvites"
              :can-manage-members="canManageMembers"
              :project-name="projectStore.selectedProject?.name || ''"
              @invite="showInviteModal = true"
              @update-role="updateMemberRole"
              @remove-member="removeMember"
              @cancel-invite="cancelInvite"
          />

          <!-- ACTIVITY -->
          <ActivityFeed
              v-if="activeView === 'activity'"
              :activities="activityStore.activities"
          />
        </div>
      </div>
    </div>

    <!-- Task Detail Panel -->
    <TaskDetailPanel
      v-model="showTaskDetail"
      :task="selectedTask"
      :members="memberStore.membersList"
      @update-task="handleTaskDetailUpdate"
      @delete-task="deleteTask"
    />

    <!-- Settings Panel -->
    <SettingsPanel
      v-model="showSettings"
      :workspace="workspaceStore.currentWorkspace"
      :user-role="currentUserRole || 'member'"
      @update-workspace="updateWorkspace"
      @delete-workspace="deleteWorkspace"
    />

    <!-- Modals -->
    <ProjectCreateModal v-model="showNewProjectModal" :loading="loading" @create="createProject" />

    <Modal v-model="showEditProjectModal" title="Edit Project">
      <div v-if="projectStore.selectedProject" class="space-y-3.5">
        <div>
          <label class="block text-[11px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Project Name</label>
          <input v-model="editProjectForm.name" class="input-field" />
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Description</label>
          <textarea v-model="editProjectForm.description" rows="2" class="input-field resize-none" placeholder="What is this project about?"></textarea>
        </div>
        <div>
          <label class="block text-[11px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Color</label>
          <div class="flex items-center gap-2.5">
            <input v-model="editProjectForm.color" type="color" class="w-8 h-8 rounded-md border border-neutral-200 cursor-pointer p-0.5" />
            <div class="flex gap-1.5 flex-wrap">
              <button v-for="c in presetColors" :key="c" @click="editProjectForm.color = c" class="w-6 h-6 rounded-full border-2 transition-all hover:scale-110" :class="editProjectForm.color === c ? 'border-neutral-900 scale-110' : 'border-transparent'" :style="{ backgroundColor: c }"></button>
            </div>
          </div>
        </div>
        <div class="flex gap-2 pt-1">
          <button @click="updateProject" :disabled="loading" class="flex-1 btn-primary disabled:opacity-50">Save Changes</button>
          <button @click="showEditProjectModal = false" class="flex-1 btn-secondary">Cancel</button>
        </div>
      </div>
    </Modal>

    <TaskCreateModal v-model="showNewTaskModal" :loading="loading" :members="memberStore.membersList" @create="createTask" />

    <Modal v-model="showNewDocModal" title="New Document">
      <div class="space-y-3.5">
        <div>
          <label class="block text-[11px] font-semibold text-neutral-500 mb-1 uppercase tracking-wide">Document Title</label>
          <input v-model="newDocTitle" placeholder="Enter a title..." class="input-field" @keyup.enter="createNewRootDocFromModal" />
        </div>
        <button @click="createNewRootDocFromModal" :disabled="!newDocTitle.trim()" class="w-full btn-primary disabled:opacity-50">Create Document</button>
      </div>
    </Modal>

    <MemberInviteModal
      ref="inviteModalRef"
      v-model="showInviteModal"
      :pending-invites="projectPendingInvites"
      :project-name="projectStore.selectedProject?.name || ''"
      @invite="sendInvites"
      @cancel-invite="cancelInvite"
    />

    <ToastNotification :success-message="successMessage" :error-message="errorMessage" />
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useMemberStore } from '@/stores/useMemberStore'
import { useDocStore } from '@/stores/useDocStore'
import { useActivityStore } from '@/stores/useActivityStore'
import { useFirebase } from '@/composables/firebase-client'
import type { Doc, Task } from '@/types'

import DashboardSidebar from '@/components/layout/DashboardSidebar.vue'
import TaskListView from '@/components/dashboard/TaskListView.vue'
import KanbanBoard from '@/components/task/KanbanBoard.vue'
import TaskDetailPanel from '@/components/task/TaskDetailPanel.vue'
import ProjectOverview from '@/components/project/ProjectOverview.vue'
import MembersView from '@/components/member/MembersView.vue'
import ActivityFeed from '@/components/activity/ActivityFeed.vue'
import SettingsPanel from '@/components/settings/SettingsPanel.vue'
import DocEditor from '@/components/docs/DocEditor.vue'
import DocsSidebar from '@/components/docs/DocsSidebar.vue'
import Modal from '@/components/ui/Modal.vue'
import ProjectCreateModal from '@/components/project/ProjectCreateModal.vue'
import TaskCreateModal from '@/components/task/TaskCreateModal.vue'
import MemberInviteModal from '@/components/member/MemberInviteModal.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'

definePageMeta({ layout: 'dashboard', ssr: false })

const { auth } = useFirebase()
const router = useRouter()
const workspaceStore = useWorkspaceStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const memberStore = useMemberStore()
const docStore = useDocStore()
const activityStore = useActivityStore()

// UI State
const sidebarCollapsed = ref(false)
const mobileSidebarOpen = ref(false)
const showNewProjectModal = ref(false)
const showEditProjectModal = ref(false)
const showNewTaskModal = ref(false)
const showNewDocModal = ref(false)
const showInviteModal = ref(false)
const showTaskDetail = ref(false)
const showSettings = ref(false)
const showSearch = ref(false)
const selectedTask = ref<any>(null)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const activeView = ref<string>('overview')
const taskViewMode = ref<string>('list')
const newDocTitle = ref('')
const currentDoc = ref<Doc | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)
const pendingInvites = ref<any[]>([])
const inviteModalRef = ref<any>(null)

const presetColors = ['#171717', '#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4']
const editProjectForm = ref({ name: '', description: '', color: '#171717' })

const viewTabs = [
  { value: 'overview', label: 'Overview' },
  { value: 'tasks', label: 'Tasks' },
  { value: 'docs', label: 'Docs' },
  { value: 'members', label: 'Team' },
  { value: 'activity', label: 'Activity' }
]

const user = computed(() => auth.currentUser)
const userInitials = computed(() => user.value?.email?.[0].toUpperCase() || 'U')
const currentUserRole = computed(() => memberStore.currentUserRole())

// Permissions
const canManageMembers = computed(() => memberStore.hasPermission('manage_members'))
const canManageProjects = computed(() => memberStore.hasPermission('manage_projects'))
const canManageTasks = computed(() => memberStore.hasPermission('manage_tasks'))
const canManageDocs = computed(() => memberStore.hasPermission('manage_docs'))

// Project members — filter workspace members to only those in the current project's memberIds
const projectMembers = computed(() => {
  const project = projectStore.selectedProject
  if (!project || !project.memberIds || project.memberIds.length === 0) {
    return memberStore.membersList
  }
  return memberStore.membersList.filter(m => project.memberIds!.includes(m.uid))
})

// Project pending invites — filter to invites that include the current project
const projectPendingInvites = computed(() => {
  const project = projectStore.selectedProject
  if (!project) return pendingInvites.value
  return pendingInvites.value.filter(inv => {
    if (!inv.projectIds || inv.projectIds.length === 0) return true
    return inv.projectIds.includes(project.id)
  })
})

const allProjectTasks = computed(() => {
  if (!projectStore.selectedProject) return []
  return taskStore.tasks.filter(t => t.projectId === projectStore.selectedProject!.id)
})

const filteredProjectTasks = computed(() => {
  if (!projectStore.selectedProject) return []
  return taskStore.filteredTasks.filter(t => t.projectId === projectStore.selectedProject!.id)
})

const completionPercent = computed(() => {
  if (allProjectTasks.value.length === 0) return 0
  return Math.round((allProjectTasks.value.filter(t => t.status === 'done').length / allProjectTasks.value.length) * 100)
})

const loadPendingInvites = async () => {
  if (!workspaceStore.currentWorkspace) return
  try {
    pendingInvites.value = await memberStore.getPendingInvites(workspaceStore.currentWorkspace.id)
  } catch { pendingInvites.value = [] }
}

// Watchers
watch(() => workspaceStore.currentWorkspace, (ws) => {
  if (ws) {
    docStore.listen(ws.id)
    memberStore.listen(ws.id)
    activityStore.listen(ws.id)
    loadPendingInvites()
  }
}, { immediate: true })

watch(showEditProjectModal, (val) => {
  if (val && projectStore.selectedProject) {
    editProjectForm.value = {
      name: projectStore.selectedProject.name,
      description: (projectStore.selectedProject as any).description || '',
      color: projectStore.selectedProject.color
    }
  }
})

watch(showSearch, (val) => {
  if (val) nextTick(() => searchInput.value?.focus())
})

// Navigation
const selectProject = (project: any) => {
  projectStore.selectedProject = project
  activeView.value = 'overview'
  mobileSidebarOpen.value = false
}

// Task actions
const openTaskDetail = (task: Task) => {
  selectedTask.value = { ...task }
  showTaskDetail.value = true
}

const handleTaskDetailUpdate = async (data: any) => {
  if (!data?.id) return
  try {
    const { id, ...updates } = data
    await taskStore.update(id, updates)
  } catch { showError('Failed to update task') }
}

// Doc actions
const openDoc = (doc: Doc) => {
  currentDoc.value = doc
  activeView.value = 'docs'
}

const saveDoc = async (data: { title: string; content: string }) => {
  if (!currentDoc.value?.id) return showError('No document selected')
  try {
    await docStore.update(currentDoc.value.id, data)
    showSuccess('Saved')
  } catch { showError('Failed to save document') }
}

const createNewRootDoc = async () => {
  if (!workspaceStore.currentWorkspace || !user.value) return
  try {
    const id = await docStore.create({
      workspaceId: workspaceStore.currentWorkspace.id,
      projectId: projectStore.selectedProject?.id || null,
      title: 'New Document',
      content: '<h1>New Document</h1><p>Start writing...</p>',
      order: docStore.docs.length,
      createdBy: user.value.uid
    })
    const newDoc = docStore.docs.find(d => d.id === id)
    if (newDoc) openDoc(newDoc)
    logActivity('doc_created', 'New Document')
  } catch { showError('Failed to create document') }
}

const createNewChildDoc = async (parentId: string) => {
  if (!workspaceStore.currentWorkspace || !user.value) return
  try {
    const id = await docStore.create({
      workspaceId: workspaceStore.currentWorkspace.id,
      projectId: projectStore.selectedProject?.id || null,
      parentId,
      title: 'New Page',
      content: '<p>Start writing...</p>',
      order: 0,
      createdBy: user.value.uid,
      isFolder: false
    })
    const newDoc = docStore.docs.find(d => d.id === id)
    if (newDoc) openDoc(newDoc)
  } catch { showError('Failed to create page') }
}

const createNewRootDocFromModal = async () => {
  if (!newDocTitle.value.trim() || !workspaceStore.currentWorkspace || !user.value) return
  try {
    const title = newDocTitle.value.trim()
    const id = await docStore.create({
      workspaceId: workspaceStore.currentWorkspace.id,
      projectId: projectStore.selectedProject?.id || null,
      title,
      content: `<h1>${title}</h1><p>Start writing...</p>`,
      order: docStore.docs.length,
      createdBy: user.value.uid,
      isFolder: false
    })
    const newDoc = docStore.docs.find(d => d.id === id)
    if (newDoc) { openDoc(newDoc); newDocTitle.value = ''; showNewDocModal.value = false }
    logActivity('doc_created', title)
  } catch { showError('Failed to create document') }
}

// Member actions
const sendInvites = async (invites: { email: string; role: string }[]) => {
  if (!workspaceStore.currentWorkspace) return showError('No workspace selected')
  if (!projectStore.selectedProject) return showError('No project selected')
  let successCount = 0
  const pendingResults: { email: string; inviteId: string }[] = []
  for (const inv of invites) {
    try {
      const result = await memberStore.inviteMember(
        inv.email,
        workspaceStore.currentWorkspace.id,
        inv.role as any,
        workspaceStore.currentWorkspace.name || 'Workspace',
        projectStore.selectedProject.id
      )
      // Send email notification
      const inviteUrl = result.inviteId
        ? `${window.location.origin}/invite/${result.inviteId}`
        : `${window.location.origin}/dashboard`
      try {
        await $fetch('/api/send-invite', {
          method: 'POST',
          body: {
            to: inv.email,
            inviteUrl,
            workspaceName: workspaceStore.currentWorkspace.name,
            projectName: projectStore.selectedProject.name,
            role: inv.role,
            inviterName: user.value?.displayName || user.value?.email || 'A teammate'
          }
        })
      } catch (emailErr) {
        console.warn('Email send failed:', emailErr)
      }

      if (result.pending && result.inviteId) {
        pendingResults.push({ email: inv.email, inviteId: result.inviteId })
      } else {
        successCount++
      }
      logActivity('member_invited', inv.email)
    } catch (err: any) {
      showError(err.message || `Failed to invite ${inv.email}`)
    }
  }
  if (successCount > 0) showSuccess(`${successCount} member${successCount > 1 ? 's' : ''} added to project!`)
  if (pendingResults.length > 0) {
    showSuccess(`Invite${pendingResults.length > 1 ? 's' : ''} sent!`)
    inviteModalRef.value?.setInviteResults(pendingResults)
  } else {
    showInviteModal.value = false
  }
  loadPendingInvites()
}

const cancelInvite = async (inviteId: string) => {
  try {
    await memberStore.cancelInvite(inviteId)
    showSuccess('Invite cancelled')
    loadPendingInvites()
  } catch { showError('Failed to cancel invite') }
}

const updateMemberRole = async (userId: string, newRole: string) => {
  if (!workspaceStore.currentWorkspace) return
  try {
    await memberStore.updateMemberRole(workspaceStore.currentWorkspace.id, userId, newRole as any)
    showSuccess('Role updated')
  } catch { showError('Failed to update role') }
}

const removeMember = async (userId: string) => {
  if (!workspaceStore.currentWorkspace) return
  if (!projectStore.selectedProject) return
  if (!confirm('Remove this member from the project?')) return
  try {
    // Remove from project memberIds
    await projectStore.removeMember(projectStore.selectedProject.id, userId)
    showSuccess('Member removed from project')
  } catch { showError('Failed to remove member') }
}

// Workspace
const updateWorkspace = async (updates: any) => {
  if (!workspaceStore.currentWorkspace) return
  try {
    await workspaceStore.update(workspaceStore.currentWorkspace.id, updates)
    showSuccess('Workspace updated')
  } catch { showError('Failed to update workspace') }
}

const deleteWorkspace = async () => {
  if (!workspaceStore.currentWorkspace) return
  try {
    await workspaceStore.remove(workspaceStore.currentWorkspace.id)
    showSuccess('Workspace deleted')
    showSettings.value = false
    // If no workspaces left, create a new default one
    if (workspaceStore.workspaces.length === 0 && user.value) {
      const name = user.value.displayName || user.value.email?.split('@')[0] || 'My'
      await workspaceStore.create(`${name}'s Workspace`, user.value.uid)
    }
  } catch { showError('Failed to delete workspace') }
}

// Lifecycle
// One-time fix: ensure current user is in workspace members + project memberIds
const migrateWorkspaceMembership = async (workspace: any) => {
  if (!user.value) return
  const { doc, getDoc, setDoc, collection, getDocs, query, where, updateDoc, arrayUnion } = await import('firebase/firestore')
  const { firestore } = useFirebase()
  const uid = user.value.uid
  const isOwner = workspace.ownerId === uid

  // Fix workspace membership — ensure user is in members subcollection
  const memberRef = doc(firestore, 'workspaces', workspace.id, 'members', uid)
  const memberSnap = await getDoc(memberRef)
  if (!memberSnap.exists() && isOwner) {
    await setDoc(memberRef, {
      email: user.value.email || '',
      displayName: user.value.displayName || user.value.email?.split('@')[0] || '',
      photoURL: user.value.photoURL || null,
      role: 'owner',
      joinedAt: new Date(),
      isOnline: true
    })
    await setDoc(doc(firestore, 'users', uid, 'workspaces', workspace.id), {
      role: 'owner',
      joinedAt: new Date()
    }, { merge: true })
  }

  // Fix project membership
  const projectsSnap = await getDocs(
    query(collection(firestore, 'projects'), where('workspaceId', '==', workspace.id))
  )
  for (const pDoc of projectsSnap.docs) {
    const data = pDoc.data()
    if (isOwner) {
      // Owner should be in all projects
      if (!data.memberIds || !data.memberIds.includes(uid)) {
        await updateDoc(doc(firestore, 'projects', pDoc.id), {
          memberIds: arrayUnion(uid)
        })
      }
    } else if (memberSnap.exists()) {
      // Invited member with no project memberIds — add to all projects (legacy fix)
      // This handles invites made before project-level membership was added
      if (!data.memberIds || data.memberIds.length === 0) {
        await updateDoc(doc(firestore, 'projects', pDoc.id), {
          memberIds: arrayUnion(uid, workspace.ownerId)
        })
      }
    }
  }
}

onMounted(async () => {
  const { authReady } = useFirebase()
  await authReady
  if (!user.value) return router.push('/login')

  // Process any pending invites on every dashboard load (handles auto-login via persistence)
  try {
    await memberStore.acceptInviteOnRegister(user.value.uid, user.value.email!)
  } catch (e) {
    console.error('Error processing pending invites:', e)
  }

  workspaceStore.listen(user.value.uid)

  watch(() => workspaceStore.loading, async (isLoading) => {
    if (!isLoading && workspaceStore.workspaces.length === 0) {
      const name = user.value!.displayName || user.value!.email?.split('@')[0] || 'My'
      await workspaceStore.create(`${name}'s Workspace`, user.value!.uid)
    }
  }, { immediate: true })

  watch(() => workspaceStore.currentWorkspace, async (workspace) => {
    if (workspace) {
      await migrateWorkspaceMembership(workspace)
      projectStore.listen(workspace.id)
      taskStore.listen(workspace.id)
    }
  }, { immediate: true })
})

const onWorkspaceChange = (event: any) => {
  const wsId = event?.target?.value || event
  const ws = workspaceStore.workspaces.find(w => w.id === wsId)
  if (ws) {
    workspaceStore.currentWorkspace = ws
    projectStore.listen(ws.id)
    taskStore.listen(ws.id)
  }
}

// Project CRUD
const createProject = async (form: any) => {
  if (!workspaceStore.currentWorkspace) return showError('No workspace selected')
  loading.value = true
  try {
    await projectStore.create({ name: form.name, color: form.color, description: form.description || '', workspaceId: workspaceStore.currentWorkspace.id })
    showSuccess('Project created!')
    showNewProjectModal.value = false
    logActivity('project_created', form.name)
  } catch { showError('Failed to create project') }
  finally { loading.value = false }
}

const updateProject = async () => {
  if (!projectStore.selectedProject) return
  loading.value = true
  try {
    await projectStore.update(projectStore.selectedProject.id, editProjectForm.value)
    showSuccess('Project updated')
    showEditProjectModal.value = false
  } catch { showError('Failed to update project') }
  finally { loading.value = false }
}

// Task CRUD
const createTask = async (form: any) => {
  if (!projectStore.selectedProject || !workspaceStore.currentWorkspace) return showError('Select a project first')
  loading.value = true
  try {
    await taskStore.create({
      title: form.title, description: form.description, priority: form.priority as any,
      status: (form.status || 'todo') as any, dueDate: form.dueDate || null,
      estimatedHours: form.estimatedHours || undefined, assigneeIds: form.assigneeIds || [],
      projectId: projectStore.selectedProject.id, workspaceId: workspaceStore.currentWorkspace.id,
      createdBy: user.value?.uid || ''
    })
    showSuccess('Task created!')
    showNewTaskModal.value = false
    logActivity('task_created', form.title)
  } catch { showError('Failed to create task') }
  finally { loading.value = false }
}

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  try {
    await taskStore.update(taskId, { status: newStatus as any })
    if (newStatus === 'done') logActivity('task_completed', '')
  } catch { showError('Failed to update status') }
}

const deleteTask = async (taskId: string) => {
  if (!confirm('Delete this task?')) return
  try {
    await taskStore.remove(taskId)
    showSuccess('Task deleted')
    showTaskDetail.value = false
  } catch { showError('Failed to delete task') }
}

const handleDeleteProject = async (projectId: string) => {
  if (!confirm('Delete this project and all its data?')) return
  try {
    await projectStore.remove(projectId)
    showSuccess('Project deleted')
  } catch { showError('Failed to delete project') }
}

// Activity logging helper (fire-and-forget for speed)
const logActivity = (action: string, targetTitle: string) => {
  if (!workspaceStore.currentWorkspace || !user.value) return
  activityStore.log({
    workspaceId: workspaceStore.currentWorkspace.id,
    projectId: projectStore.selectedProject?.id || '',
    userId: user.value.uid,
    userName: user.value.displayName || user.value.email?.split('@')[0] || 'Unknown',
    userEmail: user.value.email || '',
    action,
    targetTitle
  }).catch(() => { /* silent */ })
}

const logout = async () => {
  try {
    workspaceStore.stopListening(); projectStore.stopListening(); taskStore.stopListening()
    docStore.stopListening(); memberStore.stopListening(); activityStore.stopListening()
    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    router.push('/login')
  } catch { showError('Failed to logout') }
}

const showSuccess = (msg: string) => { successMessage.value = msg; setTimeout(() => (successMessage.value = ''), 3000) }
const showError = (msg: string) => { errorMessage.value = msg; setTimeout(() => (errorMessage.value = ''), 3000) }
</script>

<style scoped>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.2s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-4px); }
</style>
