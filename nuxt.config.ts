// https://nuxt.com/docs/api/configuration/nuxt-config
import {UserScope} from "@logto/js";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@pinia/nuxt', '@logto/nuxt', '@nuxtjs/mdc', '@vite-pwa/nuxt'],
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
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Assistant',
      short_name: 'Assistant',
      description: 'Your personal assistant',
      theme_color: '#ffffff',
      lang: 'en',
      icons: [
        {
          "src": "pwa-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "pwa-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "any"
        },
        {
          "src": "pwa-maskable-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable"
        },
        {
          "src": "pwa-maskable-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable"
        }
      ],
    },
    client: {
      installPrompt: true,
    }
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
    openAiKey: '',
    logtoEndpoint: '',
    logtoAppId: '',
    logtoClientId: '',
    logtoAppSecret: '',
    logtoCookieEncryptionKey: '',
    logtoCustomRedirectBaseUrl: '',
    logtoManagementEndpoint: 'https://default.logto.app/',
    logtoM2mAppId: '',
    logtoM2mAppSecret: '',
  },
  mdc: {
    highlight: {
      theme: 'github-dark',
      langs: [
        'js','jsx','json', 'java', 'python', 'py', 'kotlin', 'lua', 'make', 'matlab', 'css',
        'scala','ts','tsx','vue','css','html','bash','md', 'cmake', 'dockerfile', 'go',
        'mdc','yaml', 'asm', 'latex', 'c', 'c++', 'c#', 'http', 'dart'
      ],
      wrapperStyle: true
    },
    components: {
      prose: false, // Add a predefined map to render Prose Components instead of HTML tags, like p, ul, code
      map: {
        // This map will be used in `<MDCRenderer>` to control rendered components
        pre: 'ProsePre',
        h3: 'ProseH3',
        code: 'ProseCode',
        li: 'ProseLi',
        ul: 'ProseUl',
        ol: 'ProseOl',
        hr: 'ProseHr',
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
