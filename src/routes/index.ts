import { AuthRouter } from './AuthRouter'
import { routeRegister as routes } from './routeRegister'
import * as index from './root'
import * as login from './login'
import * as logout from './logout'
import * as guarded from './guarded'

const router = AuthRouter.getInstance()

// INDEX
routes.register(index)
router.get(index.path, index.get)

// LOGIN
routes.register(login)
router.get(login.path, login.get)
router.post(login.path, login.post)

// LOGOUT
routes.register(logout)
router.get(logout.path, logout.get)

// GUARDED
routes.register(guarded)
router.get(guarded.path, guarded.requireAuth, guarded.next)

export { AuthRouter, routes }
