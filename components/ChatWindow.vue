<template>
  <UCard class="h-full flex flex-col" :ui="{ body: 'grow overflow-y-hidden !py-0' }">
    <div class="flex flex-col-reverse items-center justify-start h-full overflow-y-auto gap-5 px-2">
      <div class="min-h-2"/>
      <ClientOnly>
        <UAlert v-if="userStore.noAssistants"
                :title="$t('dashboard.noAssistants')"
                :description="$t('dashboard.noAssistantsDescription')"
                color="warning"
                variant="subtle"
                icon="material-symbols:warning"
        />
      </ClientOnly>

      <USeparator v-if="userStore.activeAssistantId && !messageStore.loading && !messageStore.messages?.length"
                  orientation="horizontal"
                  class="w-full"
      >
        {{ $t('dashboard.noMessages') }}
      </USeparator>

      <template v-if="messageStore.stream">
        <ChatBubble :stream="messageStore.stream"/>
        <USeparator orientation="horizontal" class="w-full">Assistant</USeparator>
      </template>

      <template v-for="message in messageStore.messages" :key="message.id">
        <ChatBubble :message="message" :renderer="renderer"/>
        <USeparator orientation="horizontal" class="w-full capitalize">{{ message.role }}</USeparator>
      </template>
      <USkeleton v-if="messageStore.loading" class="w-full h-16" v-for="i in 5" :key="i"/>
      <div class="min-h-12"/>
    </div>
    <template #footer>
      <div class="flex flex-wrap gap-3">
        <FilePreview v-if="files.length"
                     :files="files.map(f => f.filename || 'error')"
                     class="pb-4"
                     @remove="(index) => files.splice(index, 1)"
        />
        <ImagePreview v-if="images.length"
                      :images="images"
                      class="pb-4"
                      @remove="(index) => images.splice(index, 1)"
        />
      </div>
      <UButtonGroup v-if="userStore.activeAssistantId" class="w-full h-min">
        <UTextarea :autoresize="true"
                   :rows="1"
                   :maxrows="6"
                   autocomplete="off"
                   autocorrect="on"
                   @keydown.enter.exact.prevent="sendMessage"
                   @paste.prevent="handlePaste"
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
        <UDropdownMenu :items="menuItems as any">
          <UButton icon="i-lucide-menu" color="neutral" variant="outline" />
        </UDropdownMenu>
      </UButtonGroup>
      <USkeleton v-else class="w-full h-8"/>
    </template>
  </UCard>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "ChatWindow",
  data() {
    return {
      message: "",
      renderer: "markdown",
      sendingMessage: false,
      images: [] as string[],
      files: [] as MessageAttachment[],
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
      toast: useToast(),
    };
  },
  methods: {
    async sendMessage() {
      if(this.sendingMessage) return;
      this.sendingMessage = true;
      await this.messageStore.addMessage({
        role: "user",
        content: [{
          type: 'text',
          text: this.message.replaceAll(`¨a`, 'ä').replaceAll(`¨o`, 'ö').replaceAll(`¨u`, 'ü'),
        }],
        ...((this.images.length || this.files.length) && {
          attachments: [
            ...this.images.map((image) => ({ type: 'image', url: image })),
            ...this.files,
          ] as MessageAttachment[],
        }),
      });
      this.message = "";
      this.images = [];
      this.files = [];
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

      if(this.userStore.activeAssistant.reasoning_effort) {
        return this.toast.add({
          title: this.$t('dashboard.imageReasoningErrorTitle'),
          description: this.$t('dashboard.imageReasoningErrorDescription', { model: this.userStore.activeAssistant.model }),
          color: 'warning',
        });
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        this.images.push(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    },
    handleFileUpload(file: File) {
      if(!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        console.log(file.name);
        this.files.push({
          type: 'file',
          filename: file.name,
          mimeType: file.type,
          url: e.target?.result as string,
        })
      };
      reader.readAsDataURL(file);
    },
    handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;
      if (items) {
        for (const item of items) {
          if(item.kind === 'file') {
            const file = item.getAsFile();
            if (item.type.startsWith('image/')) {
              if (file) {
                this.handleImageUpload(file);
              }
            } else if(isFileTypeAccepted(item.type)) {
              if (file) {
                this.handleFileUpload(file);
              }
            } else {
              this.toast.add({
                title: this.$t('dashboard.fileTypeErrorTitle'),
                description: this.$t('dashboard.fileTypeErrorDescription', { file: file?.name || '' }),
                color: 'warning',
              });
            }
          } else if(item.kind === 'string' && item.type === 'text/plain') {
            item.getAsString((text) => {
              this.message += text;
            });
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
    },
  },
});
</script>

<style scoped>

</style>
