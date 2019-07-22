import { app } from './app'
import { PORT } from './variables'

app.listen(PORT, function printListening() {
  console.log(`Listening at http://localhost:${PORT}/`)
})
