<template>
  <UApp>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
<script lang="ts">
export default defineNuxtComponent({
  name: "App",
  data() {
    return {
      viewWidth: window.innerWidth,
      viewHeight: window.innerHeight
    };
  },
  provide() {
    return {
      viewWidth: computed(() => this.viewWidth),
      viewHeight: computed(() => this.viewHeight)
    };
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  unmounted() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.viewWidth = window.innerWidth;
      this.viewHeight = window.innerHeight;
    },
  },
});
</script>
