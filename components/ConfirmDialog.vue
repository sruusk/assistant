<template>
  <UModal v-model:open="isVisible"
          :title="title"
          :description="description"
          prevent-close
          :close="false"
          :overlay="true"
          class="w-max sm:w-fit max-w-[90%] rounded-xl h-fit z-50"
  >
    <template #body>
      <div class="flex justify-center gap-5">
        <UButton @click="handleCancel" :variant="cancelButtonVariant" :color="cancelButtonColor">{{ $t(cancelButtonText) }}</UButton>
        <UButton @click="handleConfirm" :variant="confirmButtonVariant" :color="confirmButtonColor">{{ $t(confirmButtonText) }}</UButton>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: 'ConfirmDialog',
  setup() {
    const { isVisible, title, description, confirmButtonText, cancelButtonText, confirmButtonVariant, cancelButtonVariant, confirmButtonColor, cancelButtonColor, handleConfirm, handleCancel } = useConfirm();

    return {
      isVisible,
      title,
      description,
      confirmButtonText,
      cancelButtonText,
      confirmButtonVariant,
      cancelButtonVariant,
      confirmButtonColor,
      cancelButtonColor,
      handleConfirm,
      handleCancel,
    };
  },
});
</script>
