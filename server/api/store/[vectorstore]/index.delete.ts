export default defineAuthenticatedHandler(async (event) => {
  const storeId = getRouterParam(event, 'vectorstore');
  if(!storeId) {
    setResponseStatus(event, 400);
    return;
  }

  const files = await event.context.openai.beta.vectorStores.files.list(storeId);
  for(const file of files.data) {
    await $fetch(`/api/store/${storeId}/${file.id}`, {
      method: 'DELETE',
      headers: getRequestHeaders(event) as HeadersInit,
    });
  }
  console.log('Deleted all files from store', storeId);
  await event.context.openai.beta.vectorStores.del(storeId);
  console.log('Deleted store', storeId);
  return {success: true};
});
