<script setup lang="ts">
// import { ref } from 'vue'
// import { useRouter } from 'vue-router'
// export default {
//   name: 'Register',
//   setup() {
//     const router = useRouter()
//
//     const username = ref('')
//     const email = ref('')
//     const password = ref('');
//
//     return {
//       username,
//       email,
//       password,
//     },
//   }
// }

</script>

<template>
  <div class="register-container">
    <div class="register-form">
      <h2>注册</h2>
      <div class="form-group">
        <label for="username">用户名</label>
        <input
            type="text"
            id="username"
            v-model="username"
            placeholder="请输入用户名"
        />
      </div>
      <div class="form-group">
        <label for="email">邮箱</label>
        <input
            type="email"
            id="email"
            v-model="email"
            placeholder="请输入邮箱"
        />
      </div>
      <div class="form-group">
        <label for="password">密码</label>
        <input
            type="password"
            id="password"
            v-model="password"
            placeholder="请输入密码"
        />
      </div>
      <div class="login-link">
        已有账号？ <router-link to="/login">去登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>