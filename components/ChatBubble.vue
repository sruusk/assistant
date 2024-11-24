<template>
  <div>
    {{ messageText }}
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
  },
  data() {
    return {
      messageText: this.message?.content?.map((content: any) => content.text.value).join(' ') ?? '',
      streaming: false,
    };
  },
  setup() {
    const messageStore = useMessageStore();
    return {
      messageStore,
    };
  },
  mounted() {
    this.fetchStream();
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
      this.streaming = false;
      this.messageStore.stream = undefined;
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
        this.fetchStream();
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>

</style>
