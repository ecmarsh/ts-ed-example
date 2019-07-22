import request from 'supertest'
import { queries } from '@testing-library/dom'

import { app } from '../app'
import { clearDocument, mount } from './testUtils'

describe('Root', function testIndexPath() {
  test('GET Request', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
  })

  test('Shows login link', async () => {
    const res = await request(app).get('/')
    expect(res.text).toMatch(/^\<a.+(Login)+\<\/a>$/)
  })
})

describe('Login', function testLoginRoute() {
  afterEach(() => {
    clearDocument()
  })

  test('GET Request responds with login form', async () => {
    const res = await request(app).get('/login')
    expect(res.status).toBe(200)
    expect(res.text).toMatch(/\<form.*POST.*\>/)
  })

  test('Form Elements', async () => {
    const res = await request(app).get('/login')
      .then(res => mount(res.text))

    const form = document.body.querySelector('form') as HTMLFormElement
    expect(form).toBeTruthy()

    const [email, password, button] = [
      queries.getByLabelText(form, 'email') as HTMLInputElement,
      queries.getByLabelText(form, 'password') as HTMLInputElement,
      queries.getByDisplayValue(form, 'Login') as HTMLInputElement
    ]
    const formEls = [email, password, button]
    formEls.forEach(formEl => expect(formEl).toBeTruthy())
  })

  test('Valid login attempt', async () => {
    const res = await request(app).post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })

    // After logging in, app should redirect to
    // protected route, "/guarded", and start an
    // authenticated session via cookie header.
    expect(res.redirect).toBe(true)
    expect(res.text).toMatch(/\/guarded/i)
    expect(res.header['set-cookie']).toBeTruthy()
  })

  test('Invalid login attempt', async () => {
    const res = await request(app).post('/login')
      .send('email=')
      .send('password=')

    // Should recieve HTML markup referencing invalid input data.
    expect(res.text).toMatch(/must enter email.*password/i)
  })
})

describe('Protected route', function testProtectedRoute() {
  test('Forbid unauthenticated user', async () => {
    const res = await request(app).get('/guarded')
    expect(res.status).toEqual(403)
    expect(res.text).toMatch(/not permitted/i)
  })

  test('Allow authenticated user', async () => {
    // Persists connection. Thus, cookies.
    // SuperTest by default closes connections after requests.
    // http://visionmedia.github.io/superagent/#agents-for-global-state
    // https://nodejs.org/dist/latest-v12.x/docs/api/http.html#http_class_http_agent
    const agent = request.agent(app)

    // 1. Send the form data and proceed to protected route.
    const res = await agent.post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })
      .then(() => agent.get('/guarded'))

    // 2. If all goes well, response should be OK
    // and should be greeted by a welcome message.
    expect(res.status).toEqual(200)
    expect(res.text).toMatch(/welcome.+user/i)
  })
})

describe('Logout', function testLogout() {
  test('Unauthenticate session', async () => {
    // 1. Set up app with agent (See "allow auth user" test above)
    const agent = request.agent(app)

    // 2a. Login. We need something to log out of.
    const login = await agent.post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })

    // 2b. Assert logged in by checking protected route.
    let guarded = await agent.get('/guarded')
    expect(guarded.status).toEqual(200)

    // 3. Do the logout.
    const logout = await agent.get('/logout')
    expect(logout.redirect).toBe(true)
    expect(logout.header.location).toMatch(/login/i)

    // 4. Assert logged out by checking protected route.
    guarded = await agent.get('/guarded')
    expect(guarded.status).toEqual(403)
  })
})

//import { LoginController, post, get, use, requireAuth, validateBody } from '../routes'

describe('Decorators', function testDecorators() {
  let app: any
  /** A clean router instance for each test. `request(app).use(router)` */
  let router: any

  beforeEach(() => {
    const express = require('express')
    app = express()
    router = express.Router()
    const bodyParser = require('body-parser')
    const cookieSession = require('cookie-session')
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(cookieSession({ keys: ['secret'] }))
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
})




/**
 * TODO
 * [X] Index route shows login
 * [X] Login shows form
 * [X] Form has email and password
 * [X] Valid login sets cookies
 * [X] Invalid login information response
 * [X] Guarded root shows error not logged in
 * [X] Guarded root shows when logged in
 * [X] Logout clears cookies
 * [X] Metadata
 * [X] Controller Class decorator
 * [x] Http method decorator
 * [X] Use middleware
 * [] Auth decorator
 * [] Validate req body decorator
 */

/**
 * 1. Node executes our code.
 * 2. Class definition read in - decorators executed
 * 3. Decorators associate route configuration info with method by using metadata
 * 4. All method decorators run
 * 5. Class decorator of @controller runs last
 * 6. Class decorator reads metadata from each method, adds complete route definitions to router
 */