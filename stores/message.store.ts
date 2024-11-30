import type {Thread} from "~/node_modules/openai/resources/beta";

export const useMessageStore = defineStore('message', {
  state: () => {
    return {
      messages: [] as Message[],
      stream: undefined as ReadableStream | undefined,
      thread: undefined as Thread | undefined,
      controllers: [] as AbortController[],
      loading: false,
    }
  },
  actions: {
    async addMessage(msg: OutgoingMessage) {
      if(!this.thread) return;
      await $fetch(`/api/assistants/${useUserStore().activeAssistantId}/thread/messages`, {
        method: 'POST',
        body: JSON.stringify(msg),
      });
      this.messages.unshift({
        id: Date.now().toString(),
        role: 'user',
        content: [
          ...msg.content.map(c => ({
            type: c.type,
            text: {
              value: c.text,
              annotations: [],
            }
          })),
        ],
        attachments: msg.attachments,
      });
    },
    async getMessages() {
      const assistant = useUserStore().activeAssistantId;
      if(!assistant || !this.thread) return;
      const controller = new AbortController();
      this.controllers.push(controller);
      // @ts-ignore
      this.messages = await $fetch(`/api/assistants/${assistant}/thread/messages`, {
        signal: controller.signal,
      });
      this.controllers = this.controllers.filter(c => c !== controller);
    },
    async runThread() {
      const assistant = useUserStore().activeAssistantId;
      if (!assistant) return;

      const response = await fetch(`/api/assistants/${assistant}/thread/run`);
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if(!reader) throw new Error('No reader');
      let streamingMessage = '';
      const stream = new ReadableStream({
        async start(controller) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if(!value) continue;
            const chunk = decoder.decode(value, { stream: true });
            controller.enqueue(chunk);
            streamingMessage += chunk ?? '';
          }
          controller.close();
        }
      });
      this.stream = stream;
      return stream;
    },
    async setThread() {
      const assistant = useUserStore().activeAssistantId;
      if(!assistant) return;
      const controller = new AbortController();
      this.controllers.push(controller);
      this.thread = await $fetch(`/api/assistants/${assistant}/thread`, {
        signal: controller.signal,
      });
      this.controllers = this.controllers.filter(c => c !== controller);
    },
    async deleteThread() {
      const assistant = useUserStore().activeAssistantId;
      if(!assistant || !this.thread) return;
      await $fetch(`/api/assistants/${assistant}/thread`, {
        method: 'DELETE',
      });
      this.thread = undefined;
    },
    $reset() {
      this.loading = true;
      this.messages = [];
      this.thread = undefined;
      this.controllers.forEach(c => c.abort());
      this.controllers = [];
      this.setThread().then(() => {
        this.getMessages().then(() => {
          this.loading = false;
        });
      });
    }
  },
  getters: {
    threadId: (state) => state.thread?.id,
  },
});

