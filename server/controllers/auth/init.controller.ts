import config from '@/config'
import { hashPassword } from '@/config/encrypt'
import { ConfigModel, RoleModel, UserModel } from '@/database'
import { sendRequestError } from '@/helpers/error'
import { createController } from '@/helpers/router'
import { createValidateMD } from '@/helpers/validator'
import { IsString, IsStrongPassword, MinLength } from 'class-validator'
class InitBody {
  @MinLength(4)
  @IsString()
  username: string

  @IsStrongPassword({ minLength: 4 })
  password: string
}

export const initCtrlValidators = {
  body: createValidateMD(InitBody),
}

export const initController = createController(async (req, res) => {
  const doc = await ConfigModel.findOne({ key: 'inited' }, undefined)
  if (doc?.value) {
    return sendRequestError(res, 500, { type: 'ALREAD_INITED' })
  }

  const body: InitBody = req.body

  // create admin user
  const hashedPassword = await hashPassword(body.password)
  const [user] = await UserModel.create([
    {
      username: body.username,
      password: hashedPassword,
      is_admin: true,
      is_verifed: true,
      is_owner: true,
    },
  ])

  await ConfigModel.updateOne(
    { key: config.configKeys.INITED },
    {
      value: true,
    },
    { upsert: true }
  )

  // create default roles

  await RoleModel.create([
    {
      uid: 'admin',
      name: 'Admin',
      description: 'Role has all permission',
      is_default: true,
      is_full_permissions: true,
    },
    {
      uid: 'customer',
      name: 'Customer',
      description: 'Role of customer',
      is_default: true,
      is_full_permissions: false,
      permissions: [],
    },
  ])

  return { success: true, user_id: user.id }
})
