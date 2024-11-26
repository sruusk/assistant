export default defineAuthenticatedHandler(async (event) => {
  const storeId = getRouterParam(event, 'vectorstore');
  if(!storeId) {
    setResponseStatus(event, 400);
    return;
  }

  const store = await event.context.openai.beta.vectorStores.files.list(storeId);
  const promises = store.data.map(async (file: any) => {
    try { file.filename = (await event.context.openai.files.retrieve(file.id)).filename; }
    catch(e: any) { if(!e?.toString().trim().startsWith('Error: 404')) console.error(e); }
  });
  await Promise.all(promises);
  return store.data.filter((file: any) => file.filename);
});
