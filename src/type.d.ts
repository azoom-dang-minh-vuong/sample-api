import {
  RequestHandler as ExpressRequestHandler,
  ErrorRequestHandler as ExpressErrorRequestHandler,
} from 'express'

declare global {
  namespace Express {
    export type RequestHandler = ExpressRequestHandler
    export type ErrorRequestHandler = ExpressErrorRequestHandler
    interface Request {
      token?: string
    }
  }
}
