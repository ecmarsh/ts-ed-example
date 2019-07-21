import Express from 'express'

class AuthRouter {
  private static instance: Express.Router | null = null

  public static getInstance() {
    if (!AuthRouter.instance) {
      AuthRouter.instance = Express.Router()
    }

    return AuthRouter.instance
  }
}

export { AuthRouter }