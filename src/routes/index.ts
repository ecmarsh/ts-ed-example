import { router } from './router'
import { routeRegister, register } from './routeRegister'
import * as index from './root'
import * as login from './login'
import * as logout from './logout'
import * as guarded from './guarded'


// INDEX
register(index)
router.get(index.path, index.get)

// LOGIN
register(login)
router.get(login.path, login.get)
router.post(login.path, login.post)

// LOGOUT
register(logout)
router.get(logout.path, logout.get)

// GUARDED
register(guarded)
router.get(guarded.path, guarded.requireAuth, guarded.next)


export { router, routeRegister as routes }