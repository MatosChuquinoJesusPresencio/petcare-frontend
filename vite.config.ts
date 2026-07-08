import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const target = env.VITE_URL_API || 'http://localhost:8080'

  return {
    plugins: [
      react(),
    ],
    server: {
      proxy: {
        '/api': { target },
      },
    },
  }
})
