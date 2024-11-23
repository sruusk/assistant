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
  console.log('Modifying assistant', body);

  const modifiedAssistant = await event.context.openai.beta.assistants.update(assistant, body);
  console.log('Modified assistant', modifiedAssistant);
  return modifiedAssistant;
});
