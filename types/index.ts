import type { Timestamp } from 'firebase/firestore'

export type Role = 'owner' | 'admin' | 'member' | 'viewer'
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done'
export type TaskPriority = 'low' | 'medium' | 'high'
export type ViewMode = 'overview' | 'list' | 'board' | 'calendar'
export type ActiveView = 'overview' | 'tasks' | 'docs' | 'members'

export interface Workspace {
    id: string
    name: string
    ownerId: string
    memberIds: string[]
    invitedEmails?: string[]
    isPublic?: boolean
    description?: string
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

export interface Project {
    id: string
    name: string
    color: string
    workspaceId: string
    description?: string
    status?: 'active' | 'archived' | 'completed'
    startDate?: string | null
    endDate?: string | null
    ownerId?: string
    archivedAt?: Timestamp | Date | null
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

export interface Task {
    id: string
    title: string
    description?: string
    status: TaskStatus
    priority: TaskPriority
    dueDate?: string | null
    projectId: string
    workspaceId: string
    assigneeIds: string[]
    tags?: string[]
    watcherIds?: string[]
    dependsOn?: string[]
    subtasks?: Subtask[]
    attachments?: string[]
    commentsCount?: number
    createdBy?: string
    estimatedHours?: number
    completedAt?: Timestamp | Date | null
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

export interface Subtask {
    id: string
    title: string
    completed: boolean
}

export interface Comment {
    id: string
    taskId: string
    authorId: string
    authorName?: string
    authorEmail?: string
    content: string
    createdAt: Timestamp | Date
    updatedAt?: Timestamp | Date
}

export interface Doc {
    id: string
    workspaceId: string
    projectId?: string
    title: string
    content: string
    parentId?: string | null
    isFolder?: boolean
    order: number
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
    createdBy: string
}

export interface Activity {
    id: string
    workspaceId: string
    projectId: string
    taskId?: string
    userId: string
    userName: string
    action: string
    details: string
    createdAt: Timestamp | Date
}

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

export interface UserProfile {
    id: string
    email: string
    displayName?: string
    photoURL?: string
    createdAt: Timestamp | Date
}

export interface Toast {
    id: string
    message: string
    type: 'success' | 'error' | 'info'
}
