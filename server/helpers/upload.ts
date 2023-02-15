import multer from 'multer'
import slugify from 'slugify'
import shortid from 'shortid'
import path from 'path'
import env from '@/config/env'
import { Request } from 'express'
import { createDirectory, isDirectory, isExists } from './fs'
import { Media } from '@/database/Media'

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    if (req.meta?.media) {
      const media: Media = req.meta.media
      cb(null, path.join(env.UPLOAD_PATH, path.dirname(media.key)))
    } else {
      let destination
      if (req.user) {
        destination = path.join(env.UPLOAD_PATH, req.user.id)
        if (!(await isDirectory(destination))) {
          await createDirectory(destination)
        }
      } else {
        destination = env.UPLOAD_PATH
      }

      file.destination = destination
      cb(null, destination)
    }
  },
  filename: async function (req: Request, file, cb) {
    if (req.meta?.media) {
      const media: Media = req.meta.media
      cb(null, path.basename(media.key))
    } else {
      let name = slugify(file.originalname, { lower: true, locale: 'vi' })
      if (await isExists(path.join(file.destination, name))) {
        const ext = path.extname(file.originalname)
        const basename = path.basename(file.originalname, ext)
        const uniqueId = shortid()
        cb(
          null,
          slugify(basename + '-' + uniqueId + ext, {
            lower: true,
            locale: 'vi',
          })
        )
      } else {
        cb(null, name)
      }
    }
  },
})

export const upload = multer({ storage: storage })
