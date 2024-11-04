import { defineConfig ,loadEnv} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.REACT_APP_API_KEY': JSON.stringify(env.REACT_APP_API_KEY),
      'process.env.FIREBASE_API_KEY':JSON.stringify(env.FIREBASE_API_KEY),
      'process.env.AUTH_DOMAIN':JSON.stringify(env.AUTH_DOMAIN),
      'process.env.PROJECT_ID':JSON.stringify(env.PROJECT_ID),
      'process.env.STORAGE_BUCKET':JSON.stringify(env.STORAGE_BUCKET),
      'process.env.MESSAGE_SEND_ID':JSON.stringify(env.MESSAGE_SEND_ID),
      'process.env.APP_ID':JSON.stringify(env.APP_ID)
    },
    plugins: [react()],
  }
})