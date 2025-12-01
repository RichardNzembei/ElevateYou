export type Role = 'admin' | 'member' | 'viewer'

export interface Workspace {
    id: string
    name: string
    ownerId: string
    memberIds: string[]           // ← NEW
    invitedEmails?: string[]      // ← NEW: pending invites
    createdAt: Timestamp | Date
    updatedAt: Timestamp | Date
}

export interface Task {
    // ... existing
    assigneeIds: string[]
    watcherIds?: string[]         // ← NEW
    dependsOn?: string[]          // ← NEW: task dependencies
    subtasks?: string[]           // ← NEW: ordered subtask IDs
    commentsCount?: number
    attachments?: string[]        // ← NEW: Firebase Storage paths
}

export interface Comment {
    id: string
    taskId: string
    authorId: string
    content: string
    createdAt: Timestamp
    updatedAt?: Timestamp
}

// types.ts (add this)
export interface Doc {
    id: string
    workspaceId: string
    projectId?: string       // optional: attach to project
    title: string
    content: string          // HTML from TipTap
    parentId?: string        // for nesting (null = root)
    isFolder?: boolean       // true = folder
    order: number            // for sorting
    createdAt: Timestamp
    updatedAt: Timestamp
    createdBy: string
}