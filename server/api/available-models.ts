export default defineAuthenticatedHandler(async (event) => {
  return event.context.openai.models.list();
});
