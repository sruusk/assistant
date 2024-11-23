// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@logto/nuxt',
    'nuxt-umami'
  ],
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error'],
      transitions: true,
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  umami: {
    id: '',
    host: 'https://umami.anttila.io',
    autoTrack: true,
    ignoreLocalhost: true,
    excludeQueryParams: true,
    trailingSlash: 'never',
    enabled: false
  },
  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      { code: 'en', language: 'en-UK', name: 'English' },
    ],
    strategy: 'no_prefix',
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
  },
  logto: {
    pathnames: {
      signIn: '/login',
      signOut: '/logout',
      callback: '/auth/callback',
    },
  },
  runtimeConfig: {
    dbUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'assistant',
    openAiKey: '',
  },
})
