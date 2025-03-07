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

// 这里是获取到的红1长征路线经纬度坐标数组
const changzheng1Coordinates = [
  // 这里需要替换为实际的长征路线坐标数据
  [116.026667, 25.885556], // 江西瑞金（起点）
  [111.600000, 25.533333],//湖南道县（突破第四道封锁线）
  [106.918056, 27.698611],//贵州遵义（遵义会议）
  [105.700000, 28.590000],//赤水河（四渡赤水区域示例点）
  [102.833333, 26.183333],//云南禄劝县皎平渡（巧渡金沙江）
  [102.500000, 29.466667],//四川安顺场（强渡大渡河）
  [102.232778, 29.914722],//四川泸定桥（飞夺泸定桥）
  [102.916667, 30.983333],//四川夹金山（翻越雪山）
  [103.500000, 32.500000],//四川毛尔盖（过草地前集结）
  [103.800000, 34.100000],//甘肃腊子口（突破天险）
  [108.175000, 36.927500]  // 陕西吴起镇（会师终点）
];

// 这里是获取到的红2长征路线经纬度坐标数组
const changzheng2Coordinates = [
  // 这里需要替换为实际的长征路线坐标数据
  [109.644167, 29.399722], // 湖南桑植县（起点）
  [109.850000, 28.999722],//湖南永顺县
  [109.443056, 29.457500],//湖南龙山县
  [109.138056, 29.680833],//湖北咸丰县
  [108.228333, 27.517222],//贵州石阡县
  [107.471111, 27.068889],//贵州瓮安县
  [106.591667, 26.838889],//贵州修文县
  [104.644167, 25.709444],//贵州盘县（今盘州市）
  [104.105556, 26.227222],//云南宣威市
  [103.258333, 25.558889],//云南寻甸县
  [99.773333, 26.901667],//云南丽江市石鼓镇
  [99.800000, 28.933333],//四川乡城县
  [100.269722, 29.991944],//四川理塘县
  [99.991667, 31.623333],//四川甘孜县
  [101.700833, 32.902222],//四川阿坝县
  [104.032500, 34.438056],//甘肃岷县
  [105.073056, 35.692500],//云南宣威市
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
        destination: Cesium.Cartesian3.fromDegrees(106.918056, 27.698611, 2000000)
    });
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
    })
  });

  const changzhengEntity2 = new Entity({
    polyline: new PolylineGraphics({
      positions: cartesian3Positions2,
      width: 5,
      material: Color.BLUE
    })
  });

  // 将路线实体添加到Viewer中
  viewer.entities.add(changzhengEntity1);
  viewer.entities.add(changzhengEntity2);
})


</script>



<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>