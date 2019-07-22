import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { AppRouter } from './AppRouter'
export { Auth, Guarded, Root } from './routes'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({ keys: ['abcdefg'] }))
app.use(AppRouter.getInstance())

export { app }