<template>

    <div id="cesiumContainer">
      <button @click="toggleRouteVisibility">{{ routeVisible ? '关闭路线' : '显示路线' }}</button>
    </div>

</template>

<script lang="ts" setup>
// import {Viewer} from 'cesium';
import { Viewer, Entity, PolylineGraphics, Cartesian3, Color, PointGraphics } from 'cesium';
import { onMounted,ref } from 'vue'
 
//引入cesium的css文件
import '/public/static/CesiumAssets/Widgets/widgets.css'
import * as Cesium from "cesium";

import { changzheng1Coordinates, changzheng2Coordinates }  from '../coordinates/changzhengGroute.ts';

// 用于跟踪路线的显示状态
const routeVisible = ref(true);

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

// 点击事件处理函数
const toggleRouteVisibility = () => {
  routeVisible.value = !routeVisible.value;
  for (let i = 0; i < changzhengEntities.value.length; i++) {
    changzhengEntities.value[i].show = routeVisible.value;
  }
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

//vue生命周期钩子函数
onMounted(() => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1MThkNmVjMi1kZjU3LTRiYjUtOGM2ZC0wYjk2YzFlNTE5YzUiLCJpZCI6MjcwODk5LCJpYXQiOjE3Mzc2MDc1NDh9.Wpl35AaD3rKSqskH_gRtGNnAYDnaAy9C3vZsU8jkTHw';
    //设置cesium的静态资源地址
    (window as any).CESIUM_BASE_URL = 'static/cesiumAssets'
 
    //创建cesium的viewer对象
    const viewer = new Viewer('cesiumContainer',{
      baseLayerPicker: true,
      timeline: true,// 必须为true显示时间线组件（如不想显示可以使用样式层叠表修改display：none） 否则viewer.timeline.zoomTo会报undefined错误
      homeButton: false,
      fullscreenButton: false,
      infoBox: false,
      sceneModePicker: false,
      navigationInstructionsInitiallyVisible: false,
      navigationHelpButton: false,
      animation: false,
      shouldAnimate: true
    });
 
    //设置相机的初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(106.918056, 27.698611, 5000000)
    });


  // 将路线实体添加到Viewer中
  changzhengEntities.value.forEach(entity => {
    viewer.entities.add(entity);
  });


  // 将点标记添加到Viewer中
  viewer.entities.add(ruijinPoint);
  viewer.entities.add(wuqizhenPoint);
  viewer.entities.add(zunyiPoint);
})


</script>


<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>