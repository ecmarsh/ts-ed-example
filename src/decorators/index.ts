import 'reflect-metadata' // Introduces 'Reflect' into global scope

import { AuthRouter } from '../routes'
import { Decorator, HttpMethod, MetaKeys, RequestHandler } from './types'

/**
 * Decorator Flow
 * 1. Node executes code.
 * 2. Class definition read in - decorators executed
 * 3. Decorators associate route configuration info with method by using metadata
 * 4. All method decorators run
 * 5. Class decorator of @controller runs last
 * 6. Class decorator reads metadata from each method, adds complete route definitions to router
 */

/**
* A Class decorator that adds route handlers to route.
* @param {string} [pathPrefix] A leading route path, if applicable.
* @param [router] An Express.Router instance that will override the default app router.
*/
function controller(pathPrefix: string = '', router = AuthRouter.getInstance()) {
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

/**
 * Add a middleware before route handler.
 * @param {Express.RequestHandler} [middleware] The middleware to add.
 */
function use(middleware: RequestHandler): Decorator {
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
function validateBodyProps(props: string[]): RequestHandler {
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

/** Exposed decorators */
export { controller, routeHandler, use, validate, HttpMethod }
