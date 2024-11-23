export default defineEventHandler(async (event) => {
  const user = event.context.logtoUser;
  if (!user) {
    setResponseStatus(event, 401);
    return {error: 'Unauthorized'};
  }

  return event.context.openai.beta.vectorStores.create();
});
