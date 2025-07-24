<template>
  <div>
  <div id="cesiumContainer" ref="cesiumContainerRef">
    <MapSearchBar /><CesiumPointLoader /><LayerDropdown /><switch3D />
    <!-- <button id="toggleRouteButton" @click="toggleRouteVisibility">{{ routeVisible ? '关闭路线' : '显示路线' }}</button> -->
    <!-- 复选框  -->
    <div id="routeDropdown">
      <select id="routeSelect" v-model="selectedRoutes">
        <option disabled value="">请选择路线</option>
        <option type="checkbox" value="changzheng1">中央红军（红一方面军）</option>
        <option type="checkbox" value="changzheng2">红二方面军长征路线</option>
      </select>
      <button @click="loadRoutes">加载</button>
      <button @click="Animation?startAnimation():stopAnimation()">
        <span v-if="Animation">漫游</span>
        <span v-else>结束</span>
      </button>
    </div>
  </div>
    <div id="mouse-info">
      坐标：{{ cartesianStr }}<br />
      高程：{{ elevationStr }}m
    </div>
  </div>
</template>

<style lang="scss" scoped>

</style>

<script lang="ts" setup>
import {Viewer} from 'cesium';
import { Entity, PolylineGraphics,  Cartesian3, Color,  SampledPositionProperty, JulianDate, ScreenSpaceEventHandler, ScreenSpaceEventType, PolylineGlowMaterialProperty, Cartographic, Math as CesiumMath } from 'cesium';
import { onMounted, ref, provide } from 'vue'

//引入cesium的css文件
import '/public/static/CesiumAssets/Widgets/widgets.css'
import * as Cesium from "cesium";
import '../style.css'
import MapSearchBar from './MapSearchBar.vue';
import CesiumPointLoader from './CesiumPointLoader.vue'
import LayerDropdown from './LayerDropdown.vue'
import switch3D from './switch3D.vue';

import { changzheng1Coordinates, changzheng2Coordinates }  from '../coordinates/changzhengGroute';
import { tiandituEffect } from '../tianditu/tiandituEffect';

//the actual Viewer instance is stored in viewer.value
const viewer = ref<Viewer | null>(null);
provide('viewer', viewer)          // ⬅️ 提前注入这个 ref（响应式），提供对象给子组件
const cesiumContainerRef = ref<HTMLDivElement | null>(null);
// 用于显示鼠标位置的经纬度和高程
const cartesianStr = ref('无')
const elevationStr = ref('无')
// 用于跟踪路线的显示状态
const routeVisible = ref(true);
const Animation = ref(true); // 控制动画的开关
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
    width: 6,
    material: new PolylineGlowMaterialProperty({  // 发光效果
      glowPower: 0.2,
      color: Color.RED
    }),
    arcType: Cesium.ArcType.RHUMB,  // 恒向线（沿罗盘方向）
    depthFailMaterial: Color.RED.withAlpha(0.5),  // 被遮挡时的半透明显示
    clampToGround: true
  }),
  show: routeVisible.value // 初始显示状态
});

const changzhengEntity2 = new Entity({
  polyline: new PolylineGraphics({
    positions: cartesian3Positions2,
    width: 6,
    material: new PolylineGlowMaterialProperty({  // 发光效果
      glowPower: 0.2,
      color: Color.BLUE
    }),
    arcType: Cesium.ArcType.RHUMB,  // 恒向线（沿罗盘方向）
    depthFailMaterial: Color.BLUE.withAlpha(0.5),  // 被遮挡时的半透明显示
    clampToGround: true //路线贴地
  }),
  show: routeVisible.value // 初始显示状态
});
// 存储路线实体的数组
const changzhengEntities = ref<Entity[]>([])
// 将路线实体添加到数组中
changzhengEntities.value = [changzhengEntity1, changzhengEntity2];
const selectedRoutes = ref(''); // 用于存储选中的单选框值 复选：<string[]>([])
let soldierEntity: Entity;// 全局 soldierEntity 变量

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

//匀速添加 Sample
function addUniformSpeedSamples(positions: Cartesian3[], startTime: JulianDate, duration: number, positionProperty: Cesium.SampledPositionProperty) {
  if (positions.length < 2) return

  const distances: number[] = []
  let totalDistance = 0

  // 计算各段距离
  for (let i = 1; i < positions.length; i++) {
    const d = Cartesian3.distance(positions[i - 1], positions[i])
    distances.push(d)
    totalDistance += d
  }

  let elapsedTime = 0
  positionProperty.addSample(startTime, positions[0]) // 起点样本

  for (let i = 1; i < positions.length; i++) {
    const segmentDuration = (distances[i - 1] / totalDistance) * duration
    elapsedTime += segmentDuration
    const time = JulianDate.addSeconds(startTime, elapsedTime, new JulianDate())
    positionProperty.addSample(time, positions[i])
  }
}

// 2. getGroundPositions 使用全局 terrainProvider
async function getGroundPositions(coords: number[][]) {
  const cartographics = coords.map(coord => Cartographic.fromDegrees(coord[0], coord[1]));
  // if (!terrainProvider) return [];
  const terrainProvider = await Cesium.createWorldTerrainAsync();
  const sampled = await Cesium.sampleTerrainMostDetailed(terrainProvider, cartographics);
  return sampled.map(cg => Cartesian3.fromRadians(cg.longitude, cg.latitude, cg.height));
}

// 动画按钮点击事件
const startAnimation = async() => {
  if (!viewer.value) return;
  if (selectedRoutes.value.length > 0) {
    const startTime = JulianDate.now();
    const totalDuration = 14400; // 总动画时间（秒）
    const stopTime = JulianDate.addSeconds(startTime, totalDuration, new JulianDate());

    const clock = viewer.value.clock
    clock.startTime = startTime.clone();
    clock.stopTime = stopTime.clone();
    clock.currentTime = startTime.clone();
    clock.clockRange = Cesium.ClockRange.CLAMPED;
    clock.multiplier = 1; // 动画流速
    clock.shouldAnimate = true;

    // 重新生成空的 SampledPositionProperty
    soldierEntity.position = new Cesium.SampledPositionProperty();
    const positionProperty = soldierEntity.position as Cesium.SampledPositionProperty;

    if (selectedRoutes.value.includes('changzheng1')) {
      const groundPositions = await getGroundPositions(changzheng1Coordinates);
      addUniformSpeedSamples(groundPositions, startTime, totalDuration, positionProperty);
    }
    if (selectedRoutes.value.includes('changzheng2')) {
      const groundPositions = await getGroundPositions(changzheng2Coordinates);
      addUniformSpeedSamples(groundPositions, startTime, totalDuration, positionProperty);
    }
    // 将小人实体设置为跟踪目标
    viewer.value.trackedEntity = soldierEntity;
    Animation.value = false; // 切换动画状态
  }
}

const stopAnimation = () => {
  if (!viewer.value) return;
  // 隐藏动画控件
  // const animationWidget = viewer.value.animation?.container;
  // if (animationWidget) (animationWidget as HTMLElement).style.display = 'none';
  viewer.value.clock.shouldAnimate = false;// 停止动画
  viewer.value.trackedEntity = undefined;// 取消跟踪实体

  // 重新生成空的 SampledPositionProperty
    soldierEntity.position = new Cesium.SampledPositionProperty();
  // 移除动画小人图标实体
  if (soldierEntity && viewer.value.entities.contains(soldierEntity)) {
    viewer.value.entities.remove(soldierEntity);
  }
  Animation.value = true; // 切换动画状态
};

//vue生命周期钩子函数
onMounted(async () => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MThkNmVjMi1kZjU3LTRiYjUtOGM2ZC0wYjk2YzFlNTE5YzUiLCJpZCI6MjcwODk5LCJpYXQiOjE3Mzc2MDc1NDh9.Wpl35AaD3rKSqskH_gRtGNnAYDnaAy9C3vZsU8jkTHw';
  (window as any).CESIUM_BASE_URL = '/public/static/cesiumAssets'//设置cesium的静态资源地址

  //创建cesium的viewer对象
  viewer.value = new Viewer(cesiumContainerRef.value as HTMLDivElement,{
    terrain: Cesium.Terrain.fromWorldTerrain(),//全球地形数据
    //内置的 UI 控件
    baseLayerPicker: false,
    geocoder: false, // 启用搜索框（默认true）
    timeline: false,// 必须为true显示时间线组件（如不想显示可以使用样式层叠表修改display：none） 否则viewer.timeline.zoomTo会报undefined错误
    homeButton: false,
    fullscreenButton: true,
    fullscreenElement: document.getElementById('cesiumContainer') || undefined, // 指定全屏目标
    infoBox: false,
    sceneModePicker: false,
    navigationInstructionsInitiallyVisible: false,
    navigationHelpButton: false,
    animation: true,// 默认不显示动画控件
    shouldAnimate: true
  });

  // 将路线实体添加到Viewer中
  changzhengEntities.value.forEach(entity => {
    (viewer.value as Viewer).entities.add(entity);
  });

  // 3. soldierEntity billboard 增加 heightReference
  soldierEntity = new Entity({
    position: new SampledPositionProperty(),
    billboard: {
      image: '/static/images/红军.png',
      width: 60,
      height: 60,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
    },
  });

  // 添加红军战士小人图标实体
  viewer.value.entities.add(soldierEntity);
  viewer.value.clock.shouldAnimate = false; // 暂停动画
  viewer.value.clock.shouldAnimate = true;  // 恢复动画

  // 调用封装的函数
  if (viewer.value) {
    tiandituEffect(viewer.value)
  }

  const handler = new ScreenSpaceEventHandler(viewer.value.scene.canvas)

  handler.setInputAction((movement: ScreenSpaceEventHandler.MotionEvent) => {
    if (!viewer.value) {
      cartesianStr.value = '无'
      elevationStr.value = '无'
      return
    }
    const ray = viewer.value.camera.getPickRay(movement.endPosition)
    let cartesian = null;
    if (ray) {
      cartesian = viewer.value.scene.globe.pick(ray, viewer.value.scene)
    }

    if (cartesian) {
      const cartographic = Cartographic.fromCartesian(cartesian)
      const lon = CesiumMath.toDegrees(cartographic.longitude).toFixed(6)
      const lat = CesiumMath.toDegrees(cartographic.latitude).toFixed(6)
      const height = (cartographic.height || 0).toFixed(2)

      cartesianStr.value = `${lon}, ${lat}`
      elevationStr.value = `${height}`
    } else {
      cartesianStr.value = '无'
      elevationStr.value = '无'
    }
  }, ScreenSpaceEventType.MOUSE_MOVE)
  // 将viewer对象暴露出去 供其他方法使用
   //return { viewer };
});
</script>