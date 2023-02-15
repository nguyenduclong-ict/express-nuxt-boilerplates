import { RequestHandler } from 'express'

export function createController<T extends {}>(
  handler: RequestHandler,
  obj?: T
) {
  const _handler: RequestHandler = async function (req, res, next) {
    try {
      const result = await handler(req, res, next)
      if (!res.writableEnded && !res.ended) {
        typeof result === 'string' ? res.end(result) : res.json(result)
      }
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  return Object.assign(_handler, obj)
}
