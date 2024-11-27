export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const thread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);
  if(!thread) {
    setResponseStatus(event, 409); // Conflict
    return { error: 'Thread not found' };
  }

  const messages = (await event.context.openai.beta.threads.messages.list(thread)).data;

  return await Promise.all(messages.map(async (msg: any) => {
    if(msg.content) {
      const attachments = msg.content.filter((c: any) => c.type === 'image_file');
      if(attachments.length > 0) {
        msg.attachments = await Promise.all(attachments.map(async (attachment: any) => {
          const file: File = await event.context.openai.files.content(attachment.image_file.file_id);
          return {
            type: 'image',
            url: 'data:image/webp;base64,' + Buffer.from(await file.arrayBuffer()).toString('base64'),
          };
        }));
      }
    }
    return msg;
  }));
});
