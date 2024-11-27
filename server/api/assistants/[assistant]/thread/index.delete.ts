export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const userThread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);

  if(userThread) {
    // Delete all attached file first
    const messages: any[] = await $fetch(`/api/assistants/${assistant}/thread/messages`, {
      method: 'GET',
      headers: getRequestHeaders(event) as HeadersInit,
    });
    const files = messages
      .map((m) => m.content)
      .flat()
      .filter((c) => c.type === 'image_file')
      .map((c) => c.image_file.file_id);

    await Promise.all(files.map(async (fileId) => {
      await event.context.openai.files.del(fileId);
    }));

    const response = await event.context.openai.beta.threads.del(userThread);
    console.log('Deleted thread', userThread, response);
    return response;
  }
  else {
    setResponseStatus(event, 404); // Not Found
    return { error: 'Thread not found' };
  }
});
