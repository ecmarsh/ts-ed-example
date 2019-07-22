import Express from 'express'

class AppRouter {
  private static instance: Express.Router | null = null

  public static getInstance() {
    if (!AppRouter.instance) {
      AppRouter.instance = Express.Router()
    }

    return AppRouter.instance
  }
}

export { AppRouter }