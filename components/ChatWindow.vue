<template>
  <UCard class="h-full flex flex-col" :ui="{ body: 'grow overflow-y-hidden' }">
    <div class="flex flex-col-reverse items-center justify-start h-full overflow-y-auto gap-5 px-2">
      <USeparator v-if="userStore.activeAssistantId && !messageStore.loading && !messageStore.messages?.length" orientation="horizontal" class="w-full">{{ $t('dashboard.noMessages') }}</USeparator>

      <USeparator v-if="messageStore.stream" orientation="horizontal" class="w-full">Assistant</USeparator>
      <ChatBubble :stream="messageStore.stream"/>

      <template v-for="message in messageStore.messages" :key="message.id">
        <ChatBubble :message="message" :renderer="renderer"/>
        <USeparator orientation="horizontal" class="w-full capitalize">{{ message.role }}</USeparator>
      </template>
      <USkeleton v-if="messageStore.loading" class="w-full h-16" v-for="i in 5" :key="i"/>
    </div>
    <template #footer>
      <ImagePreview v-if="images.length" :images="images" class="pb-4" @remove="(index) => images.splice(index, 1)"/>
      <UButtonGroup v-if="userStore.activeAssistantId" class="w-full">
        <UTextarea :autoresize="true"
                   :rows="1"
                   :maxrows="6"
                   autocomplete="off"
                   autocorrect="on"
                   @keydown.enter.prevent.exact="sendMessage"
                   @keydown.ctrl.enter.prevent.exact="message += '\n'"
                   @keydown.shift.enter.prevent.exact="message += '\n'"
                   @paste="handlePaste"
                   v-model="message"
                   :placeholder="$t('dashboard.messagePlaceholder')"
                   :ui="{ base: ['resize-none rounded-r-none'] }"
                   class="w-full"
        />
        <UButton :disabled="messageStore.loading"
                 @click="sendMessage"
                 icon="material-symbols:send-rounded"
                 variant="outline"
                 color="neutral"
                 :loading="sendingMessage"
        />
        <UDropdownMenu :items="menuItems">
          <UButton icon="i-lucide-menu" color="neutral" variant="outline" />
        </UDropdownMenu>
      </UButtonGroup>
      <USkeleton v-else class="w-full h-8"/>
    </template>
  </UCard>
</template>

<script lang="ts">

import ImagePreview from "~/components/ImagePreview.vue";

export default defineNuxtComponent({
  name: "ChatWindow",
  components: {ImagePreview},
  data() {
    return {
      message: "",
      renderer: "markdown",
      sendingMessage: false,
      images: [] as string[],
      menuItems: [
        [
          {
            label: this.$t('dashboard.markdown'),
            icon: "material-symbols:markdown",
            checked: true,
            val: "markdown",
            onSelect: () => this.setRenderer("markdown"),
            type: "checkbox",
          },
          {
            label: this.$t('dashboard.resetConversation'),
            icon: "material-symbols-light:directory-sync",
            onSelect: this.clearConversation,
          }
        ]
      ]
    };
  },
  async setup() {
    const messageStore = useMessageStore();

    return {
      messageStore,
      userStore: useUserStore(),
    };
  },
  methods: {
    async sendMessage() {
      this.sendingMessage = true;
      await this.messageStore.addMessage({
        role: "user",
        content: [
          {
            type: 'text',
            text: {
              value: this.message,
              annotations: [],
            }
          },
          ...(this.images.length ?
            this.images.map((image: string) => ({
              type: 'image_url',
              image_url: {
                url: image,
              }
            })) : []),
        ],
      });
      this.message = "";
      await this.messageStore.runThread();
      this.sendingMessage = false;
    },
    async clearConversation() {
      await this.messageStore.deleteThread();
      this.messageStore.$reset();
    },
    setRenderer(renderer: string) {
      if(this.renderer === renderer) this.renderer = "text";
      else this.renderer = renderer;
    },
    handleImageUpload(file: File) {
      if(!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.images.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            const file = item.getAsFile();
            if (file) {
              this.handleImageUpload(file);
            }
          }
        }
      }
    },
  },
  watch: {
    renderer() {
      this.menuItems[0].forEach((item) => {
        item.checked = item.val === this.renderer;
      });
    }
  },
});
</script>

<style scoped>

</style>
