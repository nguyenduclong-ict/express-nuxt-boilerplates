import { AppModel } from '@/database'
import {
  createEntityController,
  deleteEntityController,
  listEntityController,
} from '@/helpers/crud'
import { isAuthenticated } from '@/middleware/auth'
import { Router } from 'express'

const router = Router()

router.post('/', isAuthenticated, createEntityController(AppModel))
router.get('/', isAuthenticated, listEntityController(AppModel))
router.delete('/:ids', isAuthenticated, deleteEntityController(AppModel))

export default router
