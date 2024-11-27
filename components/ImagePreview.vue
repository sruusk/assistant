<template>
<div class="flex flex-wrap gap-3">
  <div v-if="static">
    <UModal v-for="image in images" :key="image">
      <img :src="image"
           class="max-w-36 max-h-20 object-contain rounded-lg relative cursor-pointer shadow-md group
           hover:shadow-lg transition-all duration-300 ease-in-out transform
           hover:scale-105 hover:rotate-1 hover:bounce-1"
           alt="Image preview"
      />
      <template #content>
        <img :src="image"
             class="max-w-full max-h-full object-contain"
             alt="Image preview"
        />
      </template>
    </UModal>
  </div>
  <UButton v-else
           v-for="(image, index) in images"
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
    <img :src="image"
         class="max-w-36 max-h-20 object-cover rounded-lg"
         alt="Image preview"
    />
  </UButton>
</div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "ImagePreview",
  emits: ['remove'],
  props: {
    images: {
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
