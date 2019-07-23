import Express from 'express'

class AppRouter {
  private static instance: Express.Router | null = null

  public static getInstance() {
    if (!this.isInitialized()) {
      this.instance = Express.Router()
    }

    return AppRouter.instance
  }

  public static isInitialized() {
    return this.instance != null
  }
}

export { AppRouter }