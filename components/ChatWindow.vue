<template>
  <UCard class="h-full flex flex-col" :ui="{ body: 'grow overflow-y-hidden' }">
    <div class="flex flex-col-reverse items-center justify-start h-full w-full overflow-y-scroll gap-5 px-2">
      <ChatBubble :stream="messageStore.stream"/>
      <ChatBubble v-for="message in messageStore.messages" :key="message.id" :message="message"/>
      <USkeleton v-if="messageStore.loading" class="w-full h-10" v-for="i in 5" :key="i"/>
    </div>
    <template #footer>
      <UButtonGroup class="w-full">
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
        <UButton @click="sendMessage" icon="material-symbols:send-rounded"/>
        <UTooltip :delay-duration="0" :text="$t('dashboard.resetConversation')">
          <UButton icon="material-symbols-light:directory-sync" @click="clearConversation"/>
        </UTooltip>
      </UButtonGroup>
    </template>
  </UCard>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "ChatWindow",
  data() {
    return {
      message: "",
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
  },
  watch: {
    'userStore.activeAssistantId': {
      handler() {
        this.messageStore.$reset();
      },
    },
  },
});
</script>

<style scoped>

</style>
