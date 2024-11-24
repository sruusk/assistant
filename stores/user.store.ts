
export const useUserStore = defineStore('user', {
  state: () => {
    return {
      assistants: [] as any[],
      activeAssistantId: null as null | string
    }
  },
  getters: {
    activeAssistant(state) {
      return state.assistants.find(asst => asst.id === state.activeAssistantId);
    },
    getAssistantById: (state) => (id: string) => {
      return state.assistants.find(asst => asst.id === id);
    }
  },
  actions: {
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
