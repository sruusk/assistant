export default defineAuthenticatedHandler(async (event) => {
  const data = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:assistants`);

  return data || [];
});
