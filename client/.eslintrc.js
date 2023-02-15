module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier'],
  plugins: [],
  // add your custom rules here
  rules: {
    'n/no-deprecated-api': 0,
    'no-console': 0,
    'vue/multi-word-component-names': 0,
    'vue/require-default-prop': 0,
    'vue/no-unused-vars': 0,
    'vue/no-use-v-if-with-v-for': 0,
    'vue/no-v-html': 0,
    'no-unused-vars': 1,
    'standard/no-callback-literal': 0,
    'prefer-const': 0,
    'vue/require-prop-types': 0,
    'vue/no-mutating-props': 0,
    eqeqeq: 0,
    camelcase: 0,
    semi: 0,
  },
}
