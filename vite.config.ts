import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Pour GitHub Pages : remplace par le nom de ton repo si différent
  base: '/shame-/',
})
