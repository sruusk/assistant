export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');

  const body = await readBody(event);

  return await event.context.openai.beta.assistants.update(assistant, body);
});
