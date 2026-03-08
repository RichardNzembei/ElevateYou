<template>
  <div>
    <!-- Hero -->
    <section class="py-16 sm:py-24 lg:py-32">
      <div class="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <div class="inline-flex items-center gap-1.5 bg-neutral-50 text-neutral-600 px-3 py-1 rounded-full text-[11px] font-medium mb-6 border border-neutral-200/60">
          <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          Open Source &amp; Free
        </div>

        <h1 class="text-[32px] sm:text-[40px] lg:text-[48px] font-extrabold text-neutral-900 leading-[1.05] tracking-tight mb-4">
          Manage work.<br>
          <span class="text-neutral-300">Ship faster.</span>
        </h1>

        <p class="text-[13px] text-neutral-500 mb-8 max-w-md mx-auto leading-relaxed">
          The all-in-one workspace for tasks, docs, and teams. Real-time collaboration, beautifully simple.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <NuxtLink to="/register" class="w-full sm:w-auto btn-primary !px-6 !py-2 !text-[12px]">Get Started Free</NuxtLink>
          <NuxtLink to="/login" class="w-full sm:w-auto btn-secondary !px-6 !py-2 !text-[12px]">Sign In</NuxtLink>
        </div>
      </div>

      <!-- Preview -->
      <div class="max-w-4xl mx-auto px-5 sm:px-8 mt-14 sm:mt-18">
        <div class="card overflow-hidden shadow-md shadow-neutral-200/30 rounded-lg">
          <div class="bg-neutral-50 px-4 py-2.5 flex items-center gap-2 border-b border-neutral-200/60">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-neutral-200"></div>
              <div class="w-3 h-3 rounded-full bg-neutral-200"></div>
              <div class="w-3 h-3 rounded-full bg-neutral-200"></div>
            </div>
            <div class="flex-1 flex justify-center">
              <div class="bg-white px-5 py-1.5 rounded-lg text-[12px] text-neutral-400 border border-neutral-200/60">app.elevateyou.dev</div>
            </div>
          </div>
          <div class="p-5 bg-[#fafafa]">
            <div class="flex gap-4">
              <div class="w-48 space-y-2 hidden sm:block">
                <div class="bg-white rounded-xl p-3.5 border border-neutral-200/60">
                  <div class="h-2.5 bg-neutral-200 rounded w-16 mb-3"></div>
                  <div class="space-y-2.5">
                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full bg-neutral-900"></div><div class="h-2 bg-neutral-200 rounded w-20"></div></div>
                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full bg-neutral-400"></div><div class="h-2 bg-neutral-100 rounded w-14"></div></div>
                    <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full bg-neutral-300"></div><div class="h-2 bg-neutral-100 rounded w-[72px]"></div></div>
                  </div>
                </div>
              </div>
              <div class="flex-1 grid grid-cols-3 gap-3">
                <div class="bg-white rounded-xl p-3.5 border border-neutral-200/60">
                  <div class="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">To Do</div>
                  <div class="space-y-2">
                    <div class="bg-neutral-50 border border-neutral-100 rounded-lg p-2.5"><div class="h-2 bg-neutral-200 rounded w-full mb-2"></div><div class="h-1.5 bg-red-100 rounded w-8"></div></div>
                    <div class="bg-neutral-50 border border-neutral-100 rounded-lg p-2.5"><div class="h-2 bg-neutral-200 rounded w-3/4 mb-2"></div><div class="h-1.5 bg-amber-100 rounded w-10"></div></div>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-3.5 border border-neutral-200/60">
                  <div class="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-2.5">In Progress</div>
                  <div class="space-y-2">
                    <div class="bg-neutral-50 border-l-2 border-l-amber-500 border border-neutral-100 rounded-lg p-2.5"><div class="h-2 bg-neutral-200 rounded w-full mb-2"></div><div class="h-1.5 bg-neutral-200 rounded w-10"></div></div>
                  </div>
                </div>
                <div class="bg-white rounded-xl p-3.5 border border-neutral-200/60">
                  <div class="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-2.5">Done</div>
                  <div class="space-y-2">
                    <div class="bg-neutral-50 border-l-2 border-l-emerald-500 border border-neutral-100 rounded-lg p-2.5"><div class="h-2 bg-neutral-200 rounded w-5/6 mb-2"></div><div class="h-1.5 bg-emerald-100 rounded w-8"></div></div>
                    <div class="bg-neutral-50 border-l-2 border-l-emerald-500 border border-neutral-100 rounded-lg p-2.5"><div class="h-2 bg-neutral-200 rounded w-2/3"></div></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 border-t border-neutral-100">
      <div class="max-w-4xl mx-auto px-5 sm:px-8">
        <div class="text-center mb-10">
          <h2 class="text-[22px] sm:text-[26px] font-extrabold text-neutral-900 tracking-tight mb-2">Everything you need</h2>
          <p class="text-[12px] text-neutral-500 max-w-md mx-auto">A complete toolkit for managing projects and shipping work.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div v-for="f in features" :key="f.title" class="card p-4 hover:bg-neutral-50/50 transition-all duration-200">
            <div class="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center mb-3">
              <svg class="w-4 h-4 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" :d="f.icon" /></svg>
            </div>
            <h3 class="font-bold text-[12px] text-neutral-900 mb-1">{{ f.title }}</h3>
            <p class="text-[11px] text-neutral-500 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 border-t border-neutral-100">
      <div class="max-w-xl mx-auto px-5 sm:px-8 text-center">
        <div class="bg-neutral-900 rounded-xl p-8 sm:p-10">
          <h2 class="text-[20px] font-extrabold text-white mb-2 tracking-tight">Start building today</h2>
          <p class="text-neutral-400 mb-6 text-[12px]">Free forever. Open source. No credit card required.</p>
          <NuxtLink to="/register" class="inline-flex bg-white text-neutral-900 px-6 py-2 rounded-lg font-bold text-[12px] hover:bg-neutral-100 active:scale-[0.98] transition-all">Get Started Free</NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const features = [
  { title: 'Kanban Boards', desc: 'Drag and drop tasks between columns. Visualize your workflow at a glance.', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7' },
  { title: 'Real-time Sync', desc: 'See changes instantly across your team. No refresh needed.', icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' },
  { title: 'Rich Documents', desc: 'Create docs with formatting, headings, lists, and code blocks.', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { title: 'Workspaces', desc: 'Organize everything into workspaces and color-coded projects.', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { title: 'Team Roles', desc: 'Invite members with Owner, Admin, Member, or Viewer permissions.', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { title: 'Smart Filters', desc: 'Filter by status, priority, or search to find anything fast.', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
]
</script>
