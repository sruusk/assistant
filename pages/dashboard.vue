<template>
  <div class="flex flex-row items-start justify-start h-dvh">
    <ColumnNavigation/>
    <div class="h-full w-full">
      <DevOnly v-if="false">
        <ul v-if="Boolean(user)" class="fixed top-0 right-0 backdrop-blur-xl">
          <li v-for="(value, key) in user"><b>{{ key }}:</b> {{ value }}</li>
        </ul>
      </DevOnly>
      <ChatWindow/>
    </div>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "Dashboard",
  data() {
    return {
    }
  },
  setup() {
    definePageMeta({
      name: 'Dashboard',
      requireAuth: true
    })

    return {
      user: useLogtoUser(),
    }
  },
});
</script>

<style scoped>

</style>
