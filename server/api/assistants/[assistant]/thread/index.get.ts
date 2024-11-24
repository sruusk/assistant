import type {Thread} from "~/node_modules/openai/resources/beta";

export default defineAssistantAuthenticatedHandler(async (event): Promise<Thread> => {
  const assistant = getRouterParam(event, 'assistant');

  const userThread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);

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
  await event.context.storage.setItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`, newThread.id);

  return newThread as Thread;
});
