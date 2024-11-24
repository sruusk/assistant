export default defineAuthenticatedHandler(async (event) => {
  const body = await readBody(event);

  const newAssistant = await event.context.openai.beta.assistants.create(body);

  const userAssistants = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:assistants`) || [];
  userAssistants.push(newAssistant.id);
  console.log(userAssistants);
  await event.context.storage.setItem(`user:${event.context.logtoUser.sub}:assistants`, userAssistants);

  return newAssistant;
});
