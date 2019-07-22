import { AuthRouter } from './AuthRouter'
import { routeRegister as routes } from './routeRegister'
import * as index from './root'
import * as login from './login'
import * as logout from './logout'
import * as guarded from './guarded'

const router = AuthRouter.getInstance()

// INDEX
routes.register(index)
router.get(index.path, index.get)

// LOGIN
routes.register(login)
router.get(login.path, login.get)
router.post(login.path, login.post)

// LOGOUT
routes.register(logout)
router.get(logout.path, logout.get)

// GUARDED
routes.register(guarded)
router.get(guarded.path, guarded.requireAuth, guarded.next)

export { AuthRouter, routes }

///////////////
// DECORATORS
///////////////

/**
 * Method decorator function.
 */
type Decorated = (
  target: any,
  key: string,
  desc: PropertyDescriptor
) => void


import Express from 'express'
import 'reflect-metadata'
import { Request, Response } from './types'

enum MetaKeys {
  Path = 'path',
  ReqMethod = 'reqMethod',
  Middleware = 'middleware'
}

enum HttpMethod {
  All = 'all',
  Get = 'get',
  Post = 'post',
  Del = 'delete',
  Put = 'put',
  Patch = 'patch'
}

/**
 * Attaches a class method to the router. The class should be
 * decorated with `@controller`.
 * @param {string} [path] The path endpoint, appended to controller `pathPrefix.`
 * @param [httpMethod] The method for the handler. Defaults to `GET`.
 */
function routeHandler(path: string, reqMethod: HttpMethod = HttpMethod.Get): Decorated {
  return function defineHandlerMetadata(target, key, desc) {
    Reflect.defineMetadata(MetaKeys.Path, path, target, key)
    Reflect.defineMetadata(MetaKeys.ReqMethod, reqMethod, target, key)
  }
}

/** The default router associated with decorators. */
const controllerRouter = Express.Router()

/**
 * A Class decorator that adds route handlers to route.
 * @param {string} [pathPrefix] A leading route path, if applicable.
 * @param [router] An Express.Router instance that will override the default app router.
 */
function controller(pathPrefix: string = '', router = controllerRouter) {
  return function setupRouter(target: Function) {
    const { prototype } = target
    for (const prop in prototype) {
      const path = Reflect.getMetadata(MetaKeys.Path, prototype, prop),
        method: HttpMethod = Reflect.getMetadata(MetaKeys.ReqMethod, prototype, prop),
        middlewares = Reflect.getMetadata(MetaKeys.Middleware, prototype, prop) || []

      if (path && method) {
        const reqHandler = prototype[prop]
        router[method](pathPrefix + path, ...middlewares, reqHandler)
      }
    }
  }
}

/**
 * Use
 */
function use(middleware: Express.RequestHandler): Decorated {
  return function addMiddleware(target, key, string) {
    const middlewares = Reflect.getMetadata(
      MetaKeys.Middleware,
      target,
      key
    ) || []

    Reflect.defineMetadata(
      MetaKeys.Middleware,
      [...middlewares, middleware],
      target,
      key
    )
  }
}

@controller('/auth')
class LoginController {
  @routeHandler(login.path, HttpMethod.Get)
  getLogin(req: Request, res: Response) {
    login.get(req, res)
  }
}


export {
  LoginController,
  HttpMethod,
  controller,
  controllerRouter,
  routeHandler,
  use,
}
