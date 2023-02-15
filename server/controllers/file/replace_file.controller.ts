import { MediaModel } from '@/database/Media'
import { sendRequestError } from '@/helpers/error'
import { createController } from '@/helpers/router'
import { RequestHandler } from 'express'

export const checkMediaExists: RequestHandler = async (req, res, next) => {
  const media = await MediaModel.findById(req.params.id)
  if (!media) {
    sendRequestError(res, 404, {
      message: 'Media not found',
    })
  }
  req.meta.media = media
  next()
}

export const replaceFileController = createController(async (req, res) => {
  const media = await MediaModel.findOneAndUpdate(
    { _id: req.params.id },
    {
      mimetype: req.file.mimetype,
      size: req.file.size,
    }
  )
  return media
})
