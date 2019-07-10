import { Router } from 'express'
import { RouterInstance, RouteConfig } from './types'

const router = Router() as RouterInstance

router.addConfig = function addConfig(config: RouteConfig) {
	for (const [method, options] of Object.entries(config)) {
		const { path, handler } = options
		router[method].apply(router, [path, handler])
	}

	return router
}

export { router }