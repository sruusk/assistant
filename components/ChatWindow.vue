<template>
  <UCard class="h-full flex flex-col" :ui="{ body: 'grow' }">
    <div class="flex flex-col-reverse items-center justify-start h-full w-full">
      <USeparator color="error" type="solid" class="w-full">ChatWindow WIP</USeparator>

    </div>
    <template #footer>
      <UButtonGroup class="w-full">
        <UTextarea :autoresize="true"
                   :rows="1"
                   :maxrows="5"
                   v-model="message"
                   :placeholder="$t('dashboard.messagePlaceholder')"
                   class="w-full"
        />
        <UButton icon="material-symbols:send-rounded"/>
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
});
</script>

<style scoped>

</style>
