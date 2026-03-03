// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
  ],
  css: [
    '@/assets/css/main.css'
  ],
  nitro: {
    preset: 'bun',
  },
  icon: {
    serverBundle: {
      collections: ['lucide', 'heroicons']
    }
  },
  runtimeConfig: {
    public: {
      atptOfcdcScCode: '',
      sdSchulCode: '',
    },
  },
  app: {
    head: {
      title: 'Meal Menu',
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍽️</text></svg>', sizes: 'any'},
      ]
    }
  }
})
