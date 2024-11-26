export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');

  const thread = await $fetch(`/api/assistants/${assistant}/thread`, {
    method: 'DELETE',
    headers: getRequestHeaders(event) as HeadersInit,
  });

  console.log('Deleted thread:', thread);

  const as = await event.context.openai.beta.assistants.retrieve(assistant);
  try {
    const vectorStore = as.tool_resources.file_search.vector_store_ids[0];
    await $fetch(`/api/store/${vectorStore}`, {
      method: 'DELETE',
      headers: getRequestHeaders(event) as HeadersInit,
    });
    await event.context.openai.beta.assistants.del(assistant);

    const userAssistants = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:assistants`) || [];
    const index = userAssistants.indexOf(assistant);
    if(index !== -1) {
      userAssistants.splice(index, 1);
      await event.context.storage.setItem(`user:${event.context.logtoUser.sub}:assistants`, userAssistants);
    }
    console.log('Deleted assistant:', assistant);
  } catch(e) {
    console.error('Failed to delete vector store', e);
    setResponseStatus(event, 500);
    return {success: false};
  }
  return {success: true};
});