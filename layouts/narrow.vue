<template>
  <div class="flex flex-row items-start justify-start h-dvh max-w-dvw relative contain-content">
    <USlideover v-model:open="open" side="left" :ui="{ header: 'p-0', body: 'p-0' }">
      <UButton icon="i-lucide-menu" color="neutral" variant="ghost" class="absolute top-2 left-2 z-10"/>
      <template #content>
        <ColumnNavigation class="w-full !min-w-0">
          <template #header>
            <UButton icon="i-lucide-x" color="neutral" variant="ghost" @click="open = false"/>
          </template>
        </ColumnNavigation>
      </template>
    </USlideover>
    <div class="h-full contain-content relative grow">
      <div class="z-50 w-full h-12 absolute top-0 justify-center items-center flex backdrop-blur-2xl bg-[var(--ui-bg-elevated)]">
        {{ userStore.activeAssistant?.name || '' }}
      </div>
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "mobile",
  data() {
    return {
      open: false,
    }
  },
  setup() {
    return {
      userStore: useUserStore(),
      toast: useToast(),
    }
  },
  watch: {
    'userStore.noAssistants': {
      handler() {
        if(this.userStore.noAssistants) {
          this.open = true;
          this.toast.add({
            title: this.$t('dashboard.noAssistants'),
            description: this.$t('dashboard.noAssistantsDescription'),
          })
        }
      }
    }
  }
});
</script>

<style scoped>
</style>
