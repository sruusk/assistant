<template>
<div class="flex flex-wrap gap-3 justify-center items-center">
  <template v-if="static">
    <UAlert v-for="(file, index) in files"
            :key="index"
            variant="outline"
            color="info"
            :title="file"
            icon="material-symbols:attachment"
    />
  </template>
  <UButton v-else
           v-for="(file, index) in files"
           :key="index"
           variant="ghost"
           color="error"
           @click="$emit('remove', index)"
           class="relative cursor-pointer shadow-md group
           hover:shadow-lg transition-all duration-300 ease-in-out transform
           hover:scale-105 hover:rotate-1 hover:bounce-1"
  >
    <template #leading>
      <div class="absolute w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <UIcon name="material-symbols:close-rounded" class="size-8"/>
      </div>
    </template>
    <UAlert :title="file"
            variant="outline"
            color="info"
            icon="material-symbols:attachment"
    />
  </UButton>
</div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "FilePreview",
  emits: ['remove'],
  props: {
    files: {
      type: Array as () => string[],
      required: true,
    },
    static: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style scoped>

</style>
