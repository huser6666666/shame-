import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Relatif = fonctionne quelle que soit l’URL (évite la page blanche sur GitHub Pages)
  base: './',
})
