import { makeInput, styleInline } from '../utils'
import { Request, Response, RequestWithBody, CookieSessionObject } from './types'

export const path = `/login`

export const registration = {
	label: 'Login',
	path,
}

export function get(req: Request, res: Response) {
	const loginForm = `
		<form method="POST">
			<h1>Login</h1>
			<fieldset>
				${makeInput('email')}
				${makeInput('password')}
				<input type="submit" value="Login" />
			</fieldset>
		</form>
	`

	res.send(loginForm)
}

export function post(req: RequestWithBody, res: Response) {
	const { email, password } = req.body
	if (email && password) {
		const authenticatedSession: CookieSessionObject = {
			isAuthenticated: true
		}

		req.session = authenticatedSession
		res.redirect(`/guarded`)
	}
	else {
		const colorRed = styleInline('color')('red')
		const message = `Must enter email and password!`

		res.send(`<p ${colorRed}>${message}</p>`)
	}
}
