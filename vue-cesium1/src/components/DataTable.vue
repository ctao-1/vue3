<template>
  <div class="table-wrapper">
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
        <tr v-for="item in tableData" :key="item.place_name + item.latitude + item.longitude">
          <td style="width: 120px">{{ item.place_name }}</td>
          <td style="width: 120px">{{ item.longitude }}, {{ item.latitude }}</td>
          <td style="width: 90px">{{ item.elevation }}</td>
          <td style="width: 120px">{{ item.incident }}</td>
          <td style="width: 100px">{{ item.incident_data }}</td>
          <td style="width: 280px">{{ item.description }}</td>
        </tr>
        <!-- 新增行 -->
        <tr v-if="addingRow">
          <td><input v-model="newRow.place_name" placeholder="地点" style="width: 110px"/></td>
          <td>
            <input v-model="newRow.longitude" placeholder="经度" style="width: 80px;" />
            <input v-model="newRow.latitude" placeholder="纬度" style="width: 80px;" />
          </td>
          <td><input v-model="newRow.elevation" placeholder="高程" style="width: 70px"/></td>
          <td><input v-model="newRow.incident" placeholder="事件" style="width: 100px"/></td>
          <td><input v-model="newRow.incident_data" placeholder="日期" style="width: 80px"/></td>
          <td><input v-model="newRow.description" placeholder="描述" style="width: 270px"/></td>
        </tr>
      </tbody>
    </table>
    <!-- 右上角圆形按钮 -->
    <button
      class="circle-btn"
      @click="addingRow ? confirmAdd() : startAdd()"
      :title="addingRow ? '确定' : '添加'"
    >
      <span v-if="!addingRow">+</span>
      <span v-else>确定</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const tableData = ref([])
const addingRow = ref(false)
const newRow = ref({
  place_name: '',
  longitude: '',
  latitude: '',
  elevation: '',
  incident: '',
  incident_data: '',
  description: ''
})

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  const res = await axios.get('http://localhost:5000/api/places')
  tableData.value = res.data
}

function startAdd() {
  addingRow.value = true
  newRow.value = {
    place_name: '',
    longitude: '',
    latitude: '',
    elevation: '',
    incident: '',
    incident_data: '',
    description: ''
  }
}

async function confirmAdd() {
  // 简单校验
  if (!newRow.value.place_name || !newRow.value.longitude || !newRow.value.latitude) {
    alert('地点和坐标不能为空')
    return
  }
  // 提交到后端
  try {
    await axios.post('http://localhost:5000/api/uploading', {
      ...newRow.value
    })
    addingRow.value = false
    await fetchData()
  } catch (e) {
    alert('上传失败')
  }
}
</script>

<style scoped>
.table-wrapper {
  position: relative;
  width: 100%;
}
.container{
  position: absolute;
  top: 0;
  right:0;
  left: 20px;
  border-collapse: collapse; /* 关键：合并边框 */
  border: 1px solid #ccc;    /* 表格外边框 */
}
th, td{
  padding: 8px 16px;
  border: 1px solid #ccc;    /* 单元格边框 */
  text-align: center;
}
thead {
  background: #f5f5f5;
}
.circle-btn {
  position: fixed;           /* 改为fixed，脱离父容器，始终浮动在页面右上角 */
  top: 32px;                 /* 距离页面顶部距离，可根据需要调整 */
  right: 48px;               /* 距离页面右侧距离，可根据需要调整 */
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 123, 255, 0.5);
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  z-index: 1000;             /* 保证浮在最上层 */
}
.circle-btn:hover {
  background: rgba(0, 123, 255, 0.8);
}
.circle-btn span {
  font-size: 24px;
  user-select: none;
}
</style>