import { defineNuxtConfig } from 'nuxt/config'
import { VitePWA } from 'vite-plugin-pwa'

export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        manifest: {
          name: 'ElevateYou',
          short_name: 'ElevateYou',
          description: 'ElevateYou is a web app that helps you track your daily habits and goals.',
          start_url: '/',
          scope: '/',
          display: 'standalone',
          background_color: '#ffffff',
          theme_color: '#ffffff',
          icons: [
            {
              src: '/icons/144x144.png',
              sizes: '144x144',
              type: 'image/png',
              purpose: 'any'
            },
            {
              src: '/icons/192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: '/favicon/512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ],
          screenshots: [
            {
              src: '/screenshots/screenshot1.png',
              sizes: '1080x1920',
              type: 'image/png',
              form_factor: 'wide'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,png,svg,ico,json}'],
          navigateFallback: 'https://elevate-you-rho.vercel.app/',
          navigateFallbackDenylist: [/^\/nuxt\//, /\/api\//]
        },
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'mask-icon.svg'],
        srcDir: 'public'
      })
    ]
  },
  app: {
    head: {
      link: [{ rel: 'manifest', href: '/manifest.json' }]
    }
  },
  compatibilityDate: '2025-02-15'
})
