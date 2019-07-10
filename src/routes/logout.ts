import { RouteConfig, Request, Response } from './types'

export const logout: RouteConfig = {
	get: {
		path: `/logout`,
		handler,
	}
}

function handler(request: Request, response: Response) {
	request.session = undefined
	response.redirect('/login')
}