<script setup lang="ts">
import { useHead } from 'nuxt/app'

useHead({
  title: 'ElevateYou - Open Source Project Management',
  meta: [
    { name: 'description', content: 'Free, open source project management platform. Track tasks, collaborate on docs, and organize your work in real-time.' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&display=swap' },
    { rel: 'manifest', href: '/manifest.json' }
  ]
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
