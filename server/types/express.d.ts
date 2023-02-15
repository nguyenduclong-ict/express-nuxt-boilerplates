import { LoginTokenData } from '@/config/jwt'

declare global {
  namespace Express {
    export interface Request {
      query: any
      token?: string
      user?: LoginTokenData
      meta?: any
    }

    export interface Response {
      ended?: boolean
    }
  }
}

export {}
