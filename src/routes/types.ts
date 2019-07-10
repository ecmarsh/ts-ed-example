import { Router, RequestHandler, Request, Response, NextFunction } from 'express'

export { Router, RequestHandler, Request, Response, NextFunction }

export interface RequestWithBody extends Request {
	body: {
		[prop: string]: string | undefined
	}
}

export interface CookieSessionObject extends CookieSessionInterfaces.CookieSessionObject {
	[key: string]: any
	isAuthenticated?: boolean
}

export type RouteRegister = Map<string, RouteRegistration>

export interface RouteRegistration {
	label: string
	path: string
}

export interface HasRegistration {
	registration: RouteRegistration
}
