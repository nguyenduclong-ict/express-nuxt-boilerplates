import { Router } from 'express'
import authRoutes from './auth'
import fileRoutes from './file'
import appRoutes from './app'

const router = Router()

router.use((req, res, next) => {
  req.meta = {}
  next()
})

router.use('/auth', authRoutes)
router.use('/file', fileRoutes)
router.use('/app', appRoutes)

export default router
