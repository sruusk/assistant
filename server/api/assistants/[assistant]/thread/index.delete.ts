export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = event.context.assistant;
  const userThread = event.context.assistantThread;

  if(userThread) {
    // Delete all attached file first
    const messages = await event.$fetch(`/api/assistants/${assistant}/thread/messages`, { method: 'GET' });
    if(!Array.isArray(messages)) return messages;
    const files = [
      ...messages
        .map((m) => m.content)
        .flat()
        .filter((c) => c.type === 'image_file')
        .map((c) => c.image_file?.file_id),
      ...messages
        .map((m) => m.attachments)
        .flat()
        // @ts-ignore
        .filter((a) => a.type === 'file')
        // @ts-ignore
        .map((a) => a.file_id),
    ];

    await Promise.all(files.map(async (fileId) => {
      try {
        await event.context.openai.files.del(fileId);
      } catch(e) {
        console.error('Failed to delete file', fileId, e);
      }
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
