import request from 'supertest'


describe('Decorators', function testDecorators() {
  let app: any
  /** A clean router instance for each test. `app.use(router)` */
  let router: any

  beforeEach(() => {
    const express = require('express')
    const bodyParser = require('body-parser')
    const cookieSession = require('cookie-session')
    app = express()
    router = express.Router()
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieSession({ keys: ['secret'] }))
  })

  afterEach(() => {
    app = undefined
    router = undefined
  })

  test('@routeHandler(path, method)', async () => {
    const { controller, routeHandler } = require('../routes')

    @controller('', router)
    class TestRouteHandler {
      static text = 'Route binded!'
      @routeHandler('/test', 'get')
      getText(req: any, res: any) {
        res.send(TestRouteHandler.text)
      }
    }

    app.use(router)
    const res = await request(app).get('/test')
    expect(res.text).toMatch(TestRouteHandler.text)
  })

  test('@controller(prefixRoute?, routerOveride?)', async () => {
    const { controller, routeHandler } = require('../routes')

    @controller('/root', router)
    class TestController {
      static text = 'Controller controlled!'
      @routeHandler('/auth', 'get')
      getText(req: any, res: any) {
        res.send(TestController.text)
      }
    }

    app.use(router)
    const res = await request(app).get('/root/auth')
    expect(res.text).toMatch(TestController.text)
  })


  test('@use(middleware)', async () => {
    const { controller, routeHandler, use } = require('../routes')

    let wasRun = false
    function middleware(req: any, res: any, next: any) {
      wasRun = true
      next()
    }

    @controller('', router)
    class TestUse {
      @use(middleware)
      @routeHandler('/', 'get')
      getTest(req: any, res: any, next: any) {
        res.send('Should have ran middleware')
      }
    }

    app.use(router)

    expect(wasRun).toBe(false)
    const res = await request(app).get('/')
    expect(wasRun).toBe(true)
  })

  test('@validate(...dataProps)', async () => {
    const { controller, routeHandler, validate } = require('../routes')

    @controller('', router)
    class TestValidate {
      static path = '/form'
      static text = 'Valid data'

      @routeHandler(TestValidate.path, 'post')
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