import { TokenModel } from '@/database'
import { createValidateMD } from '@/helpers/validator'
import { IsString } from 'class-validator'
import { RequestHandler } from 'express'

class Body {
  @IsString()
  refresh_token: string
}

export const logoutValidators = {
  body: createValidateMD(Body),
}

export const logoutController: RequestHandler = async (req, res) => {
  await TokenModel.deleteOne({
    token: req.body.refresh_token,
  })

  res.json({
    success: true,
  })
}
