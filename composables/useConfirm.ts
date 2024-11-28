import { ref } from 'vue';
import { createSharedComposable } from '@vueuse/core';

interface ConfirmOptions {
  title: string;
  description: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: ButtonVariant;
  cancelButtonVariant?: ButtonVariant;
  confirmButtonColor?: ButtonColor;
  cancelButtonColor?: ButtonColor;
}

type ButtonVariant = "solid" | "soft" | "link" | "outline" | "subtle" | "ghost" | undefined;
type ButtonColor = "error" | "neutral" | "primary" | "secondary" | "success" | "info" | "warning" | undefined;

const useConfirmComposable = () => {
  const isVisible = ref(false);
  const title = ref('');
  const description = ref('');
  const confirmButtonText = ref('dialog.confirm');
  const cancelButtonText = ref('dialog.cancel');
  const confirmButtonVariant = ref<ButtonVariant>('solid');
  const cancelButtonVariant = ref<ButtonVariant>('soft');
  const confirmButtonColor = ref<ButtonColor>('error');
  const cancelButtonColor = ref<ButtonColor>('neutral');
  let resolvePromise: (value: boolean) => void;

  const confirm = (options: ConfirmOptions) => {
    title.value = options.title;
    description.value = options.description;
    confirmButtonText.value = options.confirmButtonText || 'dialog.confirm';
    cancelButtonText.value = options.cancelButtonText || 'dialog.cancel';
    confirmButtonVariant.value = options.confirmButtonVariant || 'solid';
    cancelButtonVariant.value = options.cancelButtonVariant || 'soft';
    confirmButtonColor.value = options.confirmButtonColor || 'error';
    cancelButtonColor.value = options.cancelButtonColor || 'neutral';
    isVisible.value = true;

    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
  };

  const handleConfirm = () => {
    isVisible.value = false;
    resolvePromise(true);
  };

  const handleCancel = () => {
    isVisible.value = false;
    resolvePromise(false);
  };

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
    confirm,
    handleConfirm,
    handleCancel,
  };
}

export const useConfirm = createSharedComposable(useConfirmComposable);
