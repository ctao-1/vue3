import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'; // 确保导入了 router
// import 'uno.css' // 引入unocss

createApp(App).use(router).mount('#app')
// App.use(router); // 注册 Vue Router
