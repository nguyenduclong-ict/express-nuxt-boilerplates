import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'
import { Role } from './Role'

export class User {
  _id: any
  id?: any

  @field()
  username: string

  @field()
  password: string

  @field()
  is_admin: boolean // is admin user

  @field()
  is_owner: boolean // is root user, create when init application

  @field()
  is_verifed: boolean

  @field([{ type: SchemaTypes.ObjectId, ref: 'Role' }])
  roles: Role[]

  createdAt?: Date
  updatedAt?: Date
}

export const UserSchema = new Schema<User>(getSchemaDefinition(User), {
  timestamps: true,
})

addTransformIdForSchema(UserSchema)

export const UserModel = createModel('User', UserSchema)
