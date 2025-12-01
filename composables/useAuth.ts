export default defineNuxtRouteMiddleware((to, from) => {
    if (process.server) return

    const { $auth } = useNuxtApp()

    if (!$auth.currentUser && to.path !== '/login' && to.path !== '/') {
        return navigateTo('/login')
    }

    if ($auth.currentUser && (to.path === '/login' || to.path === '/')) {
        return navigateTo('/dashboard')
    }
})