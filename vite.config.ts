import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import lezer from 'unplugin-lezer/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    lezer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
