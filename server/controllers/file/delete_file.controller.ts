import config from '@/config'
import { MediaModel } from '@/database/Media'
import { sendRequestError } from '@/helpers/error'
import { unlink } from '@/helpers/fs'
import { compareObjectId } from '@/helpers/mongo'
import { createController } from '@/helpers/router'
import path from 'path'

export const deleteFileController = createController(async (req, res) => {
  const ids = req.params.ids.split('+').filter((item) => !!item)
  const medias = await MediaModel.find({
    _id: {
      $in: ids,
    },
  })
  await Promise.all(
    medias.map((media) =>
      (async () => {
        if (!media.is_public && compareObjectId(media.user_id, req.user.id)) {
          return sendRequestError(res, 403, {
            message: 'Cannot delete file',
          })
        }

        await MediaModel.deleteOne({ _id: media._id })
        await unlink(path.join(config.env.UPLOAD_PATH, media.key))
      })()
    )
  )

  return {
    deletedCount: medias.length,
    success: true,
  }
})
