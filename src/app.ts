import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import { AuthRouter } from './routes'


const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use(cookieSession({ keys: ['abcdefg'] }))

app.use(AuthRouter.getInstance())

export { app }