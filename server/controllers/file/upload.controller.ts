import env from '@/config/env'
import { MediaModel } from '@/database/Media'
import { ServerError } from '@/helpers/error'
import { createController } from '@/helpers/router'
import path from 'path'

export const uploadController = createController(async (req) => {
  // create media
  const file = req.file
  if (!file) {
    throw new ServerError('file missing!')
  }
  if (file) {
    const media = await MediaModel.create({
      user_id: req.user?.id || null,
      key: path.relative(env.UPLOAD_PATH, file.path),
      name: file.filename,
      source: 'local',
      mimetype: file.mimetype,
      size: file.size,
      is_public: req.body.is_public !== 'false',
      access: {},
    })
    return media
  }
})
