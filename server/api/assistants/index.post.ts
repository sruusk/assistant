export default defineAuthenticatedHandler(async (event) => {
  const body = await readBody(event);

  const newAssistant = await event.context.openai.beta.assistants.create(body);

  const userAssistants = event.context.user.custom_data?.assistants || {};
  userAssistants[newAssistant.id] = {};
  await updateLogtoCustomData(event, {assistants: userAssistants});

  return newAssistant;
});
