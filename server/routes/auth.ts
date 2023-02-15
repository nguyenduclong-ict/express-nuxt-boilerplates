import { Router } from 'express'
import { loginController, refreshTokenController } from '@/controllers'
import { getUserController } from '@/controllers/auth/get_user.controller'
import { isAuthenticated } from '@/middleware/auth'
import {
  logoutController,
  logoutValidators,
} from '@/controllers/auth/logout.controller'
import {
  initController,
  initCtrlValidators,
} from '@/controllers/auth/init.controller'
import { isInitedController } from '@/controllers/auth/is_inited.controller'

const router = Router()

router.post('/login', loginController)
router.get('/user', isAuthenticated, getUserController)
router.post(
  '/refresh',
  refreshTokenController.validators.body,
  refreshTokenController
)
router.post('/logout', logoutValidators.body, logoutController)
router.post('/init', initCtrlValidators.body, initController)
router.get('/is-inited', isInitedController)

export default router
