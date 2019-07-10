import express from 'express'
import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'

import { router } from './routes'
import { PORT } from './variables'


const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieSession({ keys: ['abcdefg'] }))
app.use(router)

app.listen(PORT, function printListening() {
	console.log(`Listening at http://localhost:${PORT}/`)
})
