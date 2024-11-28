<template>
  <div class="h-full w-96 min-w-96">
    <UCard class="h-full flex flex-col" :ui="{ body: 'grow', header: 'flex gap-4' }">
      <template #header>
        <slot name="header"/>
        <USelect v-if="assistants"
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

          <UTextarea :autoresize="true"
                     :maxrows="10"
                     autocomplete="off"
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
              <UInput @change="(e:any) => {files = e.target?.files ?? []}"
                      type="file" ref="fileInput" multiple="true" class="w-full"
                      accept="text/*, .sh, .json, .doc, .docx, .pdf, .pptx, .ts"
              />
            </UButtonGroup>
            <OptionLabel :text="$t('dashboard.upload')"/>
          </div>

          <div v-if="selectedAssistant.id !== null" class="w-full relative ring ring-inset ring-[var(--ui-border-accented)] rounded-[calc(var(--ui-radius)*1.5)]">
            <div v-if="userStore.activeAssistantFiles" class="w-full pl-2">
              <UButtonGroup v-if="userStore.activeAssistantFiles.length"
                            v-for="(file, index) in userStore.activeAssistantFiles"
                            :key="file.id"
                            class="flex flex-row items-center justify-between w-full border-b border-[var(--ui-border)] last:border-b-0"
              >
                <div class="flex flex-row items-center gap-2 text-sm py-1">
                  <span>{{ file.filename }}</span>
                </div>
                <UButton icon="material-symbols:delete-rounded"
                         class="hover:bg-[var(--ui-error)]"
                         :class="{ 'rounded-tr-none': index !== 0, 'rounded-br-none': index !== userStore.activeAssistantFiles.length - 1 }"
                         @click="deleteFile(file.id)"
                />
              </UButtonGroup>
              <div v-else class="text-sm h-8 flex items-center">
                <span>{{ $t('dashboard.noFiles') }}</span>
              </div>
            </div>
            <USkeleton v-else class="h-8 w-full"/>
            <OptionLabel :text="$t('dashboard.files')"/>
          </div>

          <div class="w-full relative p-3 ring ring-inset ring-[var(--ui-border-accented)] rounded-[calc(var(--ui-radius)*1.5)]">
            <OptionLabel :text="$t('dashboard.modelConfig')"/>
            <LabeledSlider :tooltip="$t('dashboard.temperatureTip')"
                           :label="$t('dashboard.temperature')"
                           v-model:value="selectedAssistant.temperature"
                           :max="2.0"
            />
            <LabeledSlider :tooltip="$t('dashboard.topPTip')"
                           :label="$t('dashboard.topP')"
                           v-model:value="selectedAssistant.top_p"
                           ui="mt-5"
            />
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
                     :disabled="!userStore.activeAssistantId"
                     class="rounded-full"
                     :loading="deleting"
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
          <a href="/logout">{{ $t('logout') }}</a>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script lang="ts">

import LabeledSlider from "~/components/LabeledSlider.vue";
const newAssistant = {
  id: null,
  name: '',
  instructions: '',
  model: 'gpt-4o-mini',
  temperature: 1.0,
  top_p: 1.0,
};

export default defineNuxtComponent({
  name: "ColumnNavigation",
  components: {LabeledSlider},
  data() {
    return {
      selectedAssistant: undefined as any,
      availableModels: [
        'gpt-4o',
        'gpt-4o-mini',
        'gpt-4-turbo',
        'gpt-4',
      ],
      files: [] as any,
      saving: false,
      deleting: false,
      saveStep: 0,
    }
  },
  setup() {
    const fileInput = ref<HTMLInputElement | null>(null);
    const userStore = useUserStore();
    return {
      userStore,
      fileInput,
      toast: useToast(),
      confirm: useConfirm(),
    }
  },
  mounted() {
    this.selectedAssistant = this.userStore.activeAssistant ?? structuredClone(newAssistant);
  },
  computed: {
    assistants() {
      return [...this.userStore.assistants, { id: null, name: this.$t('dashboard.newAssistant') }];
    },
    selectedAssistantId: {
      get() {
        return this.userStore.activeAssistantId;
      },
      set(value: string) {
        this.userStore.changeAssistant(value);
      }
    }
  },
  watch: {
    selectedAssistantId: {
      handler: async function (value) {
        if (!value) {
          this.selectedAssistant = structuredClone(newAssistant);
        } else {
          this.selectedAssistant = this.userStore.activeAssistant;
        }
      },
      deep: true
    },
  },
  methods: {
    async saveAssistant() {
      if(!this.testFileSizes()) return;
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
              temperature: assistant.temperature ?? 1.0,
              top_p: assistant.top_p ?? 1.0,
            }),
          });
        }

        const storeId = assistant.tool_resources?.file_search?.vector_store_ids[0];
        if(!storeId) { // noinspection ExceptionCaughtLocallyJS
          throw new Error('No vector store found');
        }

        this.saveStep = 2;
        if(this.files.length) await this.uploadFiles(storeId);

        this.saveStep = 3;
        await this.userStore.getAssistants();
        this.selectedAssistantId = assistant.id;
        await this.userStore.getAssistantFiles(assistant.id);
        this.fileInput?.value && (this.fileInput.value = '');
        this.saving = false;
        this.saveStep = 0;
      } catch (e) {
        console.error(e);
        this.saving = false;
        this.saveStep = 0;
        alert('An error occurred while saving the assistant');
      }
    },
    testFileSizes() { // returns true if all files are less than the limit
      for(const file of this.files) {
        if(file.size > 500 * 1024 * 1024) {
          this.toast.add({
            title: this.$t('dashboard.fileSizeErrorTitle'),
            description: this.$t('dashboard.fileSizeErrorDescription', { size: '500MB' }),
            color: 'error',
            duration: 10000,
          });
          return false;
        }
      }
      return true;
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
    },
    async deleteFile(fileId: string) {
      const vectorStoreId = this.selectedAssistant.tool_resources.file_search.vector_store_ids[0];
      const assistantId = this.selectedAssistant.id;
      if(!vectorStoreId) throw new Error('No vector store found');

      if(!confirm('Are you sure you want to delete this file?')) return;

      await $fetch(`/api/store/${vectorStoreId}/${fileId}`, {
        method: 'DELETE',
      });
      this.userStore.getAssistantFiles(assistantId);
    },
    async deleteAssistant() {
      if(!this.selectedAssistant?.id) return;

      // Confirm deletion
      if(!await this.confirm.confirm({
        title: this.$t('dialog.confirmDelete'),
        description: this.$t('dialog.deleteItem', { item: `${this.selectedAssistant.name} assistant` }),
        confirmButtonText: 'dialog.delete',
      })) return;

      this.deleting = true;
      await $fetch(`/api/assistants/${this.selectedAssistant.id}`, {
        method: 'DELETE',
      });
      await this.userStore.getAssistants();
      this.selectedAssistantId = this.userStore.assistants?.[0]?.id ?? null;
      this.deleting = false;
    }
  }
});
</script>

