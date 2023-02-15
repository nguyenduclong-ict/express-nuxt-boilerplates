import 'reflect-metadata'
import { plainToClass } from 'class-transformer'
import { validate, ValidationError, getMetadataStorage } from 'class-validator'
import { RequestHandler } from 'express'
import { sendRequestError } from './error'

const metaDataStorage = getMetadataStorage()

function getErrorMessage(error: ValidationError, path?: string): string {
  let message = ''
  if (error.children.length) {
    message = getErrorMessage(error.children[0], error.property)
  } else {
    message = Object.values(error.constraints).pop()
  }
  if (path) message = `${path}.${message}`
  return message
}

export function createValidateMD(
  entityClass: any,
  target: 'body' | 'query' | 'params' = 'body'
): RequestHandler {
  const m = metaDataStorage.getTargetValidationMetadatas(
    entityClass,
    entityClass.constructor.name,
    true,
    false
  )

  const dto = metaDataStorage.groupByPropertyName(m)

  const func: RequestHandler = async (req, res, next) => {
    const raw = req[target]
    const data = plainToClass(entityClass, raw)

    const errors = await validate(data, { stopAtFirstError: true })
    if (errors.length > 0) {
      return sendRequestError(res, 422, {
        type: 'VALIDATION_ERROR',
        message: getErrorMessage(errors[0]),
        error: errors,
      })
    } else {
      req[target] = data
    }

    next()
  }

  ;(func as any).dto = dto
  ;(func as any).target = target

  return func
}
