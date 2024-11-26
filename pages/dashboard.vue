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
    }
  },
  setup() {
    definePageMeta({
      name: 'Dashboard',
      layout: 'wide',
      requireAuth: true
    })

    const userStore = useUserStore();
    userStore.getAssistants().then(() => {
      if(userStore.assistants?.length)
        userStore.changeAssistant(userStore.assistants[0].id)
    })

    return {
      user: useLogtoUser(),
    }
  },
  beforeMount() {
    this.setLayout()
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
      if(this.viewWidth < 900) {
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
