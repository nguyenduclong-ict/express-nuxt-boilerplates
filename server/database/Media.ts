import env from '@/config/env'
import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { ObjectId, Schema, SchemaTypes } from 'mongoose'
import urlJoin from 'url-join'
import { User } from './User'

export class Media {
  _id: any
  id?: any

  @field()
  name: string

  @field()
  key: string

  @field()
  expire_at: Date

  @field()
  expire_in: number

  @field({ type: SchemaTypes.ObjectId, ref: 'User' })
  user_id?: ObjectId

  user?: User

  @field({ type: String, enum: ['local', 's3'] })
  source: 'local' | 's3'

  @field()
  mimetype: string

  @field()
  size: number

  @field()
  path: string

  @field()
  is_public: boolean

  @field({ type: SchemaTypes.Mixed })
  access?: {
    roles?: string[] // role ids
    permissions?: string[] // permissions ids
    users?: string[] // users
  }

  createdAt?: Date
  updatedAt?: Date
}

export const MediaSchema = new Schema<Media>(getSchemaDefinition(Media), {
  timestamps: true,
})

MediaSchema.virtual('user', {
  ref: 'User',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
})

MediaSchema.virtual('url').get(function () {
  if (env.HOST) {
    return urlJoin(env.HOST, 'file', this.key)
  }
  return null
})

MediaSchema.index({ name: 'text' })

addTransformIdForSchema(MediaSchema)

export const MediaModel = createModel('Media', MediaSchema)
