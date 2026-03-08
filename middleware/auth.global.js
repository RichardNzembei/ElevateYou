export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (process.server) return

    const { $auth, $authReady } = useNuxtApp()

    // Wait for Firebase to restore auth session before making decisions
    await $authReady

    const isLoggedIn = !!$auth.currentUser
    const authPages = ['/login', '/register', '/forgot-password']
    const protectedPages = ['/dashboard']

    // Redirect logged-in users away from auth pages to dashboard
    if (isLoggedIn && authPages.includes(to.path)) {
        return navigateTo('/dashboard')
    }

    // Redirect unauthenticated users away from protected pages to login
    if (!isLoggedIn && protectedPages.includes(to.path)) {
        return navigateTo('/login')
    }

    // Redirect logged-in users from landing page to dashboard
    if (isLoggedIn && to.path === '/') {
        return navigateTo('/dashboard')
    }
})
