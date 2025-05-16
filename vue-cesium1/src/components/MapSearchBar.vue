<template>
  <div id="searchBar" class="p-4 w-full">
    <div class="flex gap-2 mb-2">
      <span class="search-icon">🔍</span>
      <input
          type="text"
          v-model="searchQuery"
          @keyup.enter="performSearch"
          placeholder="请输入搜索内容"
          class="flex-1 border border-gray-300 px-2 py-1 rounded"
      />
      <button @click="performSearch" class="bg-teal-600 text-white px-4 py-1 rounded">
        搜索
      </button>
    </div>

    <ul v-if="searchResults.length > 0" class="bg-white shadow-md rounded divide-y">
      <li
          v-for="place in searchResults"
          :key="place.place_name"
          @click="locateOnMap(place)"
          class="cursor-pointer p-2 hover:bg-gray-100"
      >
        {{ place.place_name }}（{{ place.longitude.toFixed(4) }}, {{ place.latitude.toFixed(4) }}）
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import axios from 'axios'
import '../style.css'

const searchQuery = ref('')
const searchResults = ref([])

// 注入 Cesium Viewer 对象
const viewer = inject('viewer')
viewer.value = undefined;

const performSearch = async () => {
  if (!searchQuery.value) return
  try {
    const res = await axios.get(`http://localhost:5000/api/search?q=${searchQuery.value}`)
    searchResults.value = res.data
  } catch (err) {
    console.error('搜索失败:', err)
  }
}

// const locateOnMap = (place) => {
//   if (!viewer) {
//     console.error('Cesium viewer 未注入')
//     return
//   }
//   if(viewer.value){
//     viewer.value.camera.flyTo({
//       destination: Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 3000),
//       duration: 2
//     })
// }
//
// }
const locateOnMap = (place) => {
  if (!viewer?.value) return  // viewer 还没初始化，防止报错
  viewer.value.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 3000),
    duration: 2
  })
}
</script>

<style scoped>
#searchBar {
  z-index: 1000;
  background-color: white;
  max-width: 400px;
  border-radius: 6px;
}
.search-icon {
  font-size: 18px;
  align-self: center;
}
</style>
