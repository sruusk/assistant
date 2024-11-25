<template>
  <div class="w-full">
    <template v-if="latexEnabled">
      <div v-html="parsedMarkdownLatex" class="w-full text-wrap whitespace-break-spaces latex"/>
    </template>
    <template v-else-if="markdownEnabled && messageText.length">
      <MDC :value="messageText" class="w-full text-wrap whitespace-break-spaces markdown"/>
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
    renderer: {
      type: String,
      required: false,
      default: 'markdown',
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
      toast: useToast(),
    };
  },
  mounted() {
    this.fetchStream();
  },
  computed: {
    parsedMarkdownLatex() {
      if(!this.message || !this.latexEnabled) return undefined;
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
    },
    latexEnabled() {
      return this.renderer === 'latex';
    },
    markdownEnabled() {
      return this.renderer === 'markdown';
    },
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
          duration: 10000,
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
        this.fetchStream();
      },
      immediate: true,
    },
  },
});
</script>

<style scoped>
.latex :deep(.katex-html) {
  display: none;
}
.latex :deep(mfrac) {
  padding: 0 3px;
}
.latex :deep(mrow > *) {
  margin: 0 1px;
}
.latex :deep(ul), .latex :deep(ol) {
  line-height: 0;
  margin: -0.7em 0 -0.3em 0;
}
.latex :deep(li), .latex :deep(p) {
  line-height: 1.2;
}
.latex :deep(p) {
  margin: -0.7em 0;
}
.latex :deep(p:has(> span)) {
  margin-bottom: 0;
}
:deep(.markdown pre) {
  max-width: 100%;
  width: 100%;
  overflow-x: auto;
}
:deep(.markdown code) {
  max-width: 100%;
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
