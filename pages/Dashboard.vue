<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 text-black">
    <!-- Navigation -->
    <nav class="bg-white/80 backdrop-blur-lg shadow-md sticky top-0 z-40 border-b border-gray-100">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <!-- Logo -->
          <div class="flex items-center gap-3">
            <div class="bg-gradient-to-r from-purple-500 to-blue-600 p-2 rounded-lg">
              <svg class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">ProjectHub</h1>
          </div>

          <!-- View Tabs Navigation -->
          <div class="flex gap-2 bg-gray-100 p-1 rounded-xl">
            <button
                @click="activeView = 'tasks'"
                :class="activeView === 'tasks' ? 'bg-white shadow-md text-purple-700' : 'text-gray-600'"
                class="px-5 py-2 rounded-lg font-medium transition hover:text-purple-600"
            >
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Tasks
              </span>
            </button>
            <button
                @click="activeView = 'docs'"
                :class="activeView === 'docs' ? 'bg-white shadow-md text-purple-700' : 'text-gray-600'"
                class="px-5 py-2 rounded-lg font-medium transition hover:text-purple-600"
            >
              <span class="flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Docs
              </span>
            </button>
          </div>

          <!-- Workspace Switcher -->
          <select
              v-if="workspaceStore.workspaces.length > 0"
              v-model="workspaceStore.currentWorkspace"
              class="px-4 py-2 border border-gray-200 rounded-xl bg-white/70 text-sm font-medium focus:ring-2 focus:ring-purple-500"
              @change="onWorkspaceChange"
          >
            <option v-for="ws in workspaceStore.workspaces" :key="ws.id" :value="ws">
              {{ ws.name }}
            </option>
          </select>
        </div>

        <div class="flex items-center gap-4">
          <!-- Notifications -->
          <button class="relative p-2 hover:bg-gray-100 rounded-xl transition">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <!-- User Menu -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {{ userInitials }}
            </div>
            <button @click="logout" class="text-sm text-gray-600 hover:text-red-600 font-medium">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Layout -->
    <div class="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <!-- Enhanced Sidebar -->
      <aside v-if="activeView === 'tasks'" class="w-80 space-y-6">
        <!-- Projects Sidebar -->
        <AppSidebar @new-project="showNewProjectModal = true" @delete-project="handleDeleteProject" />

        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Docs & Pages</h3>
            <button @click="showNewDocModal = true" class="text-purple-600 hover:text-purple-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <!-- REAL DOCS SIDEBAR -->
          <DocsSidebar
              @select-doc="openDoc"
              @create-root="showNewDocModal = true"
              @create-child="createNewChildDoc"
          />
        </div>

        <!-- Team Members -->
        <div class="bg-white rounded-2xl shadow-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Team</h3>
            <button @click="showInviteModal = true" class="text-purple-600 hover:text-purple-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div class="space-y-3">
            <div v-for="member in memberStore.membersList" :key="member.uid"
                 class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="relative">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center font-bold">
                    {{ member.displayName?.[0] || member.email[0].toUpperCase() }}
                  </div>
                  <div v-if="member.isOnline" class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <p class="font-medium text-sm">{{ member.displayName || member.email }}</p>
                  <p class="text-xs text-gray-500">{{ member.role }}</p>
                </div>
              </div>
              <span v-if="member.role === 'owner'" class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">Owner</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="flex-1">
        <!-- TASKS VIEW -->
        <div v-if="activeView === 'tasks'">
          <!-- No Project Selected -->
          <div v-if="!projectStore.selectedProject" class="bg-white/70 backdrop-blur rounded-3xl shadow-xl p-16 text-center">
            <div class="bg-gradient-to-r from-purple-100 to-blue-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-14 h-14 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2" />
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-gray-800 mb-3">Welcome to ProjectHub</h2>
            <p class="text-gray-600 mb-8">Select a project or create a new one to get started</p>
            <button @click="showNewProjectModal = true" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition shadow-lg">
              Create Your First Project
            </button>
          </div>

          <!-- Project View -->
          <div v-else>
            <!-- Header -->
            <div class="bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 mb-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-4">
                  <div class="w-8 h-8 rounded-full" :style="{ backgroundColor: projectStore.selectedProject?.color }"></div>
                  <div>
                    <h1 class="text-4xl font-bold text-gray-900">{{ projectStore.selectedProject?.name }}</h1>
                    <p class="text-gray-500">{{ getProjectTaskCount }} tasks • {{ filteredProjectTasks.length }} shown</p>
                  </div>
                </div>
                <button @click="showNewTaskModal = true" class="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 transition shadow-lg">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Task
                </button>
              </div>

              <!-- View Switcher -->
              <div class="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                <button @click="currentView = 'list'" :class="currentView === 'list' ? 'bg-white shadow-md text-purple-700' : 'text-gray-600'" class="px-5 py-2.5 rounded-lg font-medium transition">
                  List
                </button>
                <button @click="currentView = 'board'" :class="currentView === 'board' ? 'bg-white shadow-md text-purple-700' : 'text-gray-600'" class="px-5 py-2.5 rounded-lg font-medium transition">
                  Board
                </button>
                <button @click="currentView = 'calendar'" :class="currentView === 'calendar' ? 'bg-white shadow-md text-purple-700' : 'text-gray-600'" class="px-5 py-2.5 rounded-lg font-medium transition">
                  Calendar
                </button>
              </div>
            </div>

            <!-- Tasks Content -->
            <div v-if="currentView === 'list'">
              <!-- Filters -->
              <div class="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-4 mb-6 flex items-center gap-4">
                <div class="flex-1 flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-3">
                  <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input v-model="taskStore.searchQuery" type="text" placeholder="Search tasks..." class="bg-transparent outline-none flex-1" />
                </div>
                <select v-model="taskStore.filterStatus" class="px-4 py-3 rounded-xl border border-gray-200 bg-white">
                  <option value="all">All Status</option>
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
                <select v-model="taskStore.filterPriority" class="px-4 py-3 rounded-xl border border-gray-200 bg-white">
                  <option value="all">All Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <!-- Task List -->
              <div v-if="filteredProjectTasks.length === 0" class="text-center py-20 text-gray-500">
                <p class="text-xl">No tasks found. Create your first one!</p>
              </div>
              <div v-else class="space-y-4">
                <div
                    v-for="task in filteredProjectTasks"
                    :key="task.id"
                    class="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-6 hover:shadow-xl transition border-l-4"
                    :class="{
                    'border-red-500': isOverdue(task),
                    'border-green-500': task.status === 'done',
                    'border-blue-500': task.status === 'in-progress',
                    'border-gray-300': task.status === 'todo'
                  }"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <h3 class="text-xl font-semibold text-gray-900">{{ task.title }}</h3>
                      <p v-if="task.description" class="text-gray-600 mt-1">{{ task.description }}</p>

                      <div class="flex flex-wrap items-center gap-3 mt-4">
                        <!-- Priority -->
                        <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getPriorityColor(task.priority)]">
                          {{ task.priority.charAt(0).toUpperCase() + task.priority.slice(1) }}
                        </span>

                        <!-- Status -->
                        <select :value="task.status" @change="updateTaskStatus(task.id, $event.target.value)" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium">
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="done">Done</option>
                        </select>

                        <!-- Due Date -->
                        <span v-if="task.dueDate" :class="['text-sm font-medium flex items-center gap-1', isOverdue(task) ? 'text-red-600' : 'text-gray-600']">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {{ formatDate(task.dueDate) }}
                        </span>

                        <!-- Assignees -->
                        <div v-if="task.assigneeIds?.length" class="flex -space-x-2">
                          <div v-for="id in task.assigneeIds.slice(0, 3)" :key="id" class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs flex items-center justify-center border-2 border-white font-bold">
                            {{ id[0].toUpperCase() }}
                          </div>
                          <div v-if="task.assigneeIds.length > 3" class="w-8 h-8 rounded-full bg-gray-300 text-gray-700 text-xs flex items-center justify-center border-2 border-white font-bold">
                            +{{ task.assigneeIds.length - 3 }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center gap-2">
                      <button @click="editTask(task)" class="p-3 hover:bg-blue-50 rounded-xl text-blue-600 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="deleteTask(task.id)" class="p-3 hover:bg-red-50 rounded-xl text-red-600 transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <KanbanBoard
                v-if="currentView === 'board'"
                :show-new-task-modal="showNewTaskModal"
                :new-task-form="newTaskForm"
                @edit-task="editTask"
            />
          </div>
        </div>

        <!-- DOCS VIEW -->
        <div v-if="activeView === 'docs'" class="flex gap-6 h-[calc(100vh-140px)]">
          <div class="w-80 bg-white rounded-2xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Documents</h3>
              <button @click="showNewDocModal = true" class="text-purple-600 hover:text-purple-700">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
            <DocsSidebar @select-doc="openDoc" @create-root="createNewRootDoc" @create-child="createNewChildDoc" />
          </div>

          <div class="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden">
            <DocEditor
                v-if="currentDoc && currentDoc.id"
                :doc-id="currentDoc.id"
                :title="currentDoc.title || 'Untitled'"
                :content="currentDoc.content || ''"
                @save="saveDoc"
            />
            <div v-else class="h-full flex items-center justify-center text-gray-500">
              <div class="text-center">
                <svg class="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-xl">Select a document or create a new one</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Modals -->
    <Modal v-model="showNewProjectModal" title="Create New Project">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Project Name</label>
          <input
              v-model="newProjectForm.name"
              placeholder="Enter project name..."
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              @keyup.enter="createProject"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <input
              v-model="newProjectForm.color"
              type="color"
              class="w-full h-12 px-2 border rounded-xl cursor-pointer"
          />
        </div>
        <div class="flex gap-3">
          <button
              @click="createProject"
              :disabled="loading"
              class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Project' }}
          </button>
          <button
              @click="showNewProjectModal = false"
              class="flex-1 bg-gray-200 py-3 rounded-xl font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showNewTaskModal" title="Create New Task">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
              v-model="newTaskForm.title"
              placeholder="Enter task title..."
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              @keyup.enter="createTask"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
              v-model="newTaskForm.description"
              placeholder="Task description..."
              rows="3"
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select v-model="newTaskForm.priority" class="w-full px-4 py-3 border rounded-xl">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
                v-model="newTaskForm.dueDate"
                type="date"
                class="w-full px-4 py-3 border rounded-xl"
            />
          </div>
        </div>
        <div class="flex gap-3">
          <button
              @click="createTask"
              :disabled="loading"
              class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {{ loading ? 'Creating...' : 'Create Task' }}
          </button>
          <button
              @click="showNewTaskModal = false"
              class="flex-1 bg-gray-200 py-3 rounded-xl font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showEditTaskModal" title="Edit Task">
      <div v-if="editingTask" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
          <input
              v-model="editingTask.title"
              placeholder="Enter task title..."
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
              v-model="editingTask.description"
              placeholder="Task description..."
              rows="3"
              class="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          ></textarea>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            <select v-model="editingTask.priority" class="w-full px-4 py-3 border rounded-xl">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <input
                v-model="editingTask.dueDate"
                type="date"
                class="w-full px-4 py-3 border rounded-xl"
            />
          </div>
        </div>
        <div class="flex gap-3">
          <button
              @click="updateTask"
              :disabled="loading"
              class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {{ loading ? 'Updating...' : 'Update Task' }}
          </button>
          <button
              @click="showEditTaskModal = false"
              class="flex-1 bg-gray-200 py-3 rounded-xl font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>

    <Modal v-model="showNewDocModal" title="New Document">
      <div class="space-y-4">
        <input
            v-model="newDocTitle"
            placeholder="Document title..."
            class="w-full px-4 py-3 border rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-black"
            @keyup.enter="createNewRootDocFromModal"
        />
        <button
            @click="createNewRootDocFromModal"
            class="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold hover:scale-105 transition shadow-lg"
        >
          Create Document
        </button>
      </div>
    </Modal>

    <Modal v-model="showInviteModal" title="Invite Teammate">
      <div class="space-y-4">
        <input
            v-model="inviteEmail"
            type="email"
            placeholder="teammate@example.com"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            @keyup.enter="sendInvite"
        />
        <div class="flex gap-3">
          <button @click="sendInvite"
                  class="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-bold">
            Send Invite
          </button>
          <button @click="showInviteModal = false" class="flex-1 bg-gray-200 py-3 rounded-xl">Cancel</button>
        </div>
      </div>
    </Modal>

    <!-- Toast Messages -->
    <Transition name="fade">
      <div v-if="successMessage" class="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl font-medium z-50">
        {{ successMessage }}
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="errorMessage" class="fixed bottom-6 right-6 bg-red-600 text-white px-6 py-4 rounded-xl shadow-2xl font-medium z-50">
        {{ errorMessage }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import { useProjectStore } from '@/stores/useProjectStore'
import { useTaskStore } from '@/stores/useTaskStore'
import { useMemberStore } from '@/stores/useMemberStore'
import { useDocStore } from '@/stores/useDocStore'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import Modal from '@/components/ui/Modal.vue'
import KanbanBoard from '~/components/task/KanbanBoard.vue'
import DocEditor from '~/components/docs/DocEditor.vue'
import DocsSidebar from '@/components/docs/DocsSidebar.vue'
import { useFirebase } from '@/composables/firebase-client'



definePageMeta({
  middleware: 'auth'
})

const { auth } = useFirebase()
const router = useRouter()
const workspaceStore = useWorkspaceStore()
const projectStore = useProjectStore()
const taskStore = useTaskStore()
const memberStore = useMemberStore()
const docStore = useDocStore()

const showNewProjectModal = ref(false)
const showNewTaskModal = ref(false)
const showEditTaskModal = ref(false)
const editingTask = ref(null)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const newProjectForm = ref({
  name: '',
  color: '#8B5CF6'
})

const newTaskForm = ref({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: ''
})

const user = computed(() => auth.currentUser)

const filteredProjectTasks = computed(() => {
  if (!projectStore.selectedProject) return []
  return taskStore.filteredTasks.filter(t => t.projectId === projectStore.selectedProject.id)
})

const getProjectTaskCount = computed(() => {
  if (!projectStore.selectedProject) return 0
  return taskStore.tasks.filter(t => t.projectId === projectStore.selectedProject.id).length
})

const activeView = ref<'tasks' | 'docs'>('tasks')
const currentView = ref<'list' | 'board' | 'calendar'>('list')
const showNewDocModal = ref(false)
const newDocTitle = ref('')

const userInitials = computed(() => {
  return user.value?.email?.[0].toUpperCase() || 'U'
})

const currentDoc = ref<Doc | null>(null)

const saveCurrentDoc = async (data: any) => {
  if (currentDoc.value) {
    currentDoc.value = { ...currentDoc.value, ...data }
    showSuccess('Document saved!')
  }
}

// Watch for workspace changes to listen to docs and team
watch(() => workspaceStore.currentWorkspace, (ws) => {
  if (ws) {
    docStore.listen(ws.id)
    memberStore.listen(ws.id)
  }
}, { immediate: true })

const openDoc = (doc: Doc) => {
  currentDoc.value = doc
  activeView.value = 'docs'
}

const saveDoc = async (data: { title: string; content: string }) => {
  if (!currentDoc.value?.id) {
    showError('No document selected')
    return
  }

  try {
    await docStore.update(currentDoc.value.id, data)
    showSuccess('Document saved!')
  } catch (err) {
    showError('Failed to save document')
  }
}

const createNewRootDoc = async () => {
  if (!workspaceStore.currentWorkspace || !user.value) {
    showError('Missing workspace or user')
    return
  }

  try {
    const id = await docStore.create({
      workspaceId: workspaceStore.currentWorkspace.id,
      title: 'New Document',
      content: '<h1>New Document</h1><p>Start writing...</p>',
      order: docStore.docs.length,
      createdBy: user.value.uid
    })
    const newDoc = docStore.docs.find(d => d.id === id)
    if (newDoc) openDoc(newDoc)
  } catch (err) {
    showError('Failed to create document')
  }
}

const createNewChildDoc = async (parentId: string) => {
  if (!workspaceStore.currentWorkspace || !user.value) {
    showError('Missing workspace or user')
    return
  }

  try {
    const id = await docStore.create({
      workspaceId: workspaceStore.currentWorkspace.id,
      parentId,
      title: 'New Page',
      content: '<p>Start writing your page...</p>',
      order: 0,
      createdBy: user.value.uid,
      isFolder: false
    })

    const newDoc = docStore.docs.find(d => d.id === id)
    if (newDoc) openDoc(newDoc)
  } catch (err) {
    showError('Failed to create child document')
  }
}

const createNewRootDocFromModal = async () => {
  if (!newDocTitle.value.trim()) {
    showError('Please enter a document title')
    return
  }

  if (!workspaceStore.currentWorkspace || !user.value) {
    showError('No workspace selected')
    return
  }

  try {
    const id = await docStore.create({
      workspaceId: workspaceStore.currentWorkspace.id,
      title: newDocTitle.value.trim(),
      content: `<h1>${newDocTitle.value.trim()}</h1><p>Start writing...</p>`,
      order: docStore.docs.length,
      createdBy: user.value.uid,
      isFolder: false
    })

    const newDoc = docStore.docs.find(d => d.id === id)
    if (newDoc) {
      openDoc(newDoc)
      showSuccess('Document created!')
      newDocTitle.value = ''
      showNewDocModal.value = false
    }
  } catch (err) {
    showError('Failed to create document')
  }
}

// Team invitation functions
const showInviteModal = ref(false)
const inviteEmail = ref('')
const sendInvite = async () => {
  const email = inviteEmail.value.trim()

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return showError('Please enter an email address')
  if (!emailRegex.test(email)) return showError('Please enter a valid email address')

  if (!workspaceStore.currentWorkspace) return showError('No workspace selected')

  try {
    await memberStore.inviteMember(email, workspaceStore.currentWorkspace.id)
    showSuccess('Team member invited successfully!')
    inviteEmail.value = ''
    showInviteModal.value = false
  } catch (err: any) {
    showError(err.message || 'Failed to invite member')
    console.error('Invite error:', err)
  }
}
onMounted(async () => {
  if (!user.value) {
    router.push('/login')
    return
  }
  workspaceStore.listen(user.value.uid)
  watch(() => workspaceStore.loading, async (loading) => {
    if (!loading && workspaceStore.workspaces.length === 0) {
      await workspaceStore.create('My Workspace', user.value.uid)
    }
  }, { immediate: true })

  // Listen to projects and tasks when workspace changes
  watch(() => workspaceStore.currentWorkspace, (workspace) => {
    if (workspace) {
      projectStore.listen(workspace.id)
      taskStore.listen(workspace.id)
    }
  }, { immediate: true })
})

const onWorkspaceChange = () => {
  if (workspaceStore.currentWorkspace) {
    projectStore.listen(workspaceStore.currentWorkspace.id)
    taskStore.listen(workspaceStore.currentWorkspace.id)
  }
}

const createProject = async () => {
  if (!newProjectForm.value.name.trim() || !workspaceStore.currentWorkspace) {
    showError('Project name is required')
    return
  }

  loading.value = true
  try {
    await projectStore.create({
      name: newProjectForm.value.name,
      color: newProjectForm.value.color,
      workspaceId: workspaceStore.currentWorkspace.id
    })

    showSuccess('Project created successfully!')
    newProjectForm.value = { name: '', color: '#8B5CF6' }
    showNewProjectModal.value = false
  } catch (err) {
    showError('Failed to create project')
  } finally {
    loading.value = false
  }
}

const createTask = async () => {
  if (!newTaskForm.value.title.trim() || !projectStore.selectedProject || !workspaceStore.currentWorkspace) {
    showError('Task title is required')
    return
  }

  loading.value = true
  try {
    await taskStore.create({
      title: newTaskForm.value.title,
      description: newTaskForm.value.description,
      priority: newTaskForm.value.priority,
      status: 'todo',
      dueDate: newTaskForm.value.dueDate || null,
      projectId: projectStore.selectedProject.id,
      workspaceId: workspaceStore.currentWorkspace.id
    })

    showSuccess('Task created successfully!')
    newTaskForm.value = { title: '', description: '', priority: 'medium', dueDate: '' }
    showNewTaskModal.value = false
  } catch (err) {
    showError('Failed to create task')
  } finally {
    loading.value = false
  }
}

const updateTask = async () => {
  if (!editingTask.value) return

  loading.value = true
  try {
    await taskStore.update(editingTask.value.id, {
      title: editingTask.value.title,
      description: editingTask.value.description,
      priority: editingTask.value.priority,
      dueDate: editingTask.value.dueDate || null
    })

    showSuccess('Task updated successfully!')
    editingTask.value = null
    showEditTaskModal.value = false
  } catch (err) {
    showError('Failed to update task')
  } finally {
    loading.value = false
  }
}

const updateTaskStatus = async (taskId: string, newStatus: string) => {
  try {
    await taskStore.update(taskId, { status: newStatus })
  } catch (err) {
    showError('Failed to update task status')
  }
}

const deleteTask = async (taskId: string) => {
  if (!confirm('Are you sure you want to delete this task?')) return

  try {
    await taskStore.remove(taskId)
    showSuccess('Task deleted successfully!')
  } catch (err) {
    showError('Failed to delete task')
  }
}

const handleDeleteProject = async (projectId: string) => {
  if (!confirm('Are you sure? All tasks will be deleted.')) return

  try {
    await projectStore.remove(projectId)
    showSuccess('Project deleted successfully!')
  } catch (err) {
    showError('Failed to delete project')
  }
}

const editTask = (task: any) => {
  editingTask.value = { ...task }
  showEditTaskModal.value = true
}

const isOverdue = (task: any) => {
  if (!task.dueDate || task.status === 'done') return false
  return new Date(task.dueDate) < new Date()
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-600 bg-red-50'
    case 'medium': return 'text-yellow-600 bg-yellow-50'
    case 'low': return 'text-green-600 bg-green-50'
    default: return 'text-gray-600 bg-gray-50'
  }
}

const formatDate = (date: string) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const logout = async () => {
  try {
    // Clean up all listeners before signing out
    workspaceStore.stopListening()
    projectStore.stopListening()
    taskStore.stopListening()
    docStore.stopListening()
    memberStore.stopListening()

    const { signOut } = await import('firebase/auth')
    await signOut(auth)
    router.push('/login')
  } catch (err) {
    showError('Failed to logout')
  }
}

const showSuccess = (msg: string) => {
  successMessage.value = msg
  setTimeout(() => (successMessage.value = ''), 3000)
}

const showError = (msg: string) => {
  errorMessage.value = msg
  setTimeout(() => (errorMessage.value = ''), 3000)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>