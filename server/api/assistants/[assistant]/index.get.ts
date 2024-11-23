export default defineEventHandler(async (event) => {
  const user = event.context.logtoUser;
  if (!user) {
    setResponseStatus(event, 401);
    return {error: 'Unauthorized'};
  }

  const userAssistants = await useStorage<string[]>().getItem(`user:${user.sub}:assistants`) || [];

  const assistant = getRouterParam(event, 'assistant');
  if(!assistant) {
    setResponseStatus(event, 400);
    return {error: 'Assistant not found'};
  }

  // Check if the user has access to the assistant
  // if(!userAssistants || !userAssistants.includes(assistant)) {
  //   setResponseStatus(event, 403);
  //   return {error: 'Forbidden'};
  // }

  return await event.context.openai.beta.assistants.retrieve(assistant);
});
