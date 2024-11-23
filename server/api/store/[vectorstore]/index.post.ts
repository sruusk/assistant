export default defineEventHandler(async (event) => {
  const user = event.context.logtoUser;
  if (!user) {
    setResponseStatus(event, 401);
    return {error: 'Unauthorized'};
  }

  const storeId = getRouterParam(event, 'vectorstore');
  if(!storeId) {
    setResponseStatus(event, 400);
    return;
  }

  const body = await readBody(event);

  const file = await event.context.openai.beta.vectorStores.files.uploadAndPoll(storeId, body);

  console.log(file);

  return file;
});
