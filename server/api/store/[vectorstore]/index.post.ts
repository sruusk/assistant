export default defineAuthenticatedHandler(async (event) => {
  const storeId = getRouterParam(event, 'vectorstore');
  if(!storeId) {
    setResponseStatus(event, 400);
    return;
  }

  const body = await readFormData(event);

  // Read the file from the request to upload
  const upload = body.get('file');

  return await event.context.openai.beta.vectorStores.files.uploadAndPoll(storeId, upload, { timeout: 40000 }); // 40 seconds
});
