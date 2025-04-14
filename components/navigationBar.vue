<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();


  const navItems = [
    { to: '/', label: 'Overview', icon: 'i-lucide-home'},
    { to: '/Developer', label: 'Developer', icon: 'i-lucide-bar-chart'},
    { to: '/Screen Time', label: 'Screen Time', icon: 'i-lucide-users'},
    { to: '/Exercise', label: 'Exercise', icon: 'i-lucide-pie-chart'},
    { to: '/Finances', label: 'Finances', icon: 'i-lucide-user'},
  ];


const isMenuOpen = ref(false);
</script>

<template>
  <header class=" p-4 rounded-lg shadow mb-2 bg-white  text-black">
    <!-- Title -->
    <div class="flex justify-between items-center">
         <!-- Hamburger Button (Mobile) -->
         <button class="md:hidden  hover:text-blue-600" @click="isMenuOpen = !isMenuOpen">
        <Icon :name="isMenuOpen ? 'i-lucide-x' : 'i-lucide-menu'" class="h-6 w-6" />
      </button>
      <div>
        <h1 class="text-2xl font-bold from-orange-50 to-orange-600 text-pink-950 ">ElevateYou</h1>
        <p class="text-sm font-sans font-semibold text-gray-400"><span class="text-blue-600">Track.</span> <span class="text-yellow-600">Grow.</span> <span class="text-orange-600">Repeat</span></p>
      </div>
      <Icon name="i-lucide-circle" class="size-4 text-blue-500"/>
    </div>

    <!-- Desktop Navigation -->
    <nav class="hidden md:flex justify-center gap-6 mt-4">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors duration-200" :class="{
          ' bg-slate-400': route.path === item.to,
          '  hover:bg-slate-400': route.path !== item.to,
        }" :aria-current="route.path === item.to ? 'page' : undefined">
        <Icon :name="item.icon" class="h-5 w-5" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <!-- Mobile Navigation -->
    <nav v-if="isMenuOpen" class="md:hidden mt-4 flex flex-col gap-2 bg-white p-4 rounded-lg shadow">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors duration-200" :class="{
          ' bg-slate-400': route.path === item.to,
          ' hover:bg-slate-400': route.path !== item.to,
        }" :aria-current="route.path === item.to ? 'page' : undefined" @click="isMenuOpen = false">
        <Icon :name="item.icon" class="h-5 w-5" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </header>
</template>