<template>
  <div class="h-dvh min-h-dvh w-96 min-w-96">
    <UCard class="h-full flex flex-col" :ui="{ body: 'grow' }">
      <template #header>
        <USelect v-if="assistants.length > 1"
                 :placeholder="$t('dashboard.selectAssistant')"
                 :items="assistants"
                 v-model="selectedAssistantId"
                 value-key="id"
                 label-key="name"
                 class="w-full"
        />
        <USkeleton v-else class="h-8 w-full"/>
      </template>
      <div class="flex flex-col items-start justify-start h-full gap-5">
        <template v-if="selectedAssistant">
          <UInput v-model="selectedAssistant.name" placeholder="" :ui="{ base: 'peer' }" class="w-full">
            <OptionLabel :text="$t('dashboard.name')"/>
          </UInput>

          <UTextarea :autoresize="true" v-model="selectedAssistant.instructions" placeholder="" class="w-full">
            <OptionLabel :text="$t('dashboard.instructions')"/>
          </UTextarea>

          <div class="w-full relative">
            <USelect v-model="selectedAssistant.model"
                     :items="availableModels"
                     :ui="{ leading: 'w-0 p-0 m-0' }"
                     class="w-full"
            >
            </USelect>
            <OptionLabel :text="$t('dashboard.model')"/>
          </div>

          <div class="w-full relative">
            <UButtonGroup class="w-full">
              <UInput @change="(e) => {files = e.target?.files}" type="file" multiple="true" class="w-full"/>
              <UButton icon="material-symbols:upload-rounded"/>
            </UButtonGroup>
            <OptionLabel :text="$t('dashboard.upload')"/>
          </div>
          <div class="grow"/>
          <div class="w-full flex flex-row justify-end">
            <UTooltip :text="$t('dashboard.missingFields')">
              <UButton :disabled="!selectedAssistant.name || !selectedAssistant.instructions || !selectedAssistant.model"
                       class="rounded-full"
                       trailing-icon="ic:twotone-save-alt"
              >
                {{ $t('dashboard.save') }}
              </UButton>
            </UTooltip>
          </div>
        </template>
        <USkeleton v-else class="h-8 w-full"/>
      </div>
      <template #footer>
        <div class="flex flex-row items-center justify-start gap-3">
          <USkeleton class="h-8 w-8 rounded-full" />
          <a href="/logout">{{ $t('logout') }}</a>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts">

export default defineNuxtComponent({
  name: "ColumnNavigation",
  data() {
    return {
      selectedAssistantId: undefined,
      selectedAssistant: undefined as any,
      availableModels: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
      ],
      files: [] as any,
    }
  },
  setup() {
    return {
      userStore: useUserStore(),
    }
  },
  async beforeMount() {
    await this.userStore.getAssistants();
    this.selectedAssistantId = this.userStore.assistants[0]?.id ?? 'new';
  },
  computed: {
    assistants() {
      return [...this.userStore.assistants, { id: 'new', name: this.$t('dashboard.newAssistant') }];
    }
  },
  watch: {
    selectedAssistantId: {
      handler: function (value) {
        this.userStore.activeAssistantId = value;
        if (value === 'new') {
          this.selectedAssistant = {
            id: null,
            name: '',
            instructions: '',
            model: this.availableModels[0],
          }
        } else {
          this.selectedAssistant = this.userStore.assistants.find(assistant => assistant.id === value);
        }
      },
      deep: true
    }
  }
});
</script>

