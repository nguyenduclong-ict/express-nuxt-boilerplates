import { showErrorMessage, validateForm, waitFor } from '~/utils'

export default async function ({ route }) {
  if (route.path === '/admin' || route.path.startsWith('/admin/')) {
    import('@/assets/css/tailwindcss.css')
    import('element-ui/lib/theme-chalk/index.css')
    const Vue = require('vue').default
    const Element = require('element-ui')
    const locale = require('element-ui/lib/locale/lang/vi').default
    const _ = require('~/utils/lodash')
    const VueClipboard = require('vue-clipboard2')
    Vue.use(VueClipboard)
    Vue.use(Element, { locale, size: 'small' })
    require('./global-components').default()

    // mixins
    Vue.mixin({
      computed: {
        _() {
          return _
        },
      },
      methods: {
        showErrorMessage(error) {
          showErrorMessage.bind(this)(error)
        },
        validateForm(form) {
          return validateForm(form)
        },
        showConfirm(text, options, ...args) {
          return new Promise((resolve) => {
            this.$confirm(
              text,
              {
                cancelButtonText: 'Hủy',
                confirmButtonText: 'Oke',
                ...options,
              },
              ...args
            )
              .then(() => resolve(true))
              .catch(() => resolve(false))
          })
        },
      },
    })
    await waitFor(100)
  }
}
