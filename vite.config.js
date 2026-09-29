import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'geojson-loader',
      transform(src, id) {
        if (id.endsWith('.geojson')) {
          return {
            code: `export default ${src}`,
            map: null
          }
        }
      }
    }
  ],
})
