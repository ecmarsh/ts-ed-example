import { routes } from '.'
import { Request, Response } from './types'

export const path = '/logout'

export const registration = {
	label: 'Logout',
	path,
}

export function get(req: Request, res: Response) {
	req.session = undefined
	res.redirect(routes.get('login').path)
}