export default defineAuthenticatedHandler(async (event) => {
  return event.context.openai.beta.vectorStores.create({
    name: `user:${event.context.logtoUser.sub}:store:${Date.now()}`,
  });
});
