import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // DEPOIS
    proxy: {
      '/api/steam-store': {
        target: 'https://store.steampowered.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/steam-store/, ''),
      },
      '/api/steam-web': {
        target: 'https://api.steampowered.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/steam-web/, ''),
      },
    },
  },
})
