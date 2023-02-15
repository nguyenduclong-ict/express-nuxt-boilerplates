export const state = () => ({
  inited: false,
})

export const mutations = {
  SET_INITED(state, value) {
    state.inited = value
  },
}
