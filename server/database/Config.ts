import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

export class Config {
  _id: any
  id?: any

  @field()
  key: string

  @field({ type: Schema.Types.Mixed })
  value: any

  createdAt?: Date
  updatedAt?: Date
}

export const ConfigSchema = new Schema<Config>(getSchemaDefinition(Config), {
  timestamps: true,
})

addTransformIdForSchema(ConfigSchema)

export const ConfigModel = createModel('Config', ConfigSchema)
