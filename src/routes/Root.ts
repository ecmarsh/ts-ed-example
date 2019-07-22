import { controller, routeHandler, HttpMethod } from '../decorators'
import { makeAnchor, minify } from '../utils'
import { Request, Response } from './types'


@controller()
export class Root {
  private static indexView = () => `
			<div>
				<p>Logged in</p>
				${makeAnchor({ label: 'Logout', path: '/logout' })}
			</div>
    `

  @routeHandler('/', 'get' as HttpMethod)
  private getIndex(req: Request, res: Response) {
    req.session && req.session.isAuthenticated
      ? res.send(minify(Root.indexView()))
      : res.send(makeAnchor({ label: 'Login', path: '/Login' }))
  }
}