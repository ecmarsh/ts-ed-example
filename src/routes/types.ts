import { Router, RequestHandler, Request, Response, NextFunction } from 'express'

/** Types from express module. */
export { Router, RequestHandler, Request, Response, NextFunction }

/**
 * Override default request to ensure we check
 * for a body. The default Request interface
 * assumes that a body exists.
 */
export interface RequestWithBody extends Request {
  body: {
    [prop: string]: string | undefined
  }
}

/** Extends session to recognize string keys. */
export interface CookieSessionObject extends CookieSessionInterfaces.CookieSessionObject {
  [key: string]: any
  isAuthenticated?: boolean
}

/**
 * Associative store to register and receive app routes.
 * Acts as Proxy/Wrapper to actual route map.
 */
export interface RouteRegister {
  get(key: string): RouteRegistration
  set(key: string, value: RouteRegistration): RouteMap
  register(registerable: Registerable): RouteMap
  delete(key: string): boolean
  clear(): void
}

/** The subject of Route Register. */
export type RouteMap = Map<string, RouteRegistration>

/**
 * Necessities for a registerable module.
 * See the [[Registerable]] interface.
 */
export interface RouteRegistration {
  label: string
  path: string
}

/**
 * Defines a registerable module.
 * @usage RouteRegister.register(RouteRegisterable)
 */
export interface Registerable {
  registration: RouteRegistration
}
