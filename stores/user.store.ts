
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
    }
  },
  actions: {
    async getAssistants() {
      this.assistants = [];
      const data = await $fetch('/api/assistants');
      if(Array.isArray(data)) {
        for(const asst of data) {
          this.assistants.push(await $fetch(`/api/assistants/${asst}`));
        }
      }
    }
  }
})
