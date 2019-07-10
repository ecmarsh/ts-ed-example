import { routes } from '.'
import { makeAnchor } from '../utils'
import { Request, Response } from './types'

export const path = `/`

export const registration = {
	label: 'Home',
	path,
}

export function get(req: Request, res: Response) {
	const { session } = req
	const isAuthenticated: boolean = session && session.isAuthenticated

	let response: string
	if (isAuthenticated) {
		response = `
			<div>
				<p>Logged in</p>
				${makeAnchor(routes.get('logout'))}
			</div>
		`
	}
	else {
		response = makeAnchor(routes.get('login'))
	}


	res.send(response)
}