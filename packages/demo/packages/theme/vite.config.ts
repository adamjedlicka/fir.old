import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      name: 'gql',
      transform(code, id) {
        if (id.endsWith('.gql')) {
          return `export default '${code.replace(/\n/gs, '').replace(/[\n\r\s][\n\r\s]+/gs, ' ')}'`
        }
      },
    },
  ],
})
