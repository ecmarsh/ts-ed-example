import { makeInput, styleInline } from '../utils'
import { RouteConfig, Request, Response, RequestWithBody, CookieSessionObject } from './types'

const path = `/login`

export const login: RouteConfig = {
	get: {
		path,
		handler: getLogin
	},
	post: {
		path,
		handler: postLogin
	}
}

function getLogin(request: Request, response: Response) {
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

	response.send(loginForm)
}

function postLogin(request: RequestWithBody, response: Response) {
	const { email, password } = request.body
	if (email && password) {
		const authenticatedSession: CookieSessionObject = {
			isAuthenticated: true
		}

		request.session = authenticatedSession

		response.redirect(`/`)
	}
	else {
		const colorRed = styleInline('color')('red')
		const message = `Must enter email and password!`

		response.send(`<p ${colorRed}>${message}</p>`)
	}
}
