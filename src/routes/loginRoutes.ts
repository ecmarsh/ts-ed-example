import { Router } from 'express'

export const router = Router()

router.get(`/login`, function (request, response) {
	function makeInput(name: string, type?: string): string {
		const capitalizeStyle = `style="text-transform: capitalize"`
		const markup = `
				<div>
					<label for=${name} ${capitalizeStyle}>${name}</label>
					<input type="${type || name}" name="${name}" />
				</div>
			`

		return markup
	}

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
})

router.post(`/login`, function (request, response) {
	const { email, password } = request.body

	response.send(email + password)
})
