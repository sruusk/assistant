<template>
  <NuxtLayout :name="layout as any">
    <DevOnly>
      <div v-if="Boolean(user)" class="hidden sm:block fixed top-0 right-0 backdrop-blur-xl z-50">
         <pre>{{ JSON.stringify(user, null, 2) }}</pre>
      </div>
    </DevOnly>
    <ChatWindow/>
  </NuxtLayout>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "Dashboard",
  data() {
    return {
      layoutThreshold: 900,
    }
  },
  async setup() {
    definePageMeta({
      name: 'Dashboard',
      layout: false,
      requireAuth: true,
    })

    const layout = useCookie('layout');
    if(!layout.value) layout.value = 'wide';

    const userStore = useUserStore();

    return {
      user: useLogtoUser(),
      userStore,
      layout,
    }
  },
  async beforeMount() {
    await this.userStore.getAssistants();
    if(this.userStore.assistants?.length)
      this.userStore.changeAssistant(this.userStore.assistants[0].id)

    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      const vw = window.innerWidth;
      if(vw < this.layoutThreshold) {
        this.layout = 'narrow';
      } else {
        this.layout = 'wide';
      }
    }
  }
});
</script>

<style scoped>

</style>
