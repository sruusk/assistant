import sharp from "sharp";

export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const thread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);
  if(!thread) {
    setResponseStatus(event, 409); // Conflict
    return { error: 'Thread not found' };
  }

  const msg = await readBody(event);

  if(msg.attachments) {
    const files = await Promise.all(msg.attachments
      .filter((a: Attachment) => a.type === 'image')
      .map(async (attachment: any) => {
        const file  = await scale(attachment.url);
        const f = await event.context.openai.files.create({
          file,
          purpose: 'vision'
        });
        return f.id;
    }));
    delete msg.attachments;
    msg.content = [...msg.content, ...files.map(id => ({ type: 'image_file', image_file: { file_id: id } }))];
  }

  return event.context.openai.beta.threads.messages.create(thread, msg);
});

interface Attachment {
  type: string;
  url: string;
}

const scale = (image: string, targetWidth:number = 800):Promise<File> => {
  return base64ToImage(image)
    .then((buffer) => sharp(buffer)
      .resize({
        width: targetWidth,
        withoutEnlargement: true
      })
      .toFormat('webp')
      .toBuffer()
      .then((data) => {
        return new File([data], 'scaled.webp', { type: 'image/webp' });
      })
    )
    .catch((err) => {
      throw new Error('Failed to scale image');
    });
};

const base64ToImage = async (base64: string): Promise<Buffer> => {
  // Remove header from base64 string
  const base64Image: string = base64.split(';base64,').pop() || '';
  // Convert base64 string to buffer
  return Buffer.from(base64Image, 'base64');
};
