import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // 👈 IMPORTANT for GitHub Pages
  plugins: [react()],
  server: {
    proxy: {
      "/api/": {
        target: "https://plainb.onrender.com",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
