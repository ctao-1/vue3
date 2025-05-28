<template>
  <div id="searchBar">
    <!-- 搜索条 -->
    <div class="search-row">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        v-model="searchQuery"
        @keyup.enter="performSearch"
        placeholder="请输入搜索内容"
        class="search-input"
      />
      <button @click="performSearch" class="search-button">搜索</button>
    </div>   
    <!-- 搜索结果列表 -->
    <div class = "search-results">
        <ul v-if="searchResults.length > 0 && resultsta" class="result-list">
        <li
            v-for="place in searchResults"
            :key="place.place_name"
            @click="locateOnMap(place)"
            class="result-item"
        >
            地点：{{ place.place_name }}<br />
            事件：{{ place.incident }}<br />
            坐标：（{{ place.longitude.toFixed(4) }}, {{ place.latitude.toFixed(4) }}）
        </li>
        </ul>
        <button v-if="searchResults.length > 0 && resultsta" @click="resultState" class="result-show"> 关闭结果 </button>
    </div>
    <!-- 详情窗口 -->
    <div v-if="selectedPlace" class="info-panel">
      <h3>{{ selectedPlace.place_name }}</h3>
      <p><strong>事件：</strong>{{ selectedPlace.incident }}</p>
      <p><strong>时间：</strong>{{ selectedPlace.incident_data }}</p>
      <p><strong>坐标：</strong>{{ selectedPlace.longitude.toFixed(4) }}, {{ selectedPlace.latitude.toFixed(4) }}</p>
      <p><strong>海拔：</strong>{{ selectedPlace.elevation }} 米</p>
      <p><strong>描述：</strong>{{ selectedPlace.description }}</p>
      <div v-if="image" class = 'info-image'>
        <img
          :src="'data:image/jpeg;base64,' + image"
          alt="地点图片"
          class="info-image"
        />
      </div>
      <button @click="selectedPlace = null" class="close-info"> 关闭 </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import axios from 'axios'
import * as Cesium from 'cesium'
import emitter from '../eventBus'

const searchQuery = ref('')
const searchResults = ref([])
const resultsta = ref(false)
const selectedPlace = ref(null)
const viewer = inject('viewer')
viewer.value = undefined
const image = ref(null)

const performSearch = async () => {
  resultsta.value = true
  if (!searchQuery.value) return
  try {
    const res = await axios.get(`http://localhost:5000/api/search?q=${searchQuery.value}`)
    searchResults.value = res.data
  } catch (err) {
    console.error('搜索失败:', err)
  }
}

const resultState = () => {
  resultsta.value = false
}

const locateOnMap = async (place) => {
    image.value = null
    if (!viewer?.value) return
    viewer.value.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(place.longitude, place.latitude, 4000),
        duration: 2
    })
    const res = await axios.get(`http://localhost:5000/api/image/${place.place_name}`)
    image.value = res.data.image
    selectedPlace.value = place // 触发详情面板显示
    }
    
emitter.on('show-place-detail', async (place) => {
  image.value = null
  selectedPlace.value = place
  // 可选：自动拉取图片
  try {
    const res = await axios.get(`http://localhost:5000/api/image/${place.place_name}`)
    image.value = res.data.image
  } catch (err) {
    image.value = null
  }
})
</script>

<style scoped>
#searchBar {
  position: absolute; /* 让子元素绝对定位基于此容器 */
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.6);
  max-width: 260px;
  padding: 8px;
  border-radius: 6px;
  font-family: sans-serif;
}

.search-results {
  position: absolute;
  top: 48px; /* 根据输入框高度微调 */
  left: 0;
  width: 100%;
  gap: 8px;
  align-items: center;
  z-index: 1001; /* 保证在输入框之上 */
}

.search-row {
  gap: 8px;
  align-items: center;
  margin-bottom: 4px;
}

.search-icon {
  font-size: 18px;
}

.search-input {
  width: 150px;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0);
  color: rgb(90, 117, 239);
}

.search-button {
  padding: 6px;
  background-color: rgba(101, 100, 100, 0.9);
  color: rgb(60, 62, 155);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.result-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 250px;
  overflow-y: auto;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
}

.result-item {
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.result-item:hover {
  background-color: #f0f0f0;
}

.result-show {
  position: absolute;
  align-self: flex-end; /* 向右对齐 */
  right:0;
  bottom: -30px; /* 调整位置 */
  color: rgb(60, 62, 155)
}

.info-panel {
  position: absolute;
  right: -570px;
  top: 100px;
  width: 260px;
  background-color: rgba(255, 255, 255, 0.6);
  border-left: 2px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  color: #333;
  z-index: 1001;
}

.info-image {
  max-width: 100%;
  border-radius: 4px;
  max-height: 300px;      /* 设置最大高度 */
}

.close-info {
  position: relative;
  margin-top: 4px;
  /*//padding: 3px 5px;*/
  right:0;
  background-color: rgb(255, 255, 255, 0.6);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
