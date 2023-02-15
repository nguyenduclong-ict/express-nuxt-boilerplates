import mongoose, { connect } from 'mongoose'
import env from './env'

mongoose.set('strictQuery', true)

connect(`mongodb://${env.DB_HOST}:${env.DB_PORT}`, {
  user: env.DB_USER,
  pass: env.DB_PASSWORD,
  dbName: env.DB_NAME,
  replicaSet: 'replicaset',
  directConnection: true,
})

const connection = mongoose.connection

export const waitConnectionReady = connection.asPromise().then(async () => {
  console.log(`mongodb: connected to database ${connection.db.databaseName}!`)
  return connection
})

export default connection
