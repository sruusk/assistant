<template>
  <div class="flex flex-row items-start justify-start h-dvh max-w-dvw relative contain-content">
    <ColumnNavigation/>
    <div class="h-full grow">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "wide.vue"
});
</script>

<style scoped>

</style>
