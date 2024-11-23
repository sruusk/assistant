export default defineNuxtRouteMiddleware((to, from) => {
  if(!to.meta.requireAuth) return true;
  const user = useLogtoUser();
  if(!user) {
    return '/login';
  }
  return true;
})
