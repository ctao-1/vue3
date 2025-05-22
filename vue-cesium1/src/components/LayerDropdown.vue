<script setup lang="ts">
import { ref, inject, Ref } from 'vue'
import '../style.css'
import {ImageryLayer, UrlTemplateImageryProvider, Viewer, WebMercatorTilingScheme} from "cesium";

const viewer = inject<Ref<Viewer | undefined>>('viewer')
const selectLayers = ref<string[]>([]);
const tk = 'aff67efbdd6b0daba90549b44b0d1c4d'
// 天地图图层配置
const tdtLayers = [
  {
    url: `http://t{s}.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${tk}`,
    name: '天地图矢量地图'
  },
  {
    url: `http://t{s}.tianditu.gov.cn/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tk}`,
    name: '天地图矢量注记'
  },
  {
    url: `http://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tk}`,
    name: '天地图影像底图'
  },
  {
    url: `http://t{s}.tianditu.gov.cn/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=${tk}`,
    name: '天地图影像注记'
  },
  {
    url: `http://t{s}.tianditu.gov.cn/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=${tk}`,
    name: '天地图地形晕渲'
  },
  {
    url: `http://t{s}.tianditu.gov.cn/DataServer?T=cta_w&x={x}&y={y}&l={z}&tk=${tk}`,
    name: '天地图地形注记'
  }
];

const currentLayerIndex = ref(-1);
const currentLayer = ref<ImageryLayer | null>(null);

const dropdownVisible = ref(false); // 控制下拉菜单的显示状态
const isMouseLeaved = ref(true); // 控制 handleMouseLeave 是否生效
const istoggleDropdown = ref(true);//控制toggleDropdown函数是否生效
// 鼠标移入时显示下拉菜单
const handleMouseEnter = () => {
  if (!dropdownVisible.value) {
    dropdownVisible.value = true;
  }
};
// 鼠标移出时隐藏下拉菜单（如果未点击按钮）
const handleMouseLeave = () => {
  if (dropdownVisible.value && isMouseLeaved.value) {
    dropdownVisible.value = false;
  }
};
// 点击按钮切换下拉菜单显示状态
const toggleDropdown = () => {
  if(istoggleDropdown.value){
    isMouseLeaved.value = !isMouseLeaved.value; // 禁用 handleMouseEnter
    dropdownVisible.value = true;
    istoggleDropdown.value = false;
  }else{
    isMouseLeaved.value = !isMouseLeaved.value; // 禁用 handleMouseEnter
    dropdownVisible.value = !dropdownVisible.value;
    istoggleDropdown.value = true;
  }
};

// 切换图层函数
const changeLayer = (event: Event) => {
  const selectedIndex = parseInt((event.target as HTMLSelectElement).value);

  if (currentLayer.value && viewer && viewer.value) {
    viewer.value.imageryLayers.remove(currentLayer.value);
  }

  const layerConfig = tdtLayers[selectedIndex];
  const layer = new UrlTemplateImageryProvider({
    url: layerConfig.url,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    tilingScheme: new WebMercatorTilingScheme()
  });

  if (viewer && viewer.value) {
    currentLayer.value = viewer.value.imageryLayers.addImageryProvider(layer);
  }

  currentLayerIndex.value = selectedIndex;
};
</script>

<template>
  <div id="layerDropdown" @mouseleave="handleMouseLeave">
    <!-- 圆形按钮 -->
    <button id="layerButton" @click="toggleDropdown" @mouseenter="handleMouseEnter">
      <img src="https://cdn-icons-png.flaticon.com/512/854/854878.png" alt="地图图标" />
    </button>
    <!-- 下拉菜单 -->
    <select id="layerSelect" v-show="dropdownVisible" v-model="selectLayers" @change="changeLayer" size="6">
      <option v-for="(layer, index) in tdtLayers" :key="index" :value="index">
        {{ layer.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>

</style>