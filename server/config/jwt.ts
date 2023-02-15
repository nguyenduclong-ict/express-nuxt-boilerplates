import jwt, { JwtPayload } from 'jsonwebtoken'
import env from './env'

export function signToken(data: any, expiresIn?: string) {
  const opts: any = {}
  if (expiresIn) opts.expiresIn = expiresIn
  return jwt.sign(data, env.JWT_SECRET, opts)
}

export function verifyToken(token: string): LoginTokenData | RefreshTokenData {
  return jwt.verify(token, env.JWT_SECRET) as any
}

export interface LoginTokenData extends JwtPayload {
  id: string
  is_owner?: boolean
  type: number
}

export interface RefreshTokenData extends JwtPayload {
  id: string
  type: number
}

export const LOGIN_TOKEN_TYPE = 1
export const REFRESH_TOKEN_TYPE = 2
