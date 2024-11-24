export default defineEventHandler((event) => {
  event.context.storage = useStorage('db');
});
