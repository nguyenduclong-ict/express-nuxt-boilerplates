import { UserModel } from '@/database'
import { sendRequestError } from '@/helpers/error'
import { createController } from '@/helpers/router'
import _ from 'lodash'

export const getUserController = createController(async (req, res) => {
  const user = await UserModel.findById(req.user.id)
  if (!user) {
    return sendRequestError(res, 401, {
      message: 'User not found',
      type: 'USER_NOT_FOUND',
    })
  }
  res.json(_.omit(user.toJSON(), ['password']))
})
