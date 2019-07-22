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
type Decorator = (
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
  Middleware = 'middleware',
  Validate = 'validate'
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
function routeHandler(path: string, reqMethod: HttpMethod = HttpMethod.Get): Decorator {
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
  return function wireRouter(target: Function) {
    const { prototype } = target
    for (const prop in prototype) {
      const path = Reflect.getMetadata(MetaKeys.Path, prototype, prop),
        method: HttpMethod = Reflect.getMetadata(MetaKeys.ReqMethod, prototype, prop),
        middlewares = Reflect.getMetadata(MetaKeys.Middleware, prototype, prop) || [],
        requiredBodyProps = Reflect.getMetadata(MetaKeys.Validate, prototype, prop) || []

      if (path && method) {
        const reqHandler = prototype[prop]
        const validator = validateBodyProps(requiredBodyProps)

        router[method](pathPrefix + path, ...middlewares, validator, reqHandler)
      }
    }
  }
}

/**
 * Add a middleware before route handler.
 * @param {Express.RequestHandler} [middleware] The middleware to add.
 */
function use(middleware: Express.RequestHandler): Decorator {
  return function addMiddleware(target, key, desc) {
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

/**
 * Validate method decorator. Defines the metadata to be validated.
 * @param {Array<string>} [props] The list of properties to validate.
 */
function validate(...props: string[]): Decorator {
  return function defineRequiredBodyProps(target, key, desc) {
    return Reflect.defineMetadata(
      MetaKeys.Validate,
      props,
      target,
      key
    )
  }
}

/**
 * Performs the validation of properties defined in metadata.
 * Calls next if has all properties, or sends a 422 error.
 * Props are passed from metadata accessed in controller.
 */
function validateBodyProps(props: string[]): Express.RequestHandler {
  return function validateBodyProps(req, res, next) {
    const sendError = (msg = 'Unprocessable Entity') => {
      res.status(422).send(msg)
    }

    if (!req.body) {
      return sendError()
    }

    for (const prop of props) {
      if (!req.body[prop]) {
        return sendError(`Please provide ${prop}.`)
      }
    }

    next()
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
  validate,
}

/**
 * Decorators
 * 1. Node executes code.
 * 2. Class definition read in - decorators executed
 * 3. Decorators associate route configuration info with method by using metadata
 * 4. All method decorators run
 * 5. Class decorator of @controller runs last
 * 6. Class decorator reads metadata from each method, adds complete route definitions to router
 */
