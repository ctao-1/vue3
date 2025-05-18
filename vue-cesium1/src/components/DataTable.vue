<template>
  <table class="container">
    <thead>
      <tr>
        <th>地点</th>
        <th>坐标</th>
        <th>高程</th>
        <th>事件</th>
        <th>日期</th>
        <th>描述</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in tableData" :key="item.place_name">
        <td>{{ item.place_name }}</td>
        <td>{{ item.longitude }}, {{ item.latitude }}</td>
        <td>{{ item.elevation }}</td>
        <td>{{ item.incident }}</td>
        <td>{{ item.incident_data }}</td>
        <td>{{ item.description }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tableData = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:5000/api/places')
  tableData.value = res.data
})
</script>

<style scoped>
.container{
  position: absolute;
  top: 0;
  left: 190px;
  right:0;
  border-collapse: separate;
}
th td{
  padding: 50px 20px;
}
</style>