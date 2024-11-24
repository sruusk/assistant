export default defineAuthenticatedHandler(async (event) => {
  const storeId = getRouterParam(event, 'vectorstore');
  const fileId = getRouterParam(event, 'file');
  if(!storeId || !fileId) {
    setResponseStatus(event, 400);
    return;
  }


  const promises = [
    event.context.openai.beta.vectorStores.files.del(storeId, fileId),
    event.context.openai.files.del(fileId)
  ];
  await Promise.all(promises);
  console.log('Deleted file', fileId, 'from store', storeId);
  return {success: true};
});
