export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const thread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);
  if(!thread) {
    setResponseStatus(event, 409); // Conflict
    return { error: 'Thread not found' };
  }

  const messages = (await event.context.openai.beta.threads.messages.list(thread)).data;

  return await Promise.all(messages.map(async (msg: any) => {

    if(msg.attachments) {
      const files = (await Promise.all(msg.attachments.map(async (attachment: any) => {
        try {
          if(!attachment.file_id) return null;
          const { id, filename } = await event.context.openai.files.retrieve(attachment.file_id);
          return {
            type: 'file',
            file_id: id,
            filename,
          };
        } catch(e) {
          console.error('Failed to retrieve file', e);
          return null;
        }
      }))).filter((f) => f);
      msg.attachments = files || [];
    }

    if(msg.content) {
      const imageAttachments = msg.content.filter((c: any) => c.type === 'image_file');
      if(imageAttachments.length > 0) {
        const images = await Promise.all(imageAttachments.map(async (attachment: any) => {
          try {
            const file: File = await event.context.openai.files.content(attachment.image_file.file_id);
            return {
              type: 'image',
              url: `data:image/webp;base64,${Buffer.from(await file.arrayBuffer()).toString('base64')}`,
            };
          } catch(e) {
            console.error('Failed to retrieve image', e);
            return null;
          }
        }));
        msg.attachments = [...(msg.attachments || []), ...images.filter((i) => i)];
      }
    }

    return msg;
  }));
});
