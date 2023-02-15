import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { Schema } from 'mongoose'

export class App {
  _id: any
  id?: any

  @field()
  bundle_id: string

  @field()
  name: string

  createdAt?: Schema.Types.Date
  updatedAt?: Schema.Types.Date
}

export const AppSchema = new Schema<App>(getSchemaDefinition(App), {
  timestamps: true,
})

addTransformIdForSchema(AppSchema)

export const AppModel = createModel('App', AppSchema)
