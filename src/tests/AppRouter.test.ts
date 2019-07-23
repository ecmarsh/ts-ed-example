import { AppRouter } from '../AppRouter'

afterEach(() => {
  jest.resetModules()
})

describe('Router singleton', function testSingletonRouter() {
  test('Lazy initialization', () => {
    expect(AppRouter.isInitialized()).toBe(false)
  })

  test('Create instance when requested', () => {
    expect(AppRouter.isInitialized()).toBe(false)
    const instance = AppRouter.getInstance()
    expect(AppRouter.isInitialized()).toBe(true)
  })

  test('Returns same instance', () => {
    const instance1 = AppRouter.getInstance()
    const instance2 = AppRouter.getInstance()
    expect(instance1).toBe(instance2)
  })

})