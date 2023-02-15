import config from '@/config'
import { comparePassword } from '@/config/encrypt'
import { LOGIN_TOKEN_TYPE, REFRESH_TOKEN_TYPE, signToken } from '@/config/jwt'
import { TokenModel, UserModel } from '@/database'
import { sendRequestError } from '@/helpers/error'
import { objectIdToString } from '@/helpers/mongo'
import { createController } from '@/helpers/router'

class LoginBody {
  username: string
  password: string
}

export const loginController = createController(async (req, res) => {
  const body: LoginBody = req.body

  const user = await UserModel.findOne({
    username: body.username,
  })

  if (!user) {
    return sendRequestError(res, 401, {
      type: 'USER_NOT_FOUND',
    })
  }

  if (!(await comparePassword(body.password, user.password))) {
    return sendRequestError(res, 401, {
      type: 'PASSWORD_NOT_MATCH',
    })
  }

  // create token
  const token = signToken(
    {
      id: objectIdToString(user.id),
      type: LOGIN_TOKEN_TYPE,
      ...(user.is_owner ? { is_owner: true } : {}),
    },
    config.LOGIN_TOKEN_EXPIRES
  )

  const refreshToken = signToken(
    {
      id: objectIdToString(user.id),
      type: REFRESH_TOKEN_TYPE,
    },
    config.REFRESH_TOKEN_EXPIRES
  )

  // save refresh token to database
  await TokenModel.create({
    token: refreshToken,
    user_id: objectIdToString(user.id),
    type: REFRESH_TOKEN_TYPE,
  })

  res.json({
    token,
    refresh_token: refreshToken,
  })
})
