import sharp from "sharp";
import { MessageAttachment, ImageAttachment, FileAttachment } from "~/utils/types";

export default defineAssistantAuthenticatedHandler(async (event) => {
  const assistant = getRouterParam(event, 'assistant');
  const thread = await event.context.storage.getItem(`user:${event.context.logtoUser.sub}:thread:${assistant}`);
  if(!thread) {
    setResponseStatus(event, 409); // Conflict
    return { error: 'Thread not found' };
  }

  const msg = await readBody(event);

  if(msg.attachments) {
    const imageFiles = await Promise.all(msg.attachments
      .filter((a: MessageAttachment) => a.type === 'image')
      .map(async (attachment: ImageAttachment) => {
        const file  = await scale(attachment.url);
        const f = await event.context.openai.files.create({
          file,
          purpose: 'vision'
        });
        return f.id;
    }));
    const files = await Promise.all(msg.attachments
      .filter((a: MessageAttachment) => a.type === 'file')
      .map(async (attachment: FileAttachment) => {
        const file = await base64ToFile(attachment.url, attachment.filename, attachment.mimeType);
        const f = await event.context.openai.files.create({
          file,
          purpose: 'assistants'
        });
        return f.id;
      }));

    delete msg.attachments;
    msg.content = [...msg.content, ...imageFiles.map(id => ({ type: 'image_file', image_file: { file_id: id } }))];
    msg.attachments = files.map(id => ({ file_id: id, tools: [{ type: 'file_search' }] }));
  }

  return event.context.openai.beta.threads.messages.create(thread, msg);
});

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

const base64ToFile = async (base64: string, filename: string, mimeType: string): Promise<File> => {
  // Remove header from base64 string
  const base64File: string = base64.split(';base64,').pop() || '';
  // Convert base64 string to buffer
  const buffer = Buffer.from(base64File, 'base64');
  return new File([buffer], filename, { type: mimeType });
};
