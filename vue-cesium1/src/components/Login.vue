<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const login = () => {
  if (username.value === 'admin' && password.value === '123456') {
    localStorage.setItem('isLoggedIn', 'true'); // 保存登录状态
    router.push('/home'); // 跳转到导航栏页面
  } else {
    errorMessage.value = '用户名或密码错误';
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-header">
      <h1>长征可视化信息系统</h1>
    </div>
    <div class="login-form">
      <h2>登录</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input id="username" v-model="username" type="text" />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input id="password" v-model="password" type="password" />
      </div>
      <button class="login-button" @click="login">登录</button>
      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <div class="register-link">
        还没有账号？ <router-link to="/register">去注册</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;/* 使用 Flexbox 布局 */
  justify-content: center;/*水平居中*/
  align-items: center;
  height: 100vh; /* 占满整个视口高度 */
  width: 100vw; /* 占满整个视口宽度 */
  /*padding:0; /* 去除默认内边距 */
  /*margin:0; /* 去除默认外边距 */
  background-image: url('/static/images/red.jpg'); /* 替换为实际的动态图 URL */
  background-size: cover; /* 背景图覆盖整个容器 */
  background-position: center; /* 背景图居中显示 */
  background-repeat: no-repeat; /* 防止背景图重复 */

  .login-header{
    text-align: center;
    position: absolute;
    top: 10px; /* 距离容器顶部 10px */
    font-size: 20px;
    color: rgba(59, 48, 10, 0.8);
    font-family: 'Courier New', Courier, monospace; /* 更改字体为艺术化的等宽字体 */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* 添加文字阴影 */
    letter-spacing: 2px; /* 增加字母间距 */
    will-change: filter;
    transition: filter 300ms;/* 添加过渡效果 */
  }
  .login-header:hover{
    filter: drop-shadow(0 0 2em rgba(172, 151, 67, 0.67));
    transform: scale(1.1); /* 鼠标悬停时放大效果 */
  }
  .login-header.vue:hover{
    filter: drop-shadow(0 0 2em #42b883aa);
  }

  .login-form {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background: rgba(255, 255, 255, 0.5); /* 设置为白色半透明 */
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h2 {
    margin-bottom: 24px;
    text-align: center;
    color: #333;
    font-size: 24px;
    letter-spacing: 8px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px #4a90e2, 0 0 20px #4a90e2; /* 添加发光效果 */
  }

  .form-group {
    margin-bottom: 20px;

  }

  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: bold;
    color: #555;
  }

  input {
    width: 100%;
    padding: 12px;
    border: 1px solid #b1aeae;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.3s;
    background: rgba(255, 253, 253, 0.6);
    color:#333
  }

  input:focus {
    outline: none;
    border-color: #4a90e2;
  }

  .error-message {
    color: #ff4d4f;
    font-size: 14px;
    margin-bottom: 16px;
  }

  .login-button {
    width: 100%;
    padding: 12px;
    background-color: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .login-button:hover {
    background-color: #357dd5;
  }

  .login-button:disabled {
    background-color: #a5c6f2;
    cursor: not-allowed;
  }

  .register-link {
    margin-top: 16px;
    text-align: center;
    font-size: 14px;
  }

  .register-link a {
    color: #4a90e2;
    text-decoration: none;
  }

  .register-link a:hover {
    text-decoration: underline;
  }
}
</style>