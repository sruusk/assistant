<template>
<!--  <pre class="relative">-->
<!--    <UButton icon="i-lucide-code" color="neutral" variant="outline" @click="copyCode" class="absolute top-0 right-0 m-2"/>-->
<!--    <slot/>-->
<!--  </pre>-->
  <div v-if="code.length" class="pre relative w-full contain-content grid">
    <UButton icon="i-lucide-code" color="neutral" variant="outline" @click="copyCode" class="absolute top-0 right-0 m-2"/>
    <pre class="pre-body rounded-2xl px-5 py-3 w-full overflow-x-auto" :class="$props.class"><slot/></pre>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  name: "CodeBlock",
  props: {
    code: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: null
    },
    filename: {
      type: String,
      default: null
    },
    highlights: {
      type: Array as () => number[],
      default: () => []
    },
    meta: {
      type: String,
      default: null
    },
    class: {
      type: String,
      default: null
    }
  },
  setup() {
    return {
      toast: useToast(),
    };
  },
  methods: {
    copyCode() {
      navigator.clipboard.writeText(this.code.trim());
      this.toast.add({
        title: this.$t('dashboard.codeCopied'),
      });
    },
  },
});
</script>

<style scoped>
</style>
