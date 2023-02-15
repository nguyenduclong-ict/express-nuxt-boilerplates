import config from '@/config'
import {
  LOGIN_TOKEN_TYPE,
  REFRESH_TOKEN_TYPE,
  RefreshTokenData,
  signToken,
  verifyToken,
} from '@/config/jwt'
import { TokenModel } from '@/database'
import { sendRequestError } from '@/helpers/error'
import { createController } from '@/helpers/router'
import { createValidateMD } from '@/helpers/validator'
import { IsString } from 'class-validator'

class Body {
  @IsString()
  refresh_token: string
}

export const refreshTokenController = createController(
  async (req, res) => {
    let tokenData: RefreshTokenData
    try {
      const token = req.body.refresh_token
      tokenData = verifyToken(token)
      if (tokenData.type !== REFRESH_TOKEN_TYPE) {
        throw new Error('Token type must be REFRESH_TOKEN_TYPE')
      }

      // find token in databse
      const tokenInDatabase = await TokenModel.findOne({
        user_id: tokenData.id,
        token,
      })

      if (!tokenInDatabase) {
        throw new Error('Token Invalid')
      }

      // generate login token
      const loginToken = signToken(
        {
          id: tokenData.id,
          type: LOGIN_TOKEN_TYPE,
        },
        config.LOGIN_TOKEN_EXPIRES
      )

      return {
        token: loginToken,
      }
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // delete token in database
        await TokenModel.deleteOne({ token: req.token })
      }
      sendRequestError(res, 403, { message: error.message, type: error.name })
    }
  },
  {
    validators: {
      body: createValidateMD(Body),
    },
  }
)
