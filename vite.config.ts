import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import lezer from 'unplugin-lezer/vite'
import { plugin as markdown, Mode } from 'vite-plugin-markdown'

export default defineConfig({
  plugins: [
    vue(),
    lezer(),
    markdown({ mode: [Mode.VUE] }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
