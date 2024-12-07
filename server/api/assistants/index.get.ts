export default defineAuthenticatedHandler(async (event) => {
  // For testing
  // const assistants = await event.context.openai.beta.assistants.list();
  // return assistants.data.map((asst: any) => asst.id);

  return event.context.assistants || [] as string[];
});
