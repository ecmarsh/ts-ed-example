import { routes } from '.'
import { makeAnchor, styleInline, minify } from '../utils'
import { Request, Response, NextFunction } from './types'

export const path = `/guarded`

export const registration = {
  label: 'Guarded',
  path,
}

export function next(req: Request, res: Response) {
  const guardedMessage = `Welcome to guarded route, logged in user!`
  const bold = styleInline('font-weight')('bold')
  const logoutLink = makeAnchor(routes.get('logout'))

  const guardedPageMarkup = `
		<div>
			<p ${bold}>${guardedMessage}</p>
			${logoutLink}
		</div>
	`

  res.send(minify(guardedPageMarkup))
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated: boolean = req.session && req.session.isAuthenticated

  if (isAuthenticated) {
    next()
    return
  }

  res.status(403).send(`Not permitted to this guarded route`)
}
