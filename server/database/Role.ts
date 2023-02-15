import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

export class Role {
  _id: any
  id?: any

  @field()
  uid: string

  @field()
  name: string

  @field()
  description: string

  @field()
  is_full_permissions: boolean // role has full permission

  @field()
  is_default: boolean

  @field({
    type: Array,
    of: String,
  })
  permissions: string[]

  createdAt?: Date
  updatedAt?: Date
}

export const RoleSchema = new Schema<Role>(getSchemaDefinition(Role), {
  timestamps: true,
})

addTransformIdForSchema(RoleSchema)

export const RoleModel = createModel('Role', RoleSchema)
