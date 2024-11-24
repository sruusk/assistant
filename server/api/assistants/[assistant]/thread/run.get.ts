export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const thread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);
  if(!thread) {
    setResponseStatus(event, 409); // Conflict
    return { error: 'Thread not found' };
  }

  const stream = new ReadableStream({
    async start(controller) {
      const oaiStream = await event.context.openai.beta.threads.runs.create(
        thread,
        { assistant_id: assistant, stream: true }
      );

      for await (const event of oaiStream) {
        console.log('Received event', event);
        if(event.event === 'thread.message.delta') {
          controller.enqueue(event.data.delta.content[0].text.value);
        }
      }
      controller.close();
    }
  });

  return sendStream(event, stream);
});
