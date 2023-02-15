import env from './env'
import connection from './connection'

const config = {
  env,
  connection,
  LOGIN_TOKEN_EXPIRES: '10m', // 10 minutes
  REFRESH_TOKEN_EXPIRES: '30d', // 30 days
  configKeys: {
    INITED: 'inited',
  },
}

export default config
export * from './connection'
