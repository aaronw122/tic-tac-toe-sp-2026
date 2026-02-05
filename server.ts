import ViteExpress from 'vite-express';
import app  from './app'

const PORT = 5173

ViteExpress.listen(app, PORT, () => {
  console.log(`server is running on port ${PORT} `)
})
