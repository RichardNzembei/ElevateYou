<template>
  <div class="min-h-screen bg-white flex flex-col">
    <nav class="border-b border-neutral-100 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 h-12 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <div class="w-7 h-7 bg-neutral-900 rounded-lg flex items-center justify-center">
            <svg class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-[13px] font-bold text-neutral-900 tracking-tight">ElevateYou</span>
        </NuxtLink>

        <div class="flex items-center gap-2">
          <NuxtLink to="/login" class="btn-ghost">Sign In</NuxtLink>
          <NuxtLink to="/register" class="btn-primary">Get Started</NuxtLink>
        </div>
      </div>
    </nav>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t border-neutral-100">
      <div class="max-w-6xl mx-auto px-5 sm:px-8 py-6">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 bg-neutral-900 rounded flex items-center justify-center">
              <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span class="text-[12px] font-semibold text-neutral-400">ElevateYou</span>
          </div>
          <p class="text-[11px] text-neutral-400">&copy; {{ new Date().getFullYear() }} RichardNzembei. Open source under MIT License.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
