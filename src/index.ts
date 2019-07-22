import { app } from './app'
import { PORT } from './variables'
import * as decorators from './decorators'
import { Auth, Guarded, Root } from './routes'

app.listen(PORT, function printListening() {
  console.log(`Listening at http://localhost:${PORT}/`)
})
