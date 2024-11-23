<template>
  <div class="w-full min-h-screen flex items-center justify-center p-20">
    <div class="flex flex-col items-center px-20 py-16">
      <h1 class="text-4xl font-bold">{{ $t("landing.title") }}</h1>
      <p class="mt-4 text-center">{{ $t("landing.description") }}</p>
      <a class="my-8 relative group" href="/login">
        <div
          class="contain-strict absolute -inset-1 rounded-full bg-gradient-to-r from-red-600 to-violet-600 blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"
        >
          <div class="w-full h-full rounded-2xl bg-gradient-to-r from-red-600 to-violet-600 opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-300"
               style="animation: spin 3s linear infinite;"
          />
        </div>
        <div
          class="relative px-5 py-3 bg-white ring-1 ring-gray-900/5 rounded-full leading-none flex items-top justify-start space-x-6">
          <div class="space-y-2 font-bold text-black flex items-center gap-3">
            {{ $t("landing.login") }}
            <UIcon name="i-heroicons-arrow-right-20-solid" size="25"/>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
export default defineNuxtComponent({
  setup() {
    definePageMeta({
      name: "Home",
      middleware: [
        function (to, from) {
          if (Boolean(useLogtoUser())) {
            return "/dashboard";
          }
        }
      ]
    });

    return {
      user: useLogtoUser()
    };
  },
});
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
