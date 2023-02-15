import qs from 'qs'
import { RequestHandler } from 'express'

export const parseQuery: RequestHandler = async (req, res, next) => {
  const i = req.url.indexOf('?')
  const queryString = i >= 0 ? req.url.slice(i + 1) : ''
  req.query = qs.parse(queryString)
  next()
}
