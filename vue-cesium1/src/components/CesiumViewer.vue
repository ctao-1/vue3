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

import { changzheng1Coordinates, changzheng2Coordinates }  from '../coordinates/changzhengGroute';

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

  // 天地图服务配置
  const token = 'aff67efbdd6b0daba90549b44b0d1c4d';
  // 服务域名
  const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
  // 服务负载子域
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

  // 抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true;
  viewer.scene.postProcessStages.fxaa.enabled = false;
  // 水雾特效
  viewer.scene.globe.showGroundAtmosphere = true;
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1.5;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1.5e7;
  // viewer.scene.screenSpaceCameraController.autoResetHeadingPitch = false;
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5;
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 50;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 20000000;
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    Cesium.CameraEventType.RIGHT_DRAG,
    Cesium.CameraEventType.WHEEL,
    Cesium.CameraEventType.PINCH,
  ];
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    Cesium.CameraEventType.MIDDLE_DRAG,
    Cesium.CameraEventType.PINCH,
    {
      eventType: Cesium.CameraEventType.LEFT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
    {
      eventType: Cesium.CameraEventType.RIGHT_DRAG,
      modifier: Cesium.KeyboardEventModifier.CTRL,
    },
  ];
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);

  // 叠加影像服务
  const imgMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 18
  });
  viewer.imageryLayers.addImageryProvider(imgMap);

  // 叠加国界服务
  const iboMap = new Cesium.UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new Cesium.WebMercatorTilingScheme(),
    maximumLevel: 10
  });
  viewer.imageryLayers.addImageryProvider(iboMap);

  // 叠加地形服务
  const terrainUrls = [];
  for (let i = 0; i < subdomains.length; i++) {
    const url = tdtUrl.replace('{s}', subdomains[i]) + 'mapservice/swdx?T=elv_c&tk=' + token;
    terrainUrls.push(url);
  }
  const provider = new Cesium.GeoTerrainProvider({
    urls: terrainUrls
  });
  viewer.terrainProvider = provider;

  // 将三维球定位到中国
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
    orientation: {
      heading: Cesium.Math.toRadians(348.4202942851978),
      pitch: Cesium.Math.toRadians(-89.74026687972041),
      roll: Cesium.Math.toRadians(0)
    },
    complete: function callback() {
      // 定位完成之后的回调函数
    }
  });

  // 叠加三维地名服务
  const wtfs = new Cesium.GeoWTFS({
    viewer,
    // 三维地名服务，使用 wtfs 服务
    subdomains: subdomains,
    metadata: {
      boundBox: {
        minX: -180,
        minY: -90,
        maxX: 180,
        maxY: 90
      },
      minLevel: 1,
      maxLevel: 20
    },
    depthTestOptimization: true,
    dTOElevation: 15000,
    dTOPitch: Cesium.Math.toRadians(-70),
    aotuCollide: true, // 是否开启避让
    collisionPadding: [5, 10, 8, 5], // 开启避让时，标注碰撞增加内边距，上、右、下、左
    serverFirstStyle: true, // 服务端样式优先
    labelGraphics: {
      font: "28px sans-serif",
      fontSize: 28,
      fillColor: Cesium.Color.WHITE,
      scale: 0.5,
      outlineColor: Cesium.Color.BLACK,
      outlineWidth: 2,
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      showBackground: false,
      backgroundColor: Cesium.Color.RED,
      backgroundPadding: new Cesium.Cartesian2(10, 10),
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      eyeOffset: Cesium.Cartesian3.ZERO,
      pixelOffset: new Cesium.Cartesian2(5, 5),
      disableDepthTestDistance: undefined
    },
    billboardGraphics: {
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.CENTER,
      eyeOffset: Cesium.Cartesian3.ZERO,
      pixelOffset: Cesium.Cartesian2.ZERO,
      alignedAxis: Cesium.Cartesian3.ZERO,
      color: Cesium.Color.WHITE,
      rotation: 0,
      scale: 1,
      width: 18,
      height: 18,
      disableDepthTestDistance: undefined
    }
  });

  // 三维地名服务，使用 wtfs 服务
  wtfs.getTileUrl = function () {
    return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&VERSION=1.0.0&tk=' + token;
  };

  // 三维图标服务
  wtfs.getIcoUrl = function () {
    return tdtUrl + 'mapservice/GetIcon?id={id}&tk=' + token;
  };

  wtfs.initTDT([
    { "x": 6, "y": 1, "level": 2, "boundBox": { "minX": 90, "minY": 0, "maxX": 135, "maxY": 45 } },
    { "x": 7, "y": 1, "level": 2, "boundBox": { "minX": 135, "minY": 0, "maxX": 180, "maxY": 45 } },
    { "x": 6, "y": 0, "level": 2, "boundBox": { "minX": 90, "minY": 45, "maxX": 135, "maxY": 90 } },
    { "x": 7, "y": 0, "level": 2, "boundBox": { "minX": 135, "minY": 45, "maxX": 180, "maxY": 90 } },
    { "x": 5, "y": 1, "level": 2, "boundBox": { "minX": 45, "minY": 0, "maxX": 90, "maxY": 45 } },
    { "x": 4, "y": 1, "level": 2, "boundBox": { "minX": 0, "minY": 0, "maxX": 45, "maxY": 45 } },
    { "x": 5, "y": 0, "level": 2, "boundBox": { "minX": 45, "minY": 45, "maxX": 90, "maxY": 90 } },
    { "x": 4, "y": 0, "level": 2, "boundBox": { "minX": 0, "minY": 45, "maxX": 45, "maxY": 90 } },
    { "x": 6, "y": 2, "level": 2, "boundBox": { "minX": 90, "minY": -45, "maxX": 135, "maxY": 0 } },
    { "x": 6, "y": 3, "level": 2, "boundBox": { "minX": 90, "minY": -90, "maxX": 135, "maxY": -45 } },
    { "x": 7, "y": 2, "level": 2, "boundBox": { "minX": 135, "minY": -45, "maxX": 180, "maxY": 0 } },
    { "x": 5, "y": 2, "level": 2, "boundBox": { "minX": 45, "minY": -45, "maxX": 90, "maxY": 0 } },
    { "x": 4, "y": 2, "level": 2, "boundBox": { "minX": 0, "minY": -45, "maxX": 45, "maxY": 0 } },
    { "x": 3, "y": 1, "level": 2, "boundBox": { "minX": -45, "minY": 0, "maxX": 0, "maxY": 45 } },
    { "x": 3, "y": 0, "level": 2, "boundBox": { "minX": -45, "minY": 45, "maxX": 0, "maxY": 90 } },
    { "x": 2, "y": 0, "level": 2, "boundBox": { "minX": -90, "minY": 45, "maxX": -45, "maxY": 90 } },
    { "x": 0, "y": 1, "level": 2, "boundBox": { "minX": -180, "minY": 0, "maxX": -135, "maxY": 45 } },
    { "x": 1, "y": 0, "level": 2, "boundBox": { "minX": -135, "minY": 45, "maxX": -90, "maxY": 90 } },
    { "x": 0, "y": 0, "level": 2, "boundBox": { "minX": -180, "minY": 45, "maxX": -135, "maxY": 90 } }
  ]);
});


</script>


<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>