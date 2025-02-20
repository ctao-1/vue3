<template>
  <div id="cesiumContainer"></div>
</template>

<script lang="ts" setup>
import {Viewer} from 'cesium';
import { onMounted } from 'vue'
 
//引入cesium的css文件
import '/public/static/CesiumAssets/Widgets/widgets.css'
import * as Cesium from "cesium";


//vue生命周期钩子函数
onMounted(() => {
    //设置cesium的静态资源地址
    (window as any).CESIUM_BASE_URL = 'static/cesiumAssets'
 
    //创建cesium的viewer对象
    const viewer = new Viewer('cesiumContainer');
 
    //设置相机的初始位置
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(116.3974, 39.9093, 10000000)
    })
})


</script>



<style lang="scss" scoped>
#cesiumContainer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>