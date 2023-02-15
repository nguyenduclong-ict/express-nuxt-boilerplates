import { RequestHandler, Router } from 'express'
import _ from 'lodash'
import { Model } from 'mongoose'
import urlJoin from 'url-join'
import { sendRequestError } from './error'
import { findDocuments, listDocuments, parsePopulateFromRequest } from './mongo'

export type LiteralUnion<T extends U, U = string> =
  | T
  | (U & Record<string, never>)

const getQuery = (query) => {
  return _.omit(query, [
    '_page',
    '_page_size',
    '_populates',
    '_sort',
    '_select',
    '_search',
  ])
}

export const listEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res) => {
    try {
      let query: any = getQuery(req.query)

      const result = await listDocuments(model, {
        query,
        page: req.query._page as any,
        pageSize: req.query._page_size as any,
        populates: req.query._populates as any,
        sort: req.query._sort as any,
        select: req.query._select as any,
        search: req.query._search as any,
      })

      res.json(result)
    } catch (error: any) {
      sendRequestError(res, 500, {
        message: error.message || error.name,
      })
    }
  }
}

export const findOneEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res) => {
    try {
      let query: any = getQuery(req.query)

      const queryBuilder = model.findOne(query)

      parsePopulateFromRequest(req.query.populates || []).forEach((item) => {
        queryBuilder.populate(item)
      })

      const result = await queryBuilder.exec()
      res.json(result)
    } catch (error: any) {
      sendRequestError(res, 500, {
        message: error.message || error.name,
      })
    }
  }
}

export const findEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res, next) => {
    try {
      let query: any = getQuery(req.query)

      const result = await findDocuments(model, {
        query,
        page: req.query._page as any,
        pageSize: req.query._page_size as any,
        populates: req.query._populates as any,
        sort: req.query._sort as any,
        select: req.query._select as any,
        search: req.query._search as any,
      })

      res.json(result)
    } catch (error: any) {
      sendRequestError(res, 500, {
        message: error.message || error.name,
      })
    }
  }
}

export const updateEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res) => {
    const id = req.params.id

    try {
      const entity = await model.findById(id)
      if (!entity) {
        sendRequestError(res, 404, {
          message: 'Entity not exists!',
        })
      }

      Object.assign(entity, _.omit(req.body, 'id'))
      await entity.save()
      return res.json(entity)
    } catch (error: any) {
      console.log(`updateEntityController error`, error)
      sendRequestError(res, 500, {
        message: error.message || error.name,
      })
    }
  }
}

export const createEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res) => {
    try {
      const body: any = req.body
      const entity = await model.create(body)
      return res.json(entity)
    } catch (error: any) {
      sendRequestError(res, 500, {
        message: error.message || error.name,
      })
    }
  }
}

export const deleteEntityController = (model: Model<any>): RequestHandler => {
  return async (req, res) => {
    try {
      const ids = req.params.id
        .split('+')
        .map((id) => id.trim())
        .filter((id) => !!id)

      console.log(ids)

      if (ids.length === 0) {
        return res.json({
          deletedCount: 0,
        })
      }

      const queryDelete: any = { _id: { $in: ids } }

      const result = await model.deleteMany(queryDelete, {})
      res.json(result)
    } catch (error: any) {
      console.error('deleteEntityController error', error)
      sendRequestError(res, 500, {
        message: error.message || error.name,
      })
    }
  }
}

type RestMethod = 'list' | 'create' | 'update' | 'find' | 'delete' | 'findOne'

export const registerRestApi = (
  router: Router,
  model: Model<any>,
  {
    path = '/',
    actions = ['list', 'create', 'update', 'find', 'findOne', 'delete'],
    middlewares = {},
  }: {
    path?: string
    actions?: LiteralUnion<RestMethod>[]
    middlewares?: { [k in RestMethod]?: any[] }
  } = {}
) => {
  actions.forEach((action) => {
    // create
    if (action === 'create') {
      router.post(
        path,
        ...(middlewares.create || []),
        createEntityController(model)
      )
    }
    // list
    else if (action === 'list') {
      router.get(path, ...(middlewares.list || []), listEntityController(model))
    }
    // find One
    else if (action === 'findOne') {
      router.get(
        urlJoin(path, '/findone'),
        ...(middlewares.findOne || []),
        findOneEntityController(model)
      )
    }
    // find
    else if (action === 'find') {
      router.get(
        urlJoin(path, '/find'),
        ...(middlewares.find || []),
        findEntityController(model)
      )
    }
    // update
    else if (action === 'update') {
      router.put(
        urlJoin(path, '/:id'),
        ...(middlewares.update || []),
        updateEntityController(model)
      )
    }
    // delete
    else if (action === 'delete') {
      router.delete(
        urlJoin(path, '/:id'),
        ...(middlewares.delete || []),
        deleteEntityController(model)
      )
    }
  })
}
