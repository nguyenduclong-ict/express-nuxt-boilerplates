export default async function ({ $axios, store, redirect, route, app }) {
  try {
    const { inited } = await $axios.$get('/auth/is-inited')
    store.commit('SET_INITED', inited)
  } catch (error) {
    console.error(error)
  }
}
