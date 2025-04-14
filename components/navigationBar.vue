<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const navItems = [
  { to: '/', label: 'Overview', icon: 'i-lucide-home', color: 'text-blue-500' },
  { to: '/developer', label: 'Developer', icon: 'i-lucide-code', color: 'text-green-500' },
  { to: '/screen-time', label: 'Screen Time', icon: 'i-lucide-smartphone', color: 'text-orange-500' },
  { to: '/exercise', label: 'Exercise', icon: 'i-lucide-dumbbell', color: 'text-purple-500' },
  { to: '/finances', label: 'Finances', icon: 'i-lucide-dollar-sign', color: 'text-yellow-500' },
];

const isMenuOpen = ref(false);
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-teal-400 to-coral-400 shadow-md backdrop-blur-sm">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <!-- Logo/Title -->
      <div class="flex items-center gap-3">
        <Icon name="i-lucide-star" class="h-7 w-7 text-yellow-300 animate-spin-slow" />
        <div>
          <h1 class="text-2xl font-playful text-slate-800">ElevateYou</h1>
          <p class="text-xs font-medium text-slate-700">
            <span class="text-blue-500">Track.</span>
            <span class="text-yellow-500">Grow.</span>
            <span class="text-orange-500">Repeat.</span>
          </p>
        </div>
      </div>

      <!-- Hamburger Button (Mobile) -->
      <button class="md:hidden text-slate-800 hover:text-yellow-500" @click="isMenuOpen = !isMenuOpen">
        <Icon :name="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="h-6 w-6 transition-transform duration-300" />
      </button>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center gap-2">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="relative flex items-center gap-2 px-3 py-2 rounded-lg text-slate-800 font-medium transition-all duration-300 group hover:bg-white/30 hover:scale-105"
          :class="{ 'bg-white/40 scale-105 animate-pulse-soft': route.path === item.to }"
          :aria-current="route.path === item.to ? 'page' : undefined"
        >
          <Icon :name="item.icon" class="h-5 w-5" :class="item.color + ' group-hover:animate-bounce'" />
          <span>{{ item.label }}</span>
          <!-- Tooltip -->
          <span
            class="absolute hidden group-hover:block bottom-full mb-2 px-2 py-1 text-xs bg-slate-800 text-white rounded-md shadow-md"
          >
            {{ item.label }}
          </span>
        </RouterLink>
        <!-- Settings Icon -->
        <button class="p-2 rounded-lg hover:bg-white/30">
          <Icon name="i-lucide-settings" class="h-5 w-5 text-slate-800" />
        </button>
      </nav>
    </div>

    <!-- Progress Indicator -->
    <div class="h-1 bg-white/20">
      <div class="h-full bg-gradient-to-r from-blue-500 to-purple-500 w-[75%] transition-all duration-1000"></div>
    </div>

    <!-- Mobile Navigation -->
    <nav
      v-if="isMenuOpen"
      class="md:hidden fixed top-0 left-0 w-3/4 h-full bg-gradient-to-b from-teal-400 to-coral-400 shadow-lg transform transition-transform duration-400 ease-in-out"
      :class="{ 'translate-x-0': isMenuOpen, 'translate-x-[-100%]': !isMenuOpen }"
    >
      <div class="flex flex-col p-6 gap-4 mt-16 bg-slate-500">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-800 font-medium text-lg transition-all duration-200 hover:bg-white/30"
          :class="{ 'bg-white/40': route.path === item.to }"
          :aria-current="route.path === item.to ? 'page' : undefined"
          @click="isMenuOpen = false"
        >
          <Icon :name="item.icon" class="h-6 w-6" :class="item.color" />
          <span>{{ item.label }}</span>
        </RouterLink>
        <!-- Settings Icon -->
        <button class="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/30">
          <Icon name="i-lucide-settings" class="h-6 w-6 text-slate-800" />
          <span>Settings</span>
        </button>
      </div>
    </nav>
    <!-- Mobile Overlay -->
    <div
      v-if="isMenuOpen"
      class="md:hidden fixed inset-0 bg-black/50"
      @click="isMenuOpen = false"
    ></div>
  </header>
</template>

<style scoped>
/* Playful Font (Placeholder) */
.font-playful {
  font-family: 'Bubblegum Sans', cursive; /* Replace with your chosen font */
}

/* Animations */
@keyframes spin-slow {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes pulse-soft {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 10px 5px rgba(255, 255, 255, 0.3);
  }
}

.animate-spin-slow {
  animation: spin-slow 5s linear infinite;
}

.animate-bounce {
  animation: bounce 0.3s ease-in-out;
}

.animate-pulse-soft {
  animation: pulse-soft 2s ease-in-out infinite;
}
</style>