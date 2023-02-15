import env from '@/config/env'
import { LoginTokenData, verifyToken } from '@/config/jwt'
import { UserModel } from '@/database'
import { MediaModel } from '@/database/Media'
import { ServerError } from '@/helpers/error'
import { createController } from '@/helpers/router'
import express from 'express'

const sendLocalFile = express.static(env.UPLOAD_PATH)

export const getFileController = createController(async (req, res, next) => {
  const key = req.params['0']

  let authInfo: LoginTokenData

  if (req.query.token) {
    authInfo = verifyToken(req.query.token as string)
  }

  const media = await MediaModel.findOne({
    key,
  })

  if (!media) {
    throw new ServerError('File not found', 404)
  }

  if (!authInfo && !media.is_public) {
    throw new ServerError('Cannot access file', 403)
  }

  if (!media.is_public && !authInfo?.is_owner) {
    const user = await UserModel.findById(authInfo.id, null, {
      populate: ['roles'],
    })

    let canAccess = user.roles.some((role) => role.is_full_permissions)

    if (!canAccess) {
      const roleMaps = {}
      const permissionMaps = {}

      user.roles.forEach((r) => {
        roleMaps[r.uid] = true
        r.permissions?.forEach((p) => {
          permissionMaps[p] = true
        })
      })

      canAccess =
        !media.access.roles.some((r) => roleMaps[r]) ||
        !media.access.permissions.some((r) => permissionMaps[r]) ||
        !media.access.users.some((r) => r === authInfo.id)

      if (!canAccess) {
        throw new ServerError('Cannot access file', 403)
      }
    }
  }

  if (media.source === 'local') {
    res.ended = true
    sendLocalFile(req, res, next)
  }
})
