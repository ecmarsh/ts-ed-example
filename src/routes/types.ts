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

export interface RouteRegister {
	get(key: string): RouteRegistration
	set(key: string, value: RouteRegistration): RouteMap
	register(registerable: Registerable): RouteMap
	delete(key: string): boolean
	clear(): void
	forEach(callback: RoutesCallback, thisArg?: any): void
}

export type RouteMap = Map<string, RouteRegistration>

export interface RouteRegistration {
	label: string
	path: string
}

export interface Registerable {
	registration: RouteRegistration
}

export type RoutesCallback = (value: RouteRegistration, key: string, map: RouteMap) => void
