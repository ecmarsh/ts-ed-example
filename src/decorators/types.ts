/** Also defines a middleware. */
import { RequestHandler } from 'express'

/** The function a decorator factory returns. */
type Decorator = (
  target: any,
  key: string,
  desc: PropertyDescriptor
) => void

/** Reflect-metadata keys. */
enum MetaKeys {
  Path = 'path',
  ReqMethod = 'reqMethod',
  Middleware = 'middleware',
  Validate = 'validate'
}

/** Allowed parameters for `routeHandler` method. */
enum HttpMethod {
  All = 'all',
  Get = 'get',
  Post = 'post',
  Del = 'delete',
  Put = 'put',
  Patch = 'patch'
}

export { RequestHandler, Decorator, MetaKeys, HttpMethod }