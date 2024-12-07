import type {Thread} from "~/node_modules/openai/resources/beta";

export default defineAssistantAuthenticatedHandler(async (event): Promise<Thread> => {
  const userThread = event.context.assistantThread;

  if(userThread) {
    try {
      const thread = await event.context.openai.beta.threads.retrieve(userThread);
      console.log('Retrieved thread:', thread);
      if(thread) return thread;
    } catch(e) {
      console.error('Failed to retrieve thread', userThread, e);
    }
  }

  const newThread = await event.context.openai.beta.threads.create();
  console.log('Created thread:', newThread);

  const userAssistants = event.context.user.custom_data?.assistants || {};
  userAssistants[event.context.assistant].thread = newThread.id;
  await updateLogtoCustomData(event, {assistants: userAssistants});

  return newThread as Thread;
});
