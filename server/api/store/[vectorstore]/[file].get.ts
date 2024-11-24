export default defineAuthenticatedHandler(async (event) => {
  const storeId = getRouterParam(event, 'vectorstore');
  const fileId = getRouterParam(event, 'file');
  if(!storeId || !fileId) {
    setResponseStatus(event, 400);
    return;
  }


  const file = await event.context.openai.beta.vectorStores.files.retrieve(storeId, fileId);
  if(!file) {
    setResponseStatus(event, 404);
    return;
  }
  return file;
});
