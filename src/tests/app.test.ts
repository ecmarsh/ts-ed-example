import request from 'supertest'
import { queries } from '@testing-library/dom'

import { app } from '../app'
import { clearDocument, mount } from './testUtils'

describe('Index', () => {
  test('GET Request', async () => {
    const res = await request(app).get('/')
    expect(res.status).toBe(200)
  })

  test('Shows login link', async () => {
    const res = await request(app).get('/')
    expect(res.text).toMatch(/^\<a.+(Login)+\<\/a>$/)
  })
})

describe('Login', () => {
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

  test('Correct login post', async () => {
    const res = await request(app).post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })

    expect(res.redirect).toBe(true)
    expect(res.text).toMatch(/\/guarded/i)
    expect(res.header['set-cookie']).toBeTruthy()
  })

  test('Incorrect login post', async () => {
    const res = await request(app).post('/login')
      .send('email=')
      .send('password=')

    expect(res.text).toMatch(/must enter email.*password/i)
  })
})

describe('Guarded route', () => {
  test('Forbid unauthenticated user', async () => {
    const res = await request(app).get('/guarded')
    expect(res.status).toEqual(403)
    expect(res.text).toMatch(/not permitted/i)
  })

  test('Allow authenticated user', async () => {
    // Maintains cookies
    const agent = request.agent(app)

    const res = await agent.post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })
      .then(() => agent.get('/guarded'))

    expect(res.status).toEqual(200)
    expect(res.text).toMatch(/welcome.+user/i)
  })
})

describe('Logout', () => {
  test('Forbid unauthenticated user', async () => {
    const res = await request(app).get('/guarded')
    expect(res.status).toEqual(403)
    expect(res.text).toMatch(/not permitted/i)
  })

  test('Allow authenticated user', async () => {
    // Agent persists cookies:
    // http://visionmedia.github.io/superagent/#agents-for-global-state
    const agent = request.agent(app)

    const res = await agent.post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })
      .then(() => agent.get('/guarded'))

    expect(res.status).toEqual(200)
    expect(res.text).toMatch(/welcome.+user/i)
  })
})

describe('Logout', () => {
  test('Allow authenticated user', async () => {
    const agent = request.agent(app)

    const login = await agent.post('/login')
      .type('form')
      .send({ email: 'email@email.com' })
      .send({ password: 'password' })

    // Double check we're logged in
    // See above 'Guarded' test
    let guarded = await agent.get('/guarded')
    expect(guarded.status).toEqual(200)

    // Do Logout
    const logout = await agent.get('/logout')
    expect(logout.redirect).toBe(true)
    expect(logout.header.location).toMatch(/login/i)

    // Should be forbidden now
    guarded = await agent.get('/guarded')
    expect(guarded.status).toEqual(403)
  })
})


/**
 * TODO
 * [X] Index route shows login
 * [X] Login shows form
 * [X] Form has email and password
 * [X] Login sets cookies
 * [X] Guarded root shows error not logged in
 * [X] Guarded root shows when logged in
 * [X] Logout clears cookies
 */
