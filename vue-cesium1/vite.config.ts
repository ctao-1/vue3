import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium' // 引入插件
import vue from '@vitejs/plugin-vue'
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),cesium()],
  server:{
    port:5175,//自定义端口号
    allowedHosts: ["daa6-112-4-238-245.ngrok-free.app" +
    ""]
  },
})
