import url from 'url'
import qs from 'qs'
import { isEqual, pick, omitBy } from './lodash'

export const waitFor = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const patterns = {
  password: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
}

export function validateForm(form) {
  return new Promise((resolve) => {
    form.validate((valid) => {
      if (valid) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** Xóa phần tử trong mảng và trả về mảng các phần tử đã xóa
 * @param {(element, index:number) => boolean} func hàm xóa, phần tử sẽ bị xóa nếu return true
 * @returns {any[]} removed item
 */
export function removeItems(arr = [], func, keys) {
  if (typeof func !== 'function') {
    const origin = func
    func = (item) => {
      const a = keys ? pick(origin, keys) : origin
      const b = keys ? pick(item, keys) : item
      return a === b || isEqual(a, b)
    }
  }
  const removed = []
  for (let index = 0; index < arr.length; index++) {
    const element = arr[index]
    if (func(element, index)) {
      removed.push(element)
      arr.splice(index, 1)
      index--
    }
  }
  return removed
}

/**
 * Thay đổi một phần tử trong mảng
 * @param {*} arr Mảng cần thay đổi phẩn tử
 * @param {*} replaceBy phần tử mới
 * @param {((element, index:number)=> boolean) | string | string[]} func Hàm tìm phần tử cần thay đổi,
 * hoặc mảng các thuộc tính để so sánh các phần tử
 */
export function replace(arr = [], replaceBy, func) {
  if (typeof func !== 'function') {
    let compareKeys = func
    if (!Array.isArray(compareKeys)) compareKeys = [compareKeys]
    func = (item) => {
      const a = compareKeys ? pick(replaceBy, ...compareKeys) : replaceBy
      const b = compareKeys ? pick(item, ...compareKeys) : item
      return isEqual(a, b)
    }
  }
  const index = arr.findIndex(func)
  if (index >= 0) arr.splice(index, 1, replaceBy)
  return index >= 0
}

export function showErrorMessage(error) {
  this.$message.error(error?.response?.data?.message || error.message)
}

export const buildQuery = (params) => {
  return qs.stringify(omitBy(params, (v) => v === undefined || v === ''))
}

export const buildURL = (url, params) => {
  const qString = buildQuery(params)
  return url + (qString ? '?' + qString : '')
}

export const addUrlSuffix = (_url) => {
  const u = url.parse(_url)
  const txt = u.href.replace(u.search, '')
  return (!txt.endsWith('/') ? txt + '/' : txt) + (u.search ? u.search : '')
}

export const isSubRoute = (path, route) => {
  return url
    .parse(addUrlSuffix(path))
    .pathname.startsWith(url.parse(addUrlSuffix(route)).pathname)
}
