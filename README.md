# ElevateYou

**Open source project management for teams and individuals.**

ElevateYou is a modern, real-time project management platform built with Nuxt 3 and Firebase. Track tasks on kanban boards, collaborate on rich documents, and manage your team — all in one place.

## Features

- **Workspaces** — Organize all your work into separate workspaces
- **Projects** — Color-coded projects with task counts and archive support
- **Task Management** — Create, assign, and track tasks with priorities and due dates
- **Kanban Boards** — Drag-and-drop tasks between To Do, In Progress, and Done
- **List & Calendar Views** — Switch between views to see your work your way
- **Rich Documents** — TipTap-powered editor with headings, lists, and code blocks
- **Document Tree** — Hierarchical docs with parent/child nesting
- **Team Collaboration** — Invite members, assign roles (Owner/Admin/Member/Viewer)
- **Real-time Sync** — All changes sync instantly via Firestore
- **Search & Filters** — Filter tasks by status, priority, and search by title
- **PWA** — Install as a native-like app on any device
- **Public Access** — Landing page viewable without login

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Nuxt 3](https://nuxt.com/) (Vue 3) |
| Language | TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| State | [Pinia](https://pinia.vuejs.org/) |
| Auth & DB | [Firebase](https://firebase.google.com/) (Auth, Firestore, Storage) |
| Editor | [TipTap](https://tiptap.dev/) |
| Icons | Lucide Vue, Heroicons |
| PWA | Vite PWA Plugin |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Firebase project](https://console.firebase.google.com/)

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/elevateyou.git
cd elevateyou
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Copy the environment template and fill in your Firebase credentials:

```bash
cp .env.example .env
```

Edit `.env` with your Firebase project config (from Firebase Console > Project Settings).

### 4. Deploy Firestore rules

```bash
firebase deploy --only firestore:rules,storage
```

### 5. Start development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
elevateyou/
├── pages/                  # Route pages
│   ├── index.vue           # Landing page (public)
│   ├── register.vue        # User registration
│   ├── Login.vue           # User login
│   └── Dashboard.vue       # Main app (auth required)
├── components/
│   ├── dashboard/          # NavBar, TaskListView
│   ├── task/               # KanbanBoard, TaskCreateModal, TaskEditModal
│   ├── docs/               # DocEditor, DocsSidebar, DocTreeItem
│   ├── layout/             # AppSidebar
│   ├── project/            # ProjectCreateModal
│   ├── member/             # MemberInviteModal
│   ├── common/             # ToastNotification
│   └── ui/                 # Modal
├── stores/                 # Pinia state management
│   ├── useWorkspaceStore.ts
│   ├── useProjectStore.ts
│   ├── useTaskStore.ts
│   ├── useMemberStore.ts
│   └── useDocStore.ts
├── composables/            # Firebase client utilities
├── layouts/                # default, auth, dashboard
├── middleware/             # Auth route guard
├── plugins/               # Firebase initialization
├── types/                 # TypeScript interfaces
├── firestore.rules        # Firestore security rules
├── storage.rules          # Storage security rules
└── public/                # Static assets & PWA manifest
```

## Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -m "Add my feature"`
4. Push to your fork: `git push origin feature/my-feature`
5. Open a Pull Request

### Areas where help is needed

- Calendar view implementation
- File attachment upload UI
- Task comments and activity feed
- Subtask UI
- Email invitation system
- Alternative backend support (Supabase, Appwrite)
- Tests (Vitest + Playwright)
- Accessibility improvements
- Internationalization (i18n)

## License

[MIT](LICENSE) — free to use, modify, and distribute.
