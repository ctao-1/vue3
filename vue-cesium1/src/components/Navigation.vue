<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateTo = (path: string) => {
  console.log('Navigating to:', path); // 调试信息
  if (!path) {
    console.error('Invalid path:', path);
    return;
  }
  router.push(path);
};

const navItems = ref([
  { name: '🔍可视化界面', path: '/cesium' },
  { name: '🔍数据管理', path: '/datatable' },
]);
</script>

<template>
  <div>
    <!-- 左侧导航栏 -->
    <div class="sidebar">
      <h1>长征可视化信息系统</h1>
      <ul class="nav-list">
        <li v-for="item in navItems"
            :key="item.path" class="nav-item" @click="navigateTo(item.path)">
          {{ item.name }}</li>
      </ul>
    </div>

    <!-- 页面内容 -->
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: rgba(84, 172, 216, 0.721);
  /* background-image: url('/static/images/background.png'); */
  background-image: url('/static/images/red.jpg');
  /* color: white; */
  padding: 10px;
  width: 170px; /* 固定宽度 */
  height: 100vh; /* 占满屏幕高度 */
  position: fixed; /* 固定在左侧 */
  top: 0;
  left: 0;
}
.sidebar h1 {
  font-size: 30px;
  margin-top: 30px;
  margin-bottom: 10px;
  color: #d71616;
  text-align: center;
}

.sidebar h1:hover {
  filter: drop-shadow(0 0 2em rgb(8, 74, 105));
}

.nav-list {
  list-style: none;/* 去掉默认的列表样式 */
  margin:30px 0 30px 0px;
  width: 100%; /* 占满导航栏宽度 */
  display: flex;
  flex-direction: column; /* 设置为列方向排列 */
  gap: 30px; /* 每个导航项之间的间距 */
  text-align: center;
  text-shadow: rgba(84, 172, 216, 0.721);
}
.nav-item {
  font-size: 20px;
  color: rgb(10, 10, 10);
  cursor: pointer;
  padding: 10px 0;
  width: 100%; /* 占满父容器宽度 */
}
.nav-item:hover {
  text-decoration: underline;
  background-color: rgba(1, 1, 1, 0.2); /* 添加悬停背景色 */
}
.content {
  padding: 20px;
}
</style> -->
