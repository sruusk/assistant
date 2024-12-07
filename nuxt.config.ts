// https://nuxt.com/docs/api/configuration/nuxt-config
import {UserScope} from "@logto/js";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@logto/nuxt',
    'nuxt-umami',
    '@nuxtjs/mdc'
  ],
  css: ['~/assets/css/main.css'],
  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['path', 'svg'].includes(tag.toLowerCase())
    }
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet", href: "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
        }
      ]
    }
  },
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
    scopes: [UserScope.CustomData, UserScope.Profile, UserScope.Roles, UserScope.Email],
    fetchUserInfo: true,
  },
  runtimeConfig: {
    dbUrl: 'mongodb://127.0.0.1:27017',
    dbName: 'assistant',
    openAiKey: '',
    logtoEndpoint: '',
    logtoAppId: '',
    logtoClientId: '',
    logtoAppSecret: '',
    logtoCookieEncryptionKey: '',
    logtoCustomRedirectBaseUrl: '',
    logtoManagementEndpoint: 'https://default.logto.app/api',
    logtoM2mAppId: '',
    logtoM2mAppSecret: '',
  },
  mdc: {
    highlight: {
      theme: 'github-dark',
      langs: ['js','jsx','json','ts','tsx','vue','css','html','bash','md','mdc','yaml', 'asm', 'latex', 'c', 'c++', 'c#'],
      wrapperStyle: true
    },
    components: {
      prose: false, // Add predefined map to render Prose Components instead of HTML tags, like p, ul, code
      map: {
        // This map will be used in `<MDCRenderer>` to control rendered components
        pre: 'ProsePre',
        h3: 'ProseH3',
        code: 'ProseCode',
        li: 'ProseLi',
        ul: 'ProseUl',
        ol: 'ProseOl',
      }
    },
    rehypePlugins: {
      'rehype-katex': {
        options: {
          output: 'html',
        }
      },
    },
    remarkPlugins:  {
      'remark-math': {},
    },
    headings: {
      anchorLinks: false
    }
  },
})
