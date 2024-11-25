<template>
  <div class="h-dvh min-h-dvh w-96 min-w-96">
    <UCard class="h-full flex flex-col" :ui="{ body: 'grow' }">
      <template #header>
        <USelect v-if="assistants.length > 1"
                 :placeholder="$t('dashboard.selectAssistant')"
                 :items="assistants"
                 v-model="selectedAssistantId"
                 :disabled="vectorStore === undefined"
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

          <UTextarea :autoresize="true"
                     v-model="selectedAssistant.instructions"
                     placeholder=""
                     class="w-full"
                     :ui="{ base: ['resize-none'] }"
          >
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
              <UInput @change="(e:any) => {files = e.target?.files}" type="file" multiple="true" class="w-full"/>
            </UButtonGroup>
            <OptionLabel :text="$t('dashboard.upload')"/>
          </div>

          <div v-if="selectedAssistantId !== 'new'" class="w-full relative ring ring-inset ring-[var(--ui-border-accented)] rounded-[calc(var(--ui-radius)*1.5)]">
            <div v-if="vectorStore !== undefined" class="w-full pl-2">
              <UButtonGroup v-if="vectorStore?.length"
                            v-for="(file, index) in vectorStore"
                            :key="file.id"
                            class="flex flex-row items-center justify-between w-full border-b border-[var(--ui-border)] last:border-b-0"
              >
                <div class="flex flex-row items-center gap-2 text-sm py-1">
                  <span>{{ file.filename }}</span>
                </div>
                <UButton icon="material-symbols:delete-rounded" class="hover:bg-[var(--ui-error)]" @click="deleteFile(file.id)"/>
              </UButtonGroup>
              <div v-else class="text-sm h-8 flex items-center">
                <span>{{ $t('dashboard.noFiles') }}</span>
              </div>
            </div>
            <USkeleton v-else class="h-8 w-full"/>
            <OptionLabel :text="$t('dashboard.files')"/>
          </div>

          <div class="grow"/>
          <div class="w-full flex flex-row justify-end gap-5">
            <template v-if="saving">
              <UProgress v-model="saveStep"
                         :max="[$t('dashboard.step.creating'), $t('dashboard.step.updating'), $t('dashboard.step.uploading'), $t('dashboard.step.finishing')]"
              />
              <USeparator orientation="vertical"/>
            </template>
            <UButton v-else
                     :disabled="selectedAssistantId === 'new'"
                     class="rounded-full"
                     @click="deleteAssistant"
                     color="error"
                     trailing-icon="material-symbols:delete-rounded"
            ></UButton>
            <UButton :disabled="!selectedAssistant.name || !selectedAssistant.instructions || !selectedAssistant.model"
                     class="rounded-full"
                     :loading="saving"
                     trailing
                     @click="saveAssistant"
                     trailing-icon="ic:twotone-save-alt"
            >
              {{ $t('dashboard.save') }}
            </UButton>
          </div>
        </template>
        <USkeleton v-else class="h-8 w-full"/>
      </div>
      <template #footer>
        <div class="flex flex-row items-center justify-start gap-3">
          <USkeleton class="h-8 w-8 rounded-full" />
          <a href="/sign-out">{{ $t('logout') }}</a>
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
      vectorStore: undefined as any,
      saving: false,
      saveStep: 0,
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
      handler: async function (value) {
        this.userStore.activeAssistantId = null;
        if (value === 'new') {
          this.selectedAssistant = {
            id: null,
            name: '',
            instructions: '',
            model: this.availableModels[0],
          }
          this.vectorStore = [];
        } else {
          this.userStore.activeAssistantId = value;
          this.selectedAssistant = this.userStore.getAssistantById(value);
          this.vectorStore = undefined;
          this.vectorStore = await this.getVectorStoreFiles(this.selectedAssistant.tool_resources.file_search.vector_store_ids[0]);
        }
      },
      deep: true
    }
  },
  methods: {
    async getVectorStoreFiles(storeId: string) {
      if (!storeId) return;
      return await $fetch(`/api/store/${storeId}`)
    },
    async saveAssistant() {
      try {
        this.saving = true;
        const assistant = this.selectedAssistant;
        if(assistant.id === null) { // Create new assistant
          delete assistant.id;
          const vectorStore = await this.createVectorStore();
          assistant.tools = [{ type: 'file_search' }];
          assistant.tool_resources = {
            file_search: {
              vector_store_ids: [vectorStore.id],
            }
          };
          const createdAssistant = await $fetch('/api/assistants', {
            method: 'POST',
            body: JSON.stringify(assistant),
          });
          assistant.id = createdAssistant.id;
        } else { // Update existing assistant
          this.saveStep = 1;
          await $fetch(`/api/assistants/${assistant.id}`, {
            method: 'PATCH',
            body: JSON.stringify({
              name: assistant.name,
              instructions: assistant.instructions,
              model: assistant.model,
            }),
          });
        }

        const storeId = assistant.tool_resources?.file_search?.vector_store_ids[0];
        if(!storeId) throw new Error('No vector store found');

        this.saveStep = 2;
        if(this.files.length) await this.uploadFiles(storeId);

        this.saveStep = 3;
        await this.userStore.getAssistants();
        this.selectedAssistantId = assistant.id;
        this.saving = false;
        this.saveStep = 0;
      } catch (e) {
        console.error(e);
        this.saving = false;
        this.saveStep = 0;
        alert('An error occurred while saving the assistant');
      }
    },
    async createVectorStore() {
      return await $fetch('/api/store', {
        method: 'POST',
      });
    },
    async uploadFiles(vectorStoreId: string) {
      for (const file of this.files) {
        const formData = new FormData();
        formData.append('file', file);
        await $fetch(`/api/store/${vectorStoreId}`, {
          method: 'POST',
          body: formData,
        });
      }
      this.vectorStore = await this.getVectorStoreFiles(vectorStoreId);
    },
    async deleteFile(fileId: string) {
      const vectorStoreId = this.selectedAssistant.tool_resources.file_search.vector_store_ids[0];
      if(!vectorStoreId) throw new Error('No vector store found');

      if(!confirm('Are you sure you want to delete this file?')) return;

      await $fetch(`/api/store/${vectorStoreId}/${fileId}`, {
        method: 'DELETE',
      });
      this.vectorStore = this.vectorStore.filter((file: any) => file.id !== fileId);
    },
    async deleteAssistant() {
      if(!this.selectedAssistant?.id) return;
      if(!confirm('Are you sure you want to delete this assistant?')) return;
      await $fetch(`/api/assistants/${this.selectedAssistant.id}`, {
        method: 'DELETE',
      });
      await this.userStore.getAssistants();
      this.selectedAssistantId = this.userStore.assistants[0]?.id ?? 'new';
    }
  }
});
</script>

