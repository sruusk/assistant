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
        } else if(event.event === 'thread.run.failed') {
          const errorMsg = event.data.last_error?.message;
          const gptRx = /Request too large for (gpt-[^-]{1,2}(-\w+)?)/gi;
          const gptMatch = gptRx.exec(errorMsg);
          if(gptMatch) {
            const gptVersion = gptMatch[1];
            console.error(`Request too large for ${gptVersion}`);
            controller.enqueue(`TOKEN_LIMIT|${gptVersion}|`);
          }
          console.error('Thread run failed:', errorMsg);
        }
      }
      controller.close();
    }
  });

  return sendStream(event, stream);
});
