// https://nuxt.com/docs/api/configuration/nuxt-config
const normalizeApiBase = (value?: string) =>
  value ? `${value.replace(/\/+$/, '')}/` : '';

export default defineNuxtConfig({
  // ssr: true,
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      apiBase: normalizeApiBase(
        process.env.NUXT_ENV === 'development'
          ? process.env.DEV_API_URL
          : process.env.PROD_API_URL
      ),
    },
  },

  build: {
    transpile: ['vue-toastification'],
  },

  dev: true,

  devServer: {
    host: '0.0.0.0',
  },

  modules: [
    '@nuxt/ui',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@pinia/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },

  routeRules: {
    '/api/**': {
      cors: true,
    },
  },
});
