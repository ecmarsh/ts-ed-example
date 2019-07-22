/** Also defines a middleware. */
import { RequestHandler } from 'express'
export { RequestHandler }

/** The function a decorator factory returns. */
export type Decorator = (
  target: any,
  key: string,
  desc: PropertyDescriptor
) => void

/** Reflect-metadata keys. */
export enum MetaKeys {
  Path = 'path',
  ReqMethod = 'reqMethod',
  Middleware = 'middleware',
  Validate = 'validate'
}

/** Allowed parameters for `routeHandler` method. */
export enum HttpMethod {
  All = 'all',
  Get = 'get',
  Post = 'post',
  Del = 'delete',
  Put = 'put',
  Patch = 'patch'
}

/** Typecheck parameters passed to route handler descriptor.  */
export interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler
}