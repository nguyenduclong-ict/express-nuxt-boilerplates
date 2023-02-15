import 'reflect-metadata'
import _ from 'lodash'
import { ObjectId } from 'mongodb'

import mongoose, {
  ClientSession,
  Connection,
  FilterQuery,
  Model,
  Schema,
  SchemaDefinitionProperty,
  Types,
} from 'mongoose'

import { CompileModelOptions, Document, model } from 'mongoose'

type MongooseDoc<T> = Document<unknown, any, T> &
  T &
  Required<{
    _id: unknown
  }>

interface ParamsMethodList {
  page?: number
  page_size?: number
  sort?: string[]
  populates?: any[]
  fields?: string[]
  search?: string
}

interface ReponseMethodList<T> {
  data: MongooseDoc<T>[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

interface BaseModelMethods<T> {
  list(
    this: Model<T>,
    query: FilterQuery<T>,
    options: ParamsMethodList
  ): {
    data: MongooseDoc<T>[]
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

export function createModel<
  T,
  X extends { [x: string]: (this: Model<T> & BaseModelMethods<T>) => unknown }
>(
  name: string,
  schema?: Schema<T>,
  methods?: X,
  options?: CompileModelOptions,
  collection?: string
) {
  const _model = model(name, schema, collection, options)
  return Object.assign(
    _model,
    {
      async list(
        this: Model<T>,
        filter: FilterQuery<T>,
        params: ParamsMethodList = {} as never
      ): Promise<ReponseMethodList<T>> {
        let { page, page_size, sort, fields, populates } = params
        const projection: any = {}

        fields?.forEach((key) => {
          projection[key] = 1
        })

        const sortParams: any = {}
        sort?.forEach((item) => {
          if (item.startsWith('-')) {
            sortParams[item.replace('-', '')] = 1
          } else {
            sortParams[item] = -1
          }
        })

        const queryBuilder = this.find(filter, projection, {
          sort,
        })

        const countBuilder = queryBuilder.clone()

        if (!page || page < 1) page = 1
        if (!page_size || page_size < 1) page_size = 100

        queryBuilder.skip((page - 1) * page_size)
        queryBuilder.limit(page_size)

        populates?.forEach((populateItem) => {
          queryBuilder.populate(populateItem)
        })

        const [docs, total] = await Promise.all([
          queryBuilder.exec(),
          countBuilder.countDocuments(),
        ])

        return {
          data: docs,
          page: page,
          page_size: page_size,
          total,
          total_pages: Math.ceil(total / page_size),
        }
      },
    },
    methods
  )
}

/** Decorator */

export interface Entity {
  _id?: any
  id?: any
}

export interface EntityTimestamp {
  createdAt?: Date
  updatedAt?: Date
}

// decorators
export function field(
  options?: SchemaDefinitionProperty | SchemaDefinitionProperty[]
) {
  return function (target: any, propertyKey: string) {
    target[propertyKey] =
      options || Reflect.getMetadata('design:type', target, propertyKey)
  }
}

export const getSchemaDefinition = (entityClass: any) => {
  const definition = {} as any
  Object.keys(entityClass.prototype).forEach((key) => {
    if (entityClass.prototype[key]) definition[key] = entityClass.prototype[key]
  })

  return definition
}

export const addTransformIdForSchema = (schema: Schema) => {
  schema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString()
  })

  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc: any, ret: any) {
      delete ret._id
    },
  })
}

/**
 * Add hook after delete document using methods 'remove', 'deleteOne', 'deleteMany', 'findOneAndRemove'
 * @param schema Schema
 * @param callbackFunction
 */
export const hookAfterDelete = (
  schema: Schema,
  callbackFunction: (docs: any[], method: string, context: any) => void
) => {
  // remove
  schema.post('remove', async function (doc) {
    await callbackFunction([doc], 'remove', this)
  })

  const actions = ['deleteMany', 'deleteOne', 'findOneAndRemove']

  actions.forEach((action) => {
    schema.pre(action as any, async function (...args) {
      const conditions = _.get(this, '_conditions')
      const docs = await this.model.find(conditions)
      _.set(this, '_delete_ids', docs)
    })
    schema.post(action as any, async function () {
      const docs = _.get(this, '_delete_ids')
      await callbackFunction(docs, action, this)
    })
  })
}

interface ListDocumentsParams<T> {
  query: FilterQuery<T>
  page?: number
  pageSize?: number
  sort?: string[]
  populates?: any[]
  select?: string
  search?: string
}

export const listDocuments = async <T>(
  model: Model<T>,
  params: ListDocumentsParams<T>
) => {
  const page = +(params.page || 1)
  const pageSize = +(params.pageSize || 10)

  let query: any = { ...params.query }
  let populates: any[] = parsePopulateFromRequest(params.populates || [])
  let sort: any = {}

  if (params.search) {
    Object.assign(query, { $text: { $search: `"${params.search}"` } })
  }

  if (params.sort) {
    if (typeof params.sort === 'string') {
      Object.assign(sort, sortStringToObject(params.sort))
    } else if (Array.isArray(params.sort)) {
      params.sort.forEach((sortItem: any) => {
        Object.assign(sort, sortStringToObject(sortItem))
      })
    }
  }

  const queryBuilder = model.find(query)
  let countQuery

  populates.forEach((populateItem) => {
    queryBuilder.populate(populateItem)
  })

  countQuery = queryBuilder.clone()

  if (params.select) queryBuilder.select(params.select)

  if (!_.isEmpty(sort)) queryBuilder.sort(sort)

  if (page) {
    queryBuilder.skip((page - 1) * pageSize)
  }

  if (pageSize) queryBuilder.limit(pageSize)

  const [docs, total] = await Promise.all([
    queryBuilder.exec(),
    countQuery.countDocuments(),
  ])

  return {
    data: docs,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(total / pageSize),
    total,
  }
}

export const findDocuments = async <T>(
  model: Model<T>,
  params: ListDocumentsParams<T>
) => {
  const page = +(params.page || 1)
  const pageSize = +(params.pageSize || 10)

  let query: any = { ...params.query }

  let populates: any[] = parsePopulateFromRequest(params.populates || [])
  let sort: any = {}

  if (params.search) {
    Object.assign(query, { $text: { $search: `"${params.search}"` } })
  }

  if (params.sort) {
    if (typeof params.sort === 'string') {
      Object.assign(sort, sortStringToObject(params.sort))
    } else if (Array.isArray(params.sort)) {
      params.sort.forEach((sortItem: any) => {
        Object.assign(sort, sortStringToObject(sortItem))
      })
    }
  }

  const queryBuilder = model.find(query)

  populates.forEach((populateItem) => {
    queryBuilder.populate(populateItem)
  })

  if (params.select) queryBuilder.select(params.select)

  if (!_.isEmpty(sort)) queryBuilder.sort(sort)

  if (page) {
    queryBuilder.skip((page - 1) * pageSize)
  }

  if (pageSize) queryBuilder.limit(pageSize)

  const docs = await queryBuilder.exec()

  return docs
}

function sortStringToObject(value: string) {
  let sortValue, sortKey
  if (value.startsWith('-')) {
    sortValue = -1
    sortKey = value.slice(1)
  } else {
    sortValue = 1
    sortKey = value
  }

  return {
    [sortKey]: sortValue,
  }
}

export function parsePopulateFromRequest(populates: any) {
  const result: any[] = []
  if (populates) {
    populates = parseJSON(populates)
    if (Array.isArray(populates)) {
      populates.forEach((item: any) => {
        result.push((item = parseJSON(item)))
      })
    } else {
      result.push(populates)
    }
  }
  return result
}

export const parseJSON = (value: any) => {
  try {
    if (typeof value !== 'string') return value
    if (
      (value.startsWith('[') && value.endsWith(']')) ||
      (value.startsWith('{') && value.endsWith('}'))
    ) {
      return JSON.parse(value)
    }
  } catch (error) {}
  return value
}

export const objectIdToString = (id: Types.ObjectId | string | any): any => {
  // objectid
  if (id === null) return id
  if (id instanceof Types.ObjectId) return id.toHexString()
  if (typeof id === 'string') return id

  // object contains objectid, example: shop {_id}
  if (id._id) id = id._id
  else if (id.id) id = id.id
  if (id instanceof Types.ObjectId) return id.toHexString()
  if (typeof id === 'string') return id
  return String(id)
}

export const objectId = objectIdToString

export const compareObjectId = (id1: any, id2: any) => {
  return objectIdToString(id1) === objectIdToString(id2)
}

export const createObjectId = () => new ObjectId().toString()

export const withTransaction = async (
  func: (session: ClientSession) => void
) => {
  const session = await mongoose.startSession()
  await session.startTransaction()
  try {
    const result = await func(session)
    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }
}
