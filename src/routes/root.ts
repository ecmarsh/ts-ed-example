import { routeRegister } from '.'
import { makeLink, makeLinks } from '../utils'
import { RouteRegister, RouteRegistration, RouteConfig, Request, Response } from './types'
import { pathToFileURL } from 'url';

export const root: RouteConfig = {
	get: {
		path: '/',
		handler,
	},
}

function handler(request: Request, response: Response) {
	const { session } = request
	const isAuthenticated: boolean = session && session.isAuthenticated

	let res: string
	if (isAuthenticated) {
		res = `
			<div>
				<p>Logged in</p>
				${makeLink(routeRegister['logout'])}
			</div>
		`
	}
	else {
		const routes = parseRegister(routeRegister, ['/logout'])
		const nav = `<nav>${makeLinks(routes)}</nav>`
		res = nav
	}


	response.send(res)
}

function parseRegister(routeRegister: RouteRegister, pathFilters?: string[]): RouteRegistration[] {
	const routeRegistrations: RouteRegistration[] = []

	for (const value of Object.values(routeRegister)) {
		const isInFilters = ~value.path.indexOf(filters)
		if (!isInFilters) {
			routeRegistrations.push(value)
		}
	}

	return routeRegistrations
}