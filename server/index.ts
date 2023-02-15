import 'dotenv/config'
import express from 'express'
import { createServer } from 'http'
import config, { waitConnectionReady } from './config'
import router from './routes'
import cors from 'cors'
import morgan from 'morgan'
import { createDirectory, isDirectory } from './helpers/fs'
import env from './config/env'

async function main() {
  if (!(await isDirectory(env.UPLOAD_PATH))) {
    await createDirectory(env.UPLOAD_PATH)
    console.log('created upload folder', env.UPLOAD_PATH)
  }
  await waitConnectionReady
  const app = express()
  app.use(cors())
  app.use(morgan('dev'))
  app.use(express.json())

  app.use(router)

  // handle error
  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message,
      type: err.type || 'ServerError',
    })
  })

  const server = createServer(app)

  const host = config.env.HOST
  const port = config.env.SERVER_PORT

  server.listen(port, host, () => {
    console.log(`Server stared at http://${host}:${port}`)
    if (!config.env.HOST) {
      config.env.HOST = `http://${host}:${port}`
    }
  })
}

// start server
main()
