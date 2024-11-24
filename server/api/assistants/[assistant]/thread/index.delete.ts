export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const userThread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);

  if(userThread) {
    const response = await event.context.openai.beta.threads.del(userThread);
    console.log('Deleting thread', userThread, response);
    return response;
  }
  else {
    setResponseStatus(event, 404); // Not Found
    return { error: 'Thread not found' };
  }
});
