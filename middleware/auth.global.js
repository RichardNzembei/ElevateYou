export default defineNuxtRouteMiddleware(async (to, from) => {
    // Only run on client side
    if (process.server) return

    const { $auth, $authReady } = useNuxtApp()

    // Wait for Firebase to restore auth session before making decisions
    await $authReady

    const isLoggedIn = !!$auth.currentUser
    const authPages = ['/login', '/register', '/forgot-password']
    const protectedPages = ['/dashboard']

    // Allow invite pages for everyone
    if (to.path.startsWith('/invite/')) return

    // Don't redirect away from auth pages if there's a redirect param (invite flow)
    const hasRedirect = !!to.query.redirect

    // Redirect logged-in users away from auth pages to dashboard (unless redirecting from invite)
    if (isLoggedIn && authPages.includes(to.path) && !hasRedirect) {
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
