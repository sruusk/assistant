<template>
  <DevOnly v-if="false">
    <ul v-if="Boolean(user)" class="fixed top-0 right-0 backdrop-blur-xl">
      <li v-for="(value, key) in user"><b>{{ key }}:</b> {{ value }}</li>
    </ul>
  </DevOnly>
  <ChatWindow/>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "Dashboard",
  inject: ['viewWidth'],
  data() {
    return {
      layoutThreshold: 900,
    }
  },
  async setup() {
    definePageMeta({
      name: 'Dashboard',
      layout: 'wide',
      requireAuth: true,
    })

    const userStore = useUserStore();
    await userStore.getAssistants()
    if(userStore.assistants?.length)
      userStore.changeAssistant(userStore.assistants[0].id)

    return {
      user: useLogtoUser(),
    }
  },
  beforeMount() {
    if(import.meta.client) {
      //this.setLayout() // This will produce hydration warning in the console
      onNuxtReady(() => {
        this.setLayout()
      })
    }
  },
  watch: {
    viewWidth: {
      handler() {
        this.setLayout()
      },
    }
  },
  methods: {
    setLayout() {
      if((this.viewWidth as number) < this.layoutThreshold) {
        setPageLayout('narrow')
      } else {
        setPageLayout('wide')
      }
    }
  }
});
</script>

<style scoped>

</style>
