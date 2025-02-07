export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = event.context.assistant;

  const thread = await event.$fetch(`/api/assistants/${assistant}/thread`, { method: 'DELETE' });

  console.log('Deleted thread:', thread);

  const as = await event.context.openai.beta.assistants.retrieve(assistant);
  try {
    const vectorStore = as.tool_resources.file_search.vector_store_ids[0];

    await event.$fetch(`/api/store/${vectorStore}`, { method: 'DELETE' });
    await event.context.openai.beta.assistants.del(assistant);

    delete event.context.user.custom_data.assistants[assistant];
    await updateLogtoCustomData(event, { assistants: event.context.user.custom_data.assistants });

    console.log('Deleted assistant:', assistant);
  } catch(e) {
    console.error('Failed to delete vector store', e);
    setResponseStatus(event, 500);
    return {success: false};
  }
  return {success: true};
});
