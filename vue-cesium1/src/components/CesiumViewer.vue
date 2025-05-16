<template>
  <div>
  <MapSearchBar />
  <div id="cesiumContainer">
    <!-- <button id="toggleRouteButton" @click="toggleRouteVisibility">{{ routeVisible ? '关闭路线' : '显示路线' }}</button> -->
    <!-- 复选框  -->
    <div id="routeDropdown">
      <label for="routeSelect">选择路线：</label>
      <select id="routeSelect" v-model="selectedRoutes">
        <option type="checkbox" value="changzheng1">中央红军（红一方面军）长征路线</option>
        <option type="checkbox" value="changzheng2">红二方面军长征路线</option>
      </select>
      <button @click="loadRoutes">加载</button>
      <button @click="startAnimation">动画</button>
    </div>
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
  </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts" setup>
import {Viewer} from 'cesium';
import { Entity, PolylineGraphics, Cartesian3, Color, PointGraphics, UrlTemplateImageryProvider, WebMercatorTilingScheme, SampledPositionProperty, JulianDate } from 'cesium';
import { onMounted, ref, provide } from 'vue'
import { ImageryLayer } from 'cesium';

//引入cesium的css文件
import '/public/static/CesiumAssets/Widgets/widgets.css'
import * as Cesium from "cesium";
import '../style.css'
import MapSearchBar from './MapSearchBar.vue'

import { changzheng1Coordinates, changzheng2Coordinates }  from '../coordinates/changzhengGroute';
import { tiandituEffect } from '../tianditu/tiandituEffect';

//the actual Viewer instance is stored in viewer.value
const viewer = ref<Viewer | null>(null);
provide('viewer', viewer)          // ⬅️ 提前注入这个 ref（响应式）

// 用于跟踪路线的显示状态
const routeVisible = ref(true);
// const layerVisible = ref(true);
// 将经纬度数组转换为Cartesian3数组
const cartesian3Positions1 = changzheng1Coordinates.map((coord) => {
  return Cartesian3.fromDegrees(coord[0], coord[1]);
});
const cartesian3Positions2 = changzheng2Coordinates.map((coord) => {
  return Cartesian3.fromDegrees(coord[0], coord[1]);
});

// 创建路线实体
const changzhengEntity1 = new Entity({
  polyline: new PolylineGraphics({
    positions: cartesian3Positions1,
    width: 5,
    material: Color.RED
  }),
  show: routeVisible.value // 初始显示状态
});

const changzhengEntity2 = new Entity({
  polyline: new PolylineGraphics({
    positions: cartesian3Positions2,
    width: 5,
    material: Color.BLUE
  }),
  show: routeVisible.value // 初始显示状态
});
// 存储路线实体的数组
const changzhengEntities = ref<Entity[]>([])
// 将路线实体添加到数组中
changzhengEntities.value = [changzhengEntity1, changzhengEntity2];

const selectedRoutes = ref<string[]>([]); // 用于存储选中的复选框值
//加载所选路线方法
const loadRoutes = () => {
  // 清除之前的路线显示
  for (let i = 0; i < changzhengEntities.value.length; i++) {
    changzhengEntities.value[i].show = false; // 隐藏之前的路线
  }
  // 根据选中的复选框加载对应的路线
  if (selectedRoutes.value.includes('changzheng1')) {
    changzhengEntities.value[0].show = true; // 显示红一方面军长征路线
  }
  if (selectedRoutes.value.includes('changzheng2')) {
    changzhengEntities.value[1].show = true; // 显示红二方面军长征路线
  }
};

// 创建红军战士小人图标实体
const soldierEntity = new Entity({
  position: new SampledPositionProperty(),
  billboard: {
    image: 'https://cdn-icons-png.flaticon.com/512/854/854878.png', // 替换为红军战士小人图标的 URL
    width: 32,
    height: 32,
  },
});
// 动画按钮点击事件
const startAnimation = () => {
  if (!viewer.value) return;

  const startTime = JulianDate.now();
  const stopTime = JulianDate.addSeconds(startTime, 120, new JulianDate()); // 动画持续 60 秒

  // 设置时间范围
  viewer.value.clock.startTime = startTime.clone();
  viewer.value.clock.stopTime = stopTime.clone();
  viewer.value.clock.currentTime = startTime.clone();
  viewer.value.clock.clockRange = Cesium.ClockRange.CLAMPED; // 限制时间范围
  viewer.value.clock.multiplier = 1; // 时间流速

  // 创建 SampledPositionProperty 并添加位置
  const positionProperty = soldierEntity.position as SampledPositionProperty;
  const totalPoints = cartesian3Positions1.length;
  cartesian3Positions1.forEach((position, index) => {
    const time = JulianDate.addSeconds(startTime, (index / totalPoints) * 120, new JulianDate());
    positionProperty.addSample(time, position);
  });

  // 将小人实体设置为跟踪目标
  viewer.value.trackedEntity = soldierEntity;
};

// 江西瑞金的经纬度
const ruijinCoord = [116.026667, 25.885556];
// 陕西吴起镇的经纬度
const wuqizhenCoord = [108.175000, 36.927500];
const zunyiCoord = [106.918056, 27.698611];

// 创建江西瑞金的点标记
const ruijinPoint = new Entity({
  position: Cartesian3.fromDegrees(ruijinCoord[0], ruijinCoord[1]),
  point: new PointGraphics({
    color: Color.YELLOW,
    pixelSize: 10
  })
});

// 创建陕西吴起镇的点标记
const wuqizhenPoint = new Entity({
  position: Cartesian3.fromDegrees(wuqizhenCoord[0], wuqizhenCoord[1]),
  point: new PointGraphics({
    color: Color.YELLOW,
    pixelSize: 10
  })
});

// 创建遵义的点标记
const zunyiPoint = new Entity({
  position: Cartesian3.fromDegrees(zunyiCoord[0], zunyiCoord[1]),
  point: new PointGraphics({
    color: Color.YELLOW,
    pixelSize: 10
  })
});

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

  if (currentLayer.value && viewer.value) {
    viewer.value.imageryLayers.remove(currentLayer.value);
  }

  const layerConfig = tdtLayers[selectedIndex];
  const layer = new UrlTemplateImageryProvider({
    url: layerConfig.url,
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    tilingScheme: new WebMercatorTilingScheme()
  });

  if (viewer.value) {
    currentLayer.value = viewer.value.imageryLayers.addImageryProvider(layer);
  }

  currentLayerIndex.value = selectedIndex;
};

// const searchQuery = ref('');// 搜索框绑定的输入内容
// // 搜索按钮点击事件
// const performSearch = () => {
//   // 在这里实现搜索某个地点，利用相似搜索原理，在数据库中查询place_name字段获取该地点，将查询到的结果加载到搜索框下方，点击其中一个查询结果，定位到该地点
// };

//vue生命周期钩子函数
onMounted(() => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MThkNmVjMi1kZjU3LTRiYjUtOGM2ZC0wYjk2YzFlNTE5YzUiLCJpZCI6MjcwODk5LCJpYXQiOjE3Mzc2MDc1NDh9.Wpl35AaD3rKSqskH_gRtGNnAYDnaAy9C3vZsU8jkTHw';
  (window as any).CESIUM_BASE_URL = '/public/static/cesiumAssets'//设置cesium的静态资源地址

  //创建cesium的viewer对象
  viewer.value = new Viewer('cesiumContainer',{
      terrain: Cesium.Terrain.fromWorldTerrain(),
      baseLayerPicker: true,
      timeline: false,// 必须为true显示时间线组件（如不想显示可以使用样式层叠表修改display：none） 否则viewer.timeline.zoomTo会报undefined错误
      homeButton: false,
      fullscreenButton: true,
      infoBox: false,
      sceneModePicker: false,
      navigationInstructionsInitiallyVisible: false,
      navigationHelpButton: false,
      animation: true,
      shouldAnimate: true
    });

  // 将路线实体添加到Viewer中
  changzhengEntities.value.forEach(entity => {
    (viewer.value as Viewer).entities.add(entity);
  });

  // 添加红军战士小人图标实体
  viewer.value.entities.add(soldierEntity);
  viewer.value.clock.shouldAnimate = false; // 暂停动画
  viewer.value.clock.shouldAnimate = true;  // 恢复动画

  // Add point markers to the Viewer
  (viewer.value as Viewer).entities.add(ruijinPoint);
  (viewer.value as Viewer).entities.add(wuqizhenPoint);
  (viewer.value as Viewer).entities.add(zunyiPoint);

  // 调用封装的函数
  if (viewer.value) {
    tiandituEffect(viewer.value)
  }
  // 将viewer对象暴露出去 供其他方法使用
   //return { viewer };
});
</script>