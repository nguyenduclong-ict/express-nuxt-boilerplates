import _ from '~/utils/lodash'

export function set(key) {
  return function (state, value) {
    _.set(state, key, value)
  }
}
