export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = event.context.assistant;
  const thread = event.context.assistantThread;
  if(!thread) {
    setResponseStatus(event, 409); // Conflict
    return { error: 'Thread not found' };
  }

  const assistantData: { metadata?: AssistantMetadata } = await $fetch(`/api/assistants/${assistant}`, {
    method: 'GET',
    headers: getRequestHeaders(event)  as HeadersInit,
  });

  let truncation: Truncation = {};

  if(assistantData.metadata) {
    if(assistantData.metadata.max_prompt_tokens || assistantData.metadata.max_completion_tokens) {
      assistantData.metadata.max_prompt_tokens && (truncation.max_prompt_tokens = assistantData.metadata.max_prompt_tokens);
      assistantData.metadata.max_completion_tokens && (truncation.max_completion_tokens = assistantData.metadata.max_completion_tokens);
    } else if(assistantData.metadata.last_messages) {
      truncation.truncation_strategy = {
        type: 'last_messages',
        last_messages: assistantData.metadata.last_messages,
      };
    } else {
      truncation = defaultTruncation
    }
  } else {
    truncation = defaultTruncation;
  }

  const stream = new ReadableStream({
    async start(controller) {
      const oaiStream = await event.context.openai.beta.threads.runs.create(
        thread,
        {
          assistant_id: assistant,
          stream: true,
          ...truncation,
        }
      );

      for await (const event of oaiStream) {
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
        } else if(event.event === 'thread.run.completed') {
          const usage = event.data.usage;
          console.log(`Run completed, used:
          \r- Prompt tokens: ${usage.prompt_tokens}
          \r- Completion tokens: ${usage.completion_tokens}
          \r- Total tokens: ${usage.total_tokens}`);
        } else console.log('Received event', event);
      }
      controller.close();
    }
  });

  return sendStream(event, stream);
});

interface Truncation {
  truncation_strategy?: {
    type: 'last_messages' | 'auto',
    last_messages?: number,
  },
  max_prompt_tokens?: number,
  max_completion_tokens?: number,
}

const defaultTruncation: Truncation = {
  truncation_strategy: {
    type: 'last_messages',
    last_messages: 20,
  }
}
