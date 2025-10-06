import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Keep Vite on port 5173
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
        /*secure: true (maybe)*/
      }
    }
  }
})
