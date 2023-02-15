const spa = (path) => {
  return {
    path,
    handler: (req, res, next) => {
      req.spa = true
      next()
    },
  }
}

/** @type {import("@nuxt/types").NuxtConfig} */
export default {
  srcDir: './client',
  buildDir: './.output/client',
  head: {
    title: 'Acc Bot Net',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  components: false,

  css: ['@/assets/css/main.scss'],

  plugins: [
    '@/plugins/bootstrap',
    {
      src: '@/plugins/element-ui',
      mode: 'client',
    },
  ],

  buildModules: [],

  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    'nuxt-route-meta',
    '@nuxtjs/svg-sprite',
  ],

  auth: {
    localStorage: false,
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'token',
          global: true,
        },
        refreshToken: {
          property: 'refresh_token',
          data: 'refresh_token',
        },
        user: {
          property: '',
        },
        endpoints: {
          login: { url: '/auth/login', method: 'post' },
          refresh: { url: '/auth/refresh', method: 'post' },
          user: { url: '/auth/user', method: 'get' },
          logout: { url: '/auth/logout', method: 'post' },
        },
      },
    },
  },

  axios: {
    progress: false,
  },

  serverMiddleware: [spa('/admin')],

  router: {
    middleware: ['bootstrap', 'auth-custom'],
  },

  build: {
    postcss: false,
    transpile: [/^element-ui/],
  },
}
