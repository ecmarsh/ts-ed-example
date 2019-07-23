import { AppRouter } from '../AppRouter'
import { controller, routeHandler, use, HttpMethod } from '../decorators'
import { makeAnchor, minify, styleInline } from '../utils'
import { Request, Response, NextFunction } from './types'


function requireAuth(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated: boolean = req.session && req.session.isAuthenticated

  if (isAuthenticated) {
    return next()
  }

  res.status(403).send(`Not permitted to this guarded route`)
}

@controller(AppRouter.getInstance())
export class Guarded {
  private static guardedView = (): string => {
    const guardedMessage = `Welcome to guarded route, logged in user!`,
      bold = styleInline('font-weight')('bold'),
      logoutLink = makeAnchor({ label: 'Logout', path: '/logout' })

    return `
      <div>
        <p ${bold}>${guardedMessage}</p>
        ${logoutLink}
      </div>
    `
  }

  @routeHandler('/guarded', 'get' as HttpMethod)
  @use(requireAuth)
  private getGuarded(req: Request, res: Response) {
    req.session && req.session.isAuthenticated
      ? res.send(minify(Guarded.guardedView()))
      : res.send(makeAnchor({ label: 'Logout', path: '/logout' }))
  }
}
