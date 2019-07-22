import { controller, routeHandler, HttpMethod } from '../decorators'
import { makeAnchor, minify } from '../utils'
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
				${makeAnchor({ label: 'Logout', path: '/logout' })}
			</div>
		`
  }
  else {
    response = makeAnchor({ label: 'Login', path: '/Login' })
  }


  res.send(minify(response))
}

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