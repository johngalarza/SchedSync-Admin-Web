import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: [
      'p01--admin-web--k7nq7x6nhfgl.code.run'
    ]
  }
})
