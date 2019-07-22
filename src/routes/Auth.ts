import { makeInput, makeAnchor, minify } from '../utils'
import { controller, routeHandler, validate, HttpMethod } from '../decorators'
import { Request, Response, CookieSessionObject } from './types'

@controller()
export class Auth {
  static loginForm = (): string => `
    <form method="POST">
      <h1>Login</h1>
      <fieldset>
        ${makeInput('email')}
        ${makeInput('password')}
        <input type="submit" value="Login" />
      </fieldset>
    </form>
  `

  static loggedIn = (): string => `
    <div>
      <p>You're logged in!</p>
      <p>${makeAnchor({ label: 'Logout', path: '/logout' })}</p>
    </div>
  `

  @routeHandler('/login', 'get' as HttpMethod)
  private getLogin(req: Request, res: Response) {
    req.session && req.session.isAuthenticated
      ? res.send(minify(Auth.loggedIn()))
      : res.send(minify(Auth.loginForm()))
  }

  @routeHandler('/login', 'post' as HttpMethod)
  @validate('email', 'password')
  private postLogin(req: Request, res: Response) {
    const authenticatedSession: CookieSessionObject = {
      isAuthenticated: true
    }

    req.session = authenticatedSession
    res.redirect(`/guarded`)
  }

  @routeHandler('/logout', 'get' as HttpMethod)
  private getLogout(req: Request, res: Response) {
    req.session = void 0
    res.redirect('/login')
  }
}
