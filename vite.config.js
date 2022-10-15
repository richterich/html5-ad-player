import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig({
  server: {
    port: 8080,
    https: {
      key: fs.readFileSync('.cert.local/key.pem'),
      cert: fs.readFileSync('.cert.local/cert.pem')
    }
  }
})
