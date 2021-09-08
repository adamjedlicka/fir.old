import { defineConfig } from 'vite'
import React from '@vitejs/plugin-react-refresh'

export default defineConfig({
  plugins: [React()],
  esbuild: {
    jsxInject: `import React from 'react';`,
  },
})
