import express from 'express'
import { router } from './routes'
import bodyParser from 'body-parser'

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(router)


const PORT = 3000

app.listen(PORT, function printListening() {
	console.log(`Listening at http://localhost:${PORT}`)
})
