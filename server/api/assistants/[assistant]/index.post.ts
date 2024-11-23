export default defineEventHandler(async (event) => {
  const user = event.context.logtoUser;
  if (!user) {
    setResponseStatus(event, 401);
    return {error: 'Unauthorized'};
  }

  const assistant = getRouterParam(event, 'assistant');
  if(!assistant) {
    setResponseStatus(event, 400);
    return {error: 'Assistant not found'};
  }

  const body = readBody(event);
  console.log(body);

  const newAssistant = await event.context.openai.beta.assistants.create(body);
  console.log(newAssistant);
  return newAssistant;
});
