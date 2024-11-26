<template>
  <UTooltip :delay-duration="0"
            arrow
            :text="tooltip"
            :content="{
                        side: 'top',
                        align: 'center',
                        sideOffset: -5,
                      }"
  >
    <div class="relative" :class="ui">
      <h3 class="text-sm mb-3">{{ label }}</h3>
      <UInputNumber class="absolute right-0 top-0 w-14"
                    v-model="model"
                    orientation="vertical"
                    size="xs"
                    :min="min"
                    :max="max"
                    :step="step"
                    :format-options="{
                      minimumFractionDigits: 1,
                    }"
      />
      <USlider v-model="model" size="xs" :min="min" :max="max" :step="step"/>
    </div>
  </UTooltip>
</template>
<script lang="ts">
export default {
  name: "LabeledSlider",
  emits: ["update:value"],
  props: {
    value: Number,
    tooltip: String,
    label: String,
    step: {
      type: Number,
      default: 0.1,
    },
    min: {
      type: Number,
      default: 0.1,
    },
    max: {
      type: Number,
      default: 1.0,
    },
    ui: String,
  },
  computed: {
    model: {
      get() {
        return this.value;
      },
      set(value: number) {
        this.$emit("update:value", value);
      },
    },
  },
};
</script>
