export interface OutgoingMessage {
  role: 'user' | 'assistant';
  content: Array<{
    type: string;
    text: string;
  }>;
  attachments?: Array<MessageAttachment>;
}

export interface ImageAttachment {
  type: 'image';
  url: string;
  filename?: never;
  mimeType?: never;
}

export interface FileAttachment {
  type: 'file';
  filename: string;
  mimeType: string;
  url: string;
}

export type MessageAttachment = ImageAttachment | FileAttachment;

export interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: Array<{
    type: string;
    text: {
      value: string;
      annotations: Array<{
        text: string;
        file_citation: {
          file_id: string;
        };
      }>;
    },
    image_file?: {
      file_id: string;
    }
  }>;
  attachments?: Array<MessageAttachment>;
}
