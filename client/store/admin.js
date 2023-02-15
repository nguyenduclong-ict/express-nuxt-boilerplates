import { set } from '~/utils/vuex'

export const state = () => ({
  sidebar: {
    items: [],
    collapse: false,
  },
})

export const getters = {
  sidebarItems(state, getterts, rootState, rootGetters) {
    const items = state.sidebar.items
    return items
  },
}

export const mutations = {
  setEntities: set('entities'),
  setResponsive: set('responsive'),
  toggleSidebar(state, value) {
    state.sidebar.collapse = value ?? !state.sidebar.collapse
  },
}
