import type { EventHandler, EventHandlerRequest } from 'h3';

export const defineAuthenticatedHandler = <T extends EventHandlerRequest, D>(
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    const user = event.context.logtoUser;
    if (!user) {
      setResponseStatus(event, 401);
      return { error: 'Unauthorized' };
    }

    event.context.user = user;
    event.context.assistants = Object.keys(user.custom_data?.assistants || {});

    try {
      // Call the actual handler
      return await handler(event);
    } catch (err) {
      // Error handling
      console.error(err);
      return { err };
    }
  });
