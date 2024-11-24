export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  return await event.context.openai.beta.assistants.retrieve(assistant);
});
