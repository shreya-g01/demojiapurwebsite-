import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' makes the build work from any sub-path (GitHub Pages, Netlify, Vercel, a folder on a server).
export default defineConfig({
  base: './',
  plugins: [react()],
})
