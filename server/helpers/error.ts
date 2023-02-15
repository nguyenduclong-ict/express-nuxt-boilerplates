import { Response } from 'express'

export function sendRequestError(
  res: Response,
  statusCode: number,
  data?: Partial<ServerError>
) {
  res.status(statusCode).json(data)
}

export class ServerError extends Error {
  message: string

  constructor(
    message: string,
    public statusCode: number = 500,
    public type?: string,
    public error?: any
  ) {
    super(message)
  }
}
