export default defineAssistantAuthenticatedHandler(async (event) => {
  return await event.context.openai.beta.assistants.retrieve(event.context.assistant);
});
