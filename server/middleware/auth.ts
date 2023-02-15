import { LOGIN_TOKEN_TYPE, LoginTokenData, verifyToken } from '@/config/jwt'
import { sendRequestError } from '@/helpers/error'
import { RequestHandler } from 'express'

export const verifyAuthToken: RequestHandler = async (req, res, next) => {
  try {
    if (req.user) return next()
    const token = req.headers['authorization']?.startsWith('Bearer ')
      ? req.headers['authorization'].slice(7)
      : null

    const tokenData: LoginTokenData = verifyToken(token)
    if (tokenData.type === LOGIN_TOKEN_TYPE) {
      req.token = token
      req.user = tokenData
    }
  } catch (error) {
    console.log(`Parse token error`, error.message)
  }
  next()
}

export const isAuthenticated: RequestHandler[] = [
  verifyAuthToken,
  (req, res, next) => {
    if (!req.user) {
      return sendRequestError(res, 401, {
        message: 'Require authenticat for access this route',
        type: 'UnAuthorize',
      })
    }
    next()
  },
]
