export default defineNuxtMiddleware((to, from) => {
  if (!process.client) return;

  const { auth } = useFirebase();
  if (to.meta.requiresAuth && !auth.currentUser) {
    return navigateTo("/login");
  }
});
