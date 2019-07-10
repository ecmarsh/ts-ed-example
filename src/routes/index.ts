import { router } from './router'
import { root as rootConfig } from './root'
import { login as loginConfig } from './login'
import { logout as logoutConfig } from './logout'
import { RouteRegister } from './types'

const routeRegister: RouteRegister = {
	root: {
		label: `Home`,
		path: `/`
	},
	login: {
		label: `Login`,
		path: `/login`
	},
	logout: {
		label: `Logout`,
		path: `/logout`,
	}
}

if (router.addConfig) {
	router.addConfig(rootConfig)
	router.addConfig(loginConfig)
	router.addConfig(logoutConfig)
}

export { router, routeRegister }