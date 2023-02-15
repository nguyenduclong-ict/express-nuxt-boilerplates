import {
  addTransformIdForSchema,
  createModel,
  field,
  getSchemaDefinition,
} from '@/helpers/mongo'
import { model, Schema } from 'mongoose'

export class AccountCrawl {
  _id: any
  id?: any

  /** Id của app */
  @field()
  bundle_id: string

  @field()
  cookie: string

  @field()
  c_user: string

  createdAt?: Schema.Types.Date

  updatedAt?: Schema.Types.Date
}

export const AccountCrawlSchema = new Schema<AccountCrawl>(
  getSchemaDefinition(AccountCrawl),
  {
    timestamps: true,
  }
)

addTransformIdForSchema(AccountCrawlSchema)

export const AccountCrawlModel = createModel('AccountCrawl', AccountCrawlSchema)
