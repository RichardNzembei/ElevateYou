<script setup lang="ts">
const props = defineProps<{
  project: any
  tasks: any[]
  members: any[]
}>()

const emit = defineEmits<{
  'edit-project': []
  'new-task': []
  'view-task': [task: any]
}>()

const taskStats = computed(() => {
  const all = props.tasks || []
  const total = all.length
  const completed = all.filter(t => t.status === 'done').length
  const inProgress = all.filter(t => t.status === 'in-progress').length
  const overdue = all.filter(t => {
    if (!t.dueDate || t.status === 'done') return false
    return new Date(t.dueDate) < new Date()
  }).length
  const byStatus = {
    backlog: all.filter(t => t.status === 'backlog').length,
    todo: all.filter(t => t.status === 'todo').length,
    'in-progress': inProgress,
    review: all.filter(t => t.status === 'review').length,
    done: completed,
  }
  return { total, completed, inProgress, overdue, byStatus }
})

const completionPercentage = computed(() => {
  if (taskStats.value.total === 0) return 0
  return Math.round((taskStats.value.completed / taskStats.value.total) * 100)
})

const recentTasks = computed(() => {
  return [...(props.tasks || [])]
    .sort((a, b) => {
      const aDate = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt)
      const bDate = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt)
      return bDate.getTime() - aDate.getTime()
    })
    .slice(0, 6)
})

const memberTaskCounts = computed(() => {
  const counts = new Map<string, number>()
  for (const task of (props.tasks || [])) {
    if (task.assigneeIds) {
      for (const id of task.assigneeIds) counts.set(id, (counts.get(id) || 0) + 1)
    }
  }
  return counts
})

function statusDot(status: string): string {
  const map: Record<string, string> = {
    backlog: 'bg-neutral-300', todo: 'bg-blue-400',
    'in-progress': 'bg-amber-500', review: 'bg-purple-500', done: 'bg-emerald-500'
  }
  return map[status] || 'bg-neutral-300'
}

function priorityLabel(priority: string): string {
  return { high: 'High', medium: 'Med', low: 'Low' }[priority] || priority
}

function priorityClass(priority: string): string {
  return {
    high: 'text-red-600 bg-red-50',
    medium: 'text-amber-600 bg-amber-50',
    low: 'text-emerald-600 bg-emerald-50'
  }[priority] || 'text-neutral-500 bg-neutral-50'
}

function statusPercentage(status: string): number {
  if (taskStats.value.total === 0) return 0
  return Math.round(((taskStats.value.byStatus[status as keyof typeof taskStats.value.byStatus] || 0) / taskStats.value.total) * 100)
}

function formatDate(date: any): string {
  if (!date) return ''
  const d = date?.toDate ? date.toDate() : new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function getMember(id: string) {
  return (props.members || []).find((m: any) => m.uid === id)
}

function memberInitials(member: any): string {
  if (!member) return '?'
  if (member.displayName) {
    return member.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return (member.email || '?')[0].toUpperCase()
}
</script>

<template>
  <div class="space-y-3">
    <!-- Project Header -->
    <div class="card px-4 py-3">
      <div class="flex items-start justify-between gap-3">
        <div class="flex items-start gap-2.5 flex-1 min-w-0">
          <span class="w-3 h-3 rounded-full mt-1 shrink-0" :style="{ backgroundColor: project?.color || '#737373' }" />
          <div class="flex-1 min-w-0">
            <h1 class="text-[15px] font-bold text-neutral-900 tracking-tight truncate">{{ project?.name || 'Untitled Project' }}</h1>
            <p class="text-[11px] text-neutral-500 mt-0.5 line-clamp-2">{{ project?.description || 'No description' }}</p>
          </div>
        </div>
        <button class="btn-ghost flex items-center gap-1.5 shrink-0 text-neutral-500" @click="emit('edit-project')">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
          <span class="hidden sm:inline">Edit</span>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="card px-4 py-3">
        <p class="text-[11px] text-neutral-500 font-medium">Total Tasks</p>
        <p class="text-[18px] font-bold text-neutral-900 mt-0.5 tabular-nums leading-none">{{ taskStats.total }}</p>
      </div>
      <div class="card px-4 py-3">
        <p class="text-[11px] text-emerald-600 font-medium">Completed</p>
        <div class="flex items-baseline gap-1.5 mt-0.5">
          <p class="text-[18px] font-bold text-neutral-900 tabular-nums leading-none">{{ taskStats.completed }}</p>
          <span class="text-[11px] text-neutral-400 tabular-nums">/ {{ taskStats.total }}</span>
        </div>
      </div>
      <div class="card px-4 py-3">
        <p class="text-[11px] text-amber-600 font-medium">In Progress</p>
        <p class="text-[18px] font-bold text-neutral-900 mt-0.5 tabular-nums leading-none">{{ taskStats.inProgress }}</p>
      </div>
      <div class="card px-4 py-3">
        <p class="text-[11px] font-medium" :class="taskStats.overdue > 0 ? 'text-red-600' : 'text-neutral-500'">Overdue</p>
        <p class="text-[18px] font-bold mt-0.5 tabular-nums leading-none" :class="taskStats.overdue > 0 ? 'text-red-600' : 'text-neutral-900'">{{ taskStats.overdue }}</p>
      </div>
    </div>

    <!-- Progress -->
    <div class="card px-4 py-3">
      <div class="flex items-center justify-between mb-2.5">
        <p class="text-[12px] font-semibold text-neutral-900">Progress</p>
        <p class="text-[12px] font-bold text-neutral-900 tabular-nums">{{ completionPercentage }}%</p>
      </div>
      <div class="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden flex" v-if="taskStats.total > 0">
        <div class="h-full bg-emerald-500 transition-all duration-500" :style="{ width: statusPercentage('done') + '%' }" />
        <div class="h-full bg-purple-400 transition-all duration-500" :style="{ width: statusPercentage('review') + '%' }" />
        <div class="h-full bg-amber-400 transition-all duration-500" :style="{ width: statusPercentage('in-progress') + '%' }" />
        <div class="h-full bg-blue-300 transition-all duration-500" :style="{ width: statusPercentage('todo') + '%' }" />
        <div class="h-full bg-neutral-200 transition-all duration-500" :style="{ width: statusPercentage('backlog') + '%' }" />
      </div>
      <div v-else class="w-full h-1.5 rounded-full bg-neutral-100" />
      <div class="flex flex-wrap gap-x-4 gap-y-1.5 mt-2.5">
        <div v-for="s in [
          { key: 'done', label: 'Done', color: 'bg-emerald-500' },
          { key: 'review', label: 'Review', color: 'bg-purple-400' },
          { key: 'in-progress', label: 'In Progress', color: 'bg-amber-400' },
          { key: 'todo', label: 'To Do', color: 'bg-blue-300' },
          { key: 'backlog', label: 'Backlog', color: 'bg-neutral-200' }
        ]" :key="s.key" class="flex items-center gap-1.5 text-[11px] text-neutral-500">
          <span class="w-2 h-2 rounded-full" :class="s.color" />
          {{ s.label }} <span class="text-neutral-400 tabular-nums">{{ statusPercentage(s.key) }}%</span>
        </div>
      </div>
    </div>

    <!-- Two-column -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <!-- Recent Tasks (wider) -->
      <div class="lg:col-span-2 card">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
          <h2 class="text-[12px] font-semibold text-neutral-900">Recent Tasks</h2>
          <button @click="emit('new-task')" class="text-[11px] text-neutral-500 hover:text-neutral-900 font-medium transition-colors flex items-center gap-1">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
            Add
          </button>
        </div>

        <div v-if="recentTasks.length === 0" class="px-4 py-8 text-center">
          <p class="text-[11px] text-neutral-400">No tasks yet. Create one to get started.</p>
        </div>

        <div v-else>
          <div
            v-for="task in recentTasks"
            :key="task.id"
            class="flex items-center gap-2.5 px-4 py-2 hover:bg-neutral-50/80 cursor-pointer transition-colors border-b border-neutral-50 last:border-b-0"
            @click="emit('view-task', task)"
          >
            <span class="w-2 h-2 rounded-full shrink-0" :class="statusDot(task.status)" />
            <span class="text-[12px] text-neutral-900 truncate flex-1 font-medium">{{ task.title }}</span>
            <span class="badge shrink-0" :class="priorityClass(task.priority)">{{ priorityLabel(task.priority) }}</span>
            <span v-if="task.dueDate" class="text-[11px] text-neutral-400 shrink-0 tabular-nums">{{ formatDate(task.dueDate) }}</span>
            <template v-if="task.assigneeIds?.length">
              <div
                v-for="aid in task.assigneeIds.slice(0, 1)"
                :key="aid"
                class="w-6 h-6 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-semibold flex items-center justify-center shrink-0"
                :title="getMember(aid)?.displayName || getMember(aid)?.email"
              >{{ memberInitials(getMember(aid)) }}</div>
            </template>
          </div>
        </div>
      </div>

      <!-- Team -->
      <div class="card">
        <div class="flex items-center justify-between px-4 py-2.5 border-b border-neutral-100">
          <h2 class="text-[12px] font-semibold text-neutral-900">Team</h2>
          <span class="text-[11px] text-neutral-400 tabular-nums">{{ members?.length || 0 }}</span>
        </div>

        <div v-if="!members?.length" class="px-4 py-8 text-center">
          <p class="text-[11px] text-neutral-400">No team members yet.</p>
        </div>

        <div v-else>
          <div
            v-for="member in members"
            :key="member.uid"
            class="flex items-center gap-2.5 px-4 py-2 border-b border-neutral-50 last:border-b-0"
          >
            <div class="w-7 h-7 rounded-full bg-neutral-900 text-white text-[10px] font-semibold flex items-center justify-center shrink-0">
              {{ memberInitials(member) }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-[12px] text-neutral-900 truncate font-medium">{{ member.displayName || member.email }}</p>
              <p class="text-[10px] text-neutral-400 capitalize">{{ member.role }}</p>
            </div>
            <span class="text-[11px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-md shrink-0 tabular-nums">
              {{ memberTaskCounts.get(member.uid) || 0 }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
