<template>
  <label
    class="pointer-events-none absolute left-0 -top-2.5 text-[var(--ui-text-highlighted)] text-xs font-medium px-1.5 transition-all">
    <span class="inline-flex bg-[var(--ui-bg)] px-1 whitespace-nowrap">{{ text }}</span>
  </label>
</template>
<script lang="ts">
export default {
  name: "OptionLabel",
  props: {
    text: {
      type: String,
      required: true
    }
  }
};
</script>
