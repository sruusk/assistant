export default defineAuthenticatedHandler(async (event) => {
  // For testing
  // const assistants = await event.context.openai.beta.assistants.list();
  // return assistants.data.map((asst: any) => asst.id);

  const data = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:assistants`);

  return data || [];
});
