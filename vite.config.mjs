import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
import autoprefixer from 'autoprefixer'

export default defineConfig(() => {
  const env = process.env;
  return {
    plugins: [vue()],
    define: {
      __API_URL__: JSON.stringify(env.VITE_API_URL),
      __UPLOAD_URL__: JSON.stringify(env.VITE_UPLOAD_URL),
    },
    base: './',
    css: {
      postcss: {
        plugins: [
          autoprefixer({}), // add options if needed
        ],
      },
      preprocessorOptions: {
        scss: {
          quietDeps: true,
        },
      },
    },
    resolve: {
      alias: [
        // webpack path resolve to vitejs
        {
          find: /^~(.*)$/,
          replacement: '$1',
        },
        {
          find: '@/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
        {
          find: '@',
          replacement: path.resolve(__dirname, '/src'),
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue', '.scss'],
    },
    server: {
      port: 3000,
      proxy: {
        // https://vitejs.dev/config/server-options.html
      },
    },
  }
})
