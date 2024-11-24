<template>
  <div class="w-full">
    <template v-if="parsedMarkdownLatex">
      <div v-html="parsedMarkdownLatex" class="w-full text-wrap whitespace-break-spaces"/>
    </template>
    <template v-else>
      {{ messageText }}
    </template>
  </div>
</template>

<script lang="ts">
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
import remarkMath from 'remark-math'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import {unified} from 'unified'

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
  computed: {
    parsedMarkdownLatex() {
      if(!this.message) return undefined;
      console.log('parsing');
      const message = this.message.content
        .map((content: any) => content.text.value)
        .join(' ')
        .replace(/\\\[\n\s*(.+?)\n\s+?\\\]\n?/g, `\$\$ $1 \$\$`)
        .replace(/\\\(\s*(.+?)\s*\\\)/g, `\$\$ $1 \$\$`);
      console.log(message);
      return unified()
        .use(remarkParse)
        .use(remarkMath)
        .use(remarkRehype)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .processSync(message);
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
:deep(.katex-html) {
  display: none;
}
:deep(ul), :deep(ol) {
  line-height: 0;
}
:deep(li) {
  line-height: 1.5;
}
</style>
