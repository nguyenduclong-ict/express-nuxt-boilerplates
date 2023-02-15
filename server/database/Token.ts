import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { Schema, SchemaTypes } from 'mongoose'

export class Token {
  _id: any
  id?: any

  @field()
  token: string

  @field({ type: SchemaTypes.ObjectId })
  user_id: any

  @field()
  type: number

  createdAt?: Date
  updatedAt?: Date
}

export const TokenSchema = new Schema<Token>(getSchemaDefinition(Token), {
  timestamps: true,
})

addTransformIdForSchema(TokenSchema)

export const TokenModel = createModel('Token', TokenSchema)
