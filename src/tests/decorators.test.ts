import request from 'supertest'
import express from 'express'


describe('Decorators', function testDecorators() {
  const bodyParser = require('body-parser')
  const cookieSession = require('cookie-session')
  const { controller, routeHandler, validate, use, HttpMethod } = require('../decorators')

  /**
   * A clean router instance to override controller.
   * `app.use(router)` after setting up the test case.
   */
  let router: express.Router | undefined
  let app: any

  beforeEach(() => {
    app = express()
    router = express.Router()
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieSession({ keys: ['secret', 'keys'] }))
  })

  afterEach(() => {
    app = undefined
    router = undefined
  })

  test('@routeHandler(path, method)', async function testRouteHandler() {
    @controller('', router)
    class TestRouteHandler {
      static text = 'Route binded!'
      @routeHandler('/test', HttpMethod.Get)
      getText(req: any, res: any) {
        res.send(TestRouteHandler.text)
      }
    }

    app.use(router)
    const res = await request(app).get('/test')
    expect(res.text).toMatch(TestRouteHandler.text)
  })

  test('@controller(prefixRoute?, routerOveride?)', async function testController() {
    @controller('/root', router)
    class TestController {
      static text = 'Controller controlled!'
      @routeHandler('/auth', HttpMethod.Get)
      getText(req: any, res: any) {
        res.send(TestController.text)
      }
    }

    app.use(router)
    const res = await request(app).get('/root/auth')
    expect(res.text).toMatch(TestController.text)
  })


  test('@use(middleware)', async function testUseDecorator() {
    let wasRun = false

    function middleware(req: any, res: any, next: any) {
      wasRun = true
      next()
    }

    @controller('', router)
    class TestUse {
      @use(middleware)
      @routeHandler('/', HttpMethod.Get)
      getTest(req: any, res: any, next: any) {
        res.send('Should have ran middleware')
      }
    }

    app.use(router)

    expect(wasRun).toBe(false)
    const res = await request(app).get('/')
    expect(wasRun).toBe(true)
  })

  test('@validate(...dataProps)', async function testValidator() {
    @controller('', router)
    class TestValidate {
      static path = '/form'
      static text = 'Valid data'

      @routeHandler(TestValidate.path, HttpMethod.Post)
      @validate('email', 'password')
      post(req: any, res: any) {
        res.send(TestValidate.text)
      }
    }

    app.use(router)

    const noDataPost = await request(app).post(TestValidate.path)
    expect(noDataPost.status).toEqual(422)

    const missingDataPost = await request(app).post(TestValidate.path)
      .type('form')
      .send({ email: 'valid@email.com' })
      .send({ password: null })
    expect(missingDataPost.text).toMatch(/provide.*password/i)

    const validPost = await request(app).post(TestValidate.path)
      .type('form')
      .send({ email: 'valid@email.com' })
      .send({ password: 'validpassword' })
    expect(validPost.status).toEqual(200)
    expect(validPost.text).toMatch(TestValidate.text)
  })
})

/**
 * TODO
 * [X] Metadata
 * [X] Controller Class decorator
 * [X] Http method decorator
 * [X] Use middleware
 * [X] Validates correct data
 * [X] Validate sends error
 * [] Property descriptor parameter
 */