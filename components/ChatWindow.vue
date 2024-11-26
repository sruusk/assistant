<template>
  <UCard class="h-full flex flex-col" :ui="{ body: 'grow overflow-y-hidden' }">
    <div class="flex flex-col-reverse items-center justify-start h-full overflow-y-auto gap-5 px-2">
      <USeparator v-if="userStore.activeAssistantId && !messageStore.loading && !messageStore.messages?.length" orientation="horizontal" class="w-full">{{ $t('dashboard.noMessages') }}</USeparator>
      <ChatBubble :stream="messageStore.stream"/>
      <template v-for="message in messageStore.messages" :key="message.id">
        <ChatBubble :message="message" :renderer="renderer"/>
        <USeparator orientation="horizontal" class="w-full capitalize">{{ message.role }}</USeparator>
      </template>
      <USkeleton v-if="messageStore.loading" class="w-full h-16" v-for="i in 5" :key="i"/>
    </div>
    <template #footer>
      <UButtonGroup v-if="userStore.activeAssistantId" class="w-full">
        <UTextarea :autoresize="true"
                   :rows="1"
                   :maxrows="5"
                   autocomplete="off"
                   autocorrect="on"
                   @keydown.enter.prevent.exact="sendMessage"
                   @keydown.ctrl.enter.prevent.exact="message += '\n'"
                   @keydown.shift.enter.prevent.exact="message += '\n'"
                   v-model="message"
                   :placeholder="$t('dashboard.messagePlaceholder')"
                   :ui="{ base: ['resize-none rounded-r-none'] }"
                   class="w-full"
        />
        <UButton :disabled="messageStore.loading" @click="sendMessage" icon="material-symbols:send-rounded" variant="outline" color="neutral"/>
        <UDropdownMenu :items="menuItems">
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
          // {
          //   label: this.$t('dashboard.latex'),
          //   icon: "file-icons:latex",
          //   checked: false,
          //   val: "latex",
          //   onSelect: () => this.setRenderer("latex"),
          //   type: "checkbox",
          // },
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
      await this.messageStore.addMessage({
        role: "user",
        content: this.message,
      });
      this.message = "";
      await this.messageStore.runThread();
    },
    async clearConversation() {
      await this.messageStore.deleteThread();
      this.messageStore.$reset();
    },
    setRenderer(renderer: string) {
      if(this.renderer === renderer) this.renderer = "text";
      else this.renderer = renderer;
    },
  },
  watch: {
    'userStore.activeAssistantId': {
      handler() {
        this.messageStore.$reset();
      },
    },
    renderer() {
      this.menuItems[0].forEach((item) => {
        console.log(item.val, this.renderer);
        item.checked = item.val === this.renderer;
      });
    }
  },
});
</script>

<style scoped>

</style>
