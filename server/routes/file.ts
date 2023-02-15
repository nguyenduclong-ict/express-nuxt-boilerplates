import {
  checkMediaExists,
  deleteFileController,
  getFileController,
  replaceFileController,
  uploadController,
} from '@/controllers/file'
import { MediaModel } from '@/database/Media'
import { listEntityController, updateEntityController } from '@/helpers/crud'
import { upload } from '@/helpers/upload'
import { isAuthenticated, verifyAuthToken } from '@/middleware/auth'
import { parseQuery } from '@/middleware/params'
import express, { Router } from 'express'
import _ from 'lodash'

const router = Router()

router.post(
  '/upload',
  express.urlencoded({ extended: true }),
  verifyAuthToken,
  upload.single('file'),
  uploadController
)

router.get('/', parseQuery, listEntityController(MediaModel))
router.delete('/:ids', isAuthenticated, deleteFileController)
router.put(
  '/:id/replace',
  isAuthenticated,
  checkMediaExists,
  upload.single('file'),
  replaceFileController
)
router.put(
  '/:id',
  isAuthenticated,
  checkMediaExists,
  (req, res, next) => {
    req.body = _.pick(req.body, ['name', 'alt'])
    next()
  },
  updateEntityController(MediaModel)
)
router.get('/*', getFileController)

export default router
