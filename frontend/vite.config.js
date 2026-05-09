import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // theme:{
  //    extends:{
  //     colors:{
  //       'primary':"#5f6FFF"
  //     }
  //    }
  // },
  plugins: [  react(),],
  server:{port:5173}
})
