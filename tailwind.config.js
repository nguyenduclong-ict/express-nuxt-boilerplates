/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/pages/admin/**/*.{html,vue}',
    './client/components/Admin/**/*.{html,vue}',
    './client/layouts/admin.vue',
  ],
  theme: {
    extend: {
      flex: {
        2: '2 2 0%',
        3: '3 3 0%',
        4: '4 4 0%',
      },
    },
  },
  plugins: [],
}
