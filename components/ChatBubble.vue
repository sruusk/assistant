<template>
  <div class="w-full">
    <template v-if="parsedMarkdownLatex">
      <div v-html="parsedMarkdownLatex" class="w-full text-wrap whitespace-break-spaces markdown"/>
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
    markdownEnabled: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      messageText: this.message?.content?.map((content: any) => content.text.value).join('\n') ?? '',
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
      if(!this.message || !this.markdownEnabled) return undefined;
      const message = this.message.content
        .map((content: any) => content.text.value)
        .join(' ')
        .replace(/\\\[\n(?:\s+)?(.+?)\n(?:\s+)?\\\]/g, `\$\$ $1 \$\$`)
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
.markdown :deep(.katex-html) {
  display: none;
}
.markdown :deep(mfrac) {
  padding: 0 3px;
}
.markdown :deep(mrow > *) {
  margin: 0 1px;
}
.markdown :deep(ul), .markdown :deep(ol) {
  line-height: 0;
  margin: -0.7em 0 -0.3em 0;
}
.markdown :deep(li), .markdown :deep(p) {
  line-height: 1.2;
}
.markdown :deep(p) {
  margin: -0.7em 0;
}
.markdown :deep(p:has(> span)) {
  margin-bottom: 0;
}
</style>
