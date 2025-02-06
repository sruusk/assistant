<template>
  <div>
    <div class="flex flex-wrap gap-3">
      <FilePreview v-if="files?.length" :files="files" static class="pb-3"/>
      <ImagePreview v-if="images?.length" :images="images" static class="pb-3"/>
    </div>
    <template v-if="markdownEnabled && latexMessage.length">
      <MDC :value="latexMessage" class="w-full text-wrap whitespace-break-spaces markdown grid"/>
    </template>
    <template v-else v-for="line in messageText.split('\n')" :key="line">
      <p v-if="line.length"
         class="w-full text-wrap whitespace-break-spaces"
      >
        {{ line }}
      </p>
      <br v-else/>
    </template>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "ChatBubble",
  props: {
    message: {
      type: Object,
      required: false,
    },
    stream: {
      type: ReadableStream,
      required: false,
    },
    renderer: {
      type: String,
      required: false,
      default: 'markdown',
    },
  },
  data() {
    return {
      messageText: this.message?.content?.filter((content: any) => content.type === 'text').map((content: any) => content.text?.value).join('\n') ?? '',
      messageImages: this.message?.content?.filter((content: any) => content.type === 'image_url') ?? [],
      streaming: false,
    };
  },
  setup() {
    const messageStore = useMessageStore();
    return {
      messageStore,
      toast: useToast(),
    };
  },
  mounted() {
    this.fetchStream();
  },
  computed: {
    latexMessage() {
      return this.messageText
        .replace(/\\[\[(]\n?(?: *`? *((?:.|\n)+?) *`? *)\n? *\\[\])]/g, "\$\$ $1 \$\$")
        .replace("\n", "<br>");
    },
    latexEnabled() {
      return this.renderer === 'latex';
    },
    markdownEnabled() {
      return this.renderer === 'markdown';
    },
    images(): string[] {
      const images = this.message?.attachments?.filter((attachment: MessageAttachment) => attachment.type === 'image') ?? [];
      return images.map((attachment: MessageAttachment) => attachment.url);
    },
    files(): string[] {
      const files = this.message?.attachments?.filter((attachment: MessageAttachment) => attachment.type === 'file') ?? [];
      return files.map((attachment: MessageAttachment) => attachment.filename);
    }
  },
  methods: {
    async fetchStream() {
      if(!this.stream) return;
      this.streaming = true;
      this.messageText = '';
      const reader = this.stream.getReader();
      let result = await reader.read();
      while (!result.done) {
        this.messageText += result.value;
        result = await reader.read();
      }

      const tokenErrorRx = /TOKEN_LIMIT\|(.+)\|/g;
      const tokenError = tokenErrorRx.exec(this.messageText);
      if(tokenError) {
        const model = tokenError[1];
        this.toast.add({
          title: this.$t('dashboard.tokenLimitErrorTitle'),
          description: this.$t('dashboard.tokenLimitErrorDescription', { model }),
          color: 'error',
          duration: 15000,
          actions: [{
            icon: 'i-lucide-refresh-ccw',
            label: this.$t('dashboard.resetConversation'),
            color: 'error',
            variant: 'outline',
            onClick: async (e) => {
              await this.messageStore.deleteThread();
              this.messageStore.$reset();
            }
          }]
        })
        // this.messageText = this.$t('dashboard.tokenLimitErrorDescription', { model });
        this.messageText = '';
      }

      this.streaming = false;
      this.messageStore.stream = undefined;
      if(this.messageText?.length)
        this.messageStore.messages.unshift({
          id: Date.now().toString(),
          role: 'assistant',
          content: [{ type: 'text', text: { value: this.messageText, annotations: [] } }],
        });
      this.messageText = '';
    },
  },
  watch: {
    stream: {
      handler() {
        if(this.streaming) return;
        this.$nextTick(() => this.fetchStream());
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>
</style>
