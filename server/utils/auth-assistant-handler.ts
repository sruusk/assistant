import type { EventHandler, EventHandlerRequest } from 'h3';

export const defineAssistantAuthenticatedHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    const user = event.context.logtoUser;
    if (!user) {
      setResponseStatus(event, 401);
      return { error: 'Unauthorized' };
    }

    const assistant = getRouterParam(event, 'assistant');
    if (!assistant) {
      setResponseStatus(event, 400);
      return { error: 'Assistant not found' };
    }

    const userAssistants = await event.context.storage.getItem(`user:${user.sub}:assistants`) || [];
    if (!userAssistants.includes(assistant)) {
      setResponseStatus(event, 403);
      return { error: 'Forbidden' };
    }

    try {
      // Call the actual handler
      return await handler(event);
    } catch (err) {
      // Error handling
      console.error(err);
      return { err };
    }
  });
