<template>
  <div id="cesiumContainer"></div>
</template>

<script lang="ts" setup>
// import {Viewer} from 'cesium';
import { Viewer, Entity, PolylineGraphics, Cartesian3, Color } from 'cesium';
import { onMounted } from 'vue'
 
//引入cesium的css文件
import '/public/static/CesiumAssets/Widgets/widgets.css'
import * as Cesium from "cesium";

// 假设这里是获取到的长江干流线经纬度坐标数组
const yangtzeRiverCoordinates = [
  // 这里需要替换为实际的长江坐标数据
  [91.07, 34.17], // 大致源头区域
  [101.73, 31.17],
  [104.57, 30.05],
  [108.93, 29.53],
  [111.53, 29.65],
  [114.25, 29.87],
  [115.93, 30.45],
  [121.47, 31.23]  // 大致入海口区域
];

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
        destination: Cesium.Cartesian3.fromDegrees(116.3974, 39.9093, 10000000)
    });
  // 将经纬度数组转换为Cartesian3数组
  const cartesian3Positions = yangtzeRiverCoordinates.map((coord) => {
    return Cartesian3.fromDegrees(coord[0], coord[1]);
  });

  // 创建路线实体
  const yangtzeRiverEntity = new Entity({
    polyline: new PolylineGraphics({
      positions: cartesian3Positions,
      width: 5,
      material: Color.BLUE
    })
  });

  // 将路线实体添加到Viewer中
  viewer.entities.add(yangtzeRiverEntity);
})


</script>



<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>