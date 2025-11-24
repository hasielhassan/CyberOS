import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/CyberOS', // Root base path for custom domain
  server: {
    proxy: {
      '/api/windy': {
        target: 'https://api.windy.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/windy/, ''),
      },
    },
  },
})
