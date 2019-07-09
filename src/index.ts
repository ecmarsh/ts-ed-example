import express, { Request, Response } from 'express'

const app = express()

app.get('/', function (req: Request, res: Response) {
	res.send(`Hello, world`)
})

app.listen(3000, function printListening() {
	console.log(`Listening on port 3000`)
})
