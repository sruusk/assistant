
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      assistants: [] as any[],
      activeAssistantId: null as null | string,
      files: {} as Record<string, AssistantFile[]>,
    }
  },
  getters: {
    activeAssistant(state) {
      return state.assistants.find(asst => asst.id === state.activeAssistantId);
    },
    getAssistantById: (state) => (id: string) => {
      return state.assistants.find(asst => asst.id === id);
    },
    activeAssistantFiles: (state) => {
      if(!state.activeAssistantId) return [];
      return state.files[state.activeAssistantId] || null;
    }
  },
  actions: {
    changeAssistant(id: string) {
      this.activeAssistantId = id;
      if(!this.activeAssistantFiles) {
        this.getAssistantFiles(id);
      }
      return this.activeAssistant;
    },
    async getAssistantFiles(id: string) {
      const asst = this.getAssistantById(id);
      if(asst) {
        const storeId = asst.tool_resources?.file_search?.vector_store_ids?.[0];
        if(storeId) {
          this.files[id] = await $fetch(`/api/store/${storeId}`);
        }
      }
    },
    async getAssistants() {
      const data = await $fetch('/api/assistants');
      if(Array.isArray(data)) {
        const promises = [];
        for(const asst of data) {
          promises.push($fetch(`/api/assistants/${asst}`));
        }
        this.assistants = await Promise.all(promises);
      }
    },
  }
})

export interface AssistantFile {
  id: string;
  filename: string;
}
