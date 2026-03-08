export default defineNuxtRouteMiddleware((to, from) => {
    // Only run on client side
    if (process.server) return

    const { $auth } = useNuxtApp()

    // Protected routes that require authentication
    if (!$auth.currentUser && to.path === '/dashboard') {
        return navigateTo('/login')
    }

    // Redirect authenticated users away from auth pages to dashboard
    if ($auth.currentUser && (to.path === '/login' || to.path === '/register')) {
        return navigateTo('/dashboard')
    }
})
