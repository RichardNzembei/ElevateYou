import { defineStore } from 'pinia'
import { collection, query, where, orderBy, limit, onSnapshot, addDoc } from 'firebase/firestore'
import { ref } from 'vue'
import { useFirebase } from '~/composables/firebase-client'

export type ActivityAction =
  | 'task_created'
  | 'task_updated'
  | 'task_completed'
  | 'task_assigned'
  | 'task_deleted'
  | 'doc_created'
  | 'doc_updated'
  | 'member_invited'
  | 'member_joined'
  | 'project_created'
  | 'project_updated'
  | 'comment_added'

export interface Activity {
  id?: string
  workspaceId: string
  projectId?: string
  taskId?: string
  userId: string
  userName: string
  userEmail: string
  action: ActivityAction
  targetTitle: string
  details?: string
  createdAt: Date
}

export const useActivityStore = defineStore('activity', () => {
  const activities = ref<Activity[]>([])
  let unsubscribe: (() => void) | null = null

  function listen(workspaceId: string) {
    if (unsubscribe) unsubscribe()

    const { firestore } = useFirebase()
    const q = query(
      collection(firestore, 'activities'),
      where('workspaceId', '==', workspaceId),
      orderBy('createdAt', 'desc'),
      limit(50)
    )

    unsubscribe = onSnapshot(q, (snap) => {
      activities.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Activity))
    }, (error) => {
      console.warn('Activity listener error (composite index may be needed):', error.message)
      activities.value = []
    })

    return unsubscribe
  }

  function stopListening() {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
    }
    activities.value = []
  }

  async function log(activity: Omit<Activity, 'id' | 'createdAt'>) {
    const { firestore } = useFirebase()
    await addDoc(collection(firestore, 'activities'), {
      ...activity,
      createdAt: new Date()
    })
  }

  return {
    activities,
    listen,
    stopListening,
    log
  }
})
