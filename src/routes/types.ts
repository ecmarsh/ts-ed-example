import { Router, RequestHandler, Request, Response } from 'express'


export { Router, RequestHandler, Request, Response }

export interface RequestWithBody extends Request {
	body: {
		[prop: string]: string | undefined
	}
}

export interface CookieSessionObject extends CookieSessionInterfaces.CookieSessionObject {
	[key: string]: any
	isAuthenticated?: boolean
}

export interface RouterInstance extends Router {
	[routerMethod: string]: any
	addConfig?: (config: RouteConfig) => this
}

export interface RouteConfig {
	[method: string]: {
		path: string
		handler: RequestHandler
	}
}

export type RouteRegister = {
	[routeKey: string]: any
}

export interface RouteRegistration {
	label: string
	path: string
}
