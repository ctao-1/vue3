import { defineConfig } from 'vite'
import cesium from 'vite-plugin-cesium' // 引入插件
import vue from '@vitejs/plugin-vue'
// import unocss from 'unocss/vite' // 引入unocss

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(),cesium()],
  server:{
    port:5175,//自定义端口号
    allowedHosts: ["df3a-240e-400-6e28-11a2-156f-6c25-309a-26bf.ngrok-free.app" +
    ""]
  },
})
