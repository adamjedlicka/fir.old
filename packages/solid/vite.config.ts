import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin({ ssr: true })],
  optimizeDeps: {
    exclude: ['*'],
  },
})
