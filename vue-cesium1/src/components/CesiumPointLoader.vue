<script setup>
import { onMounted, inject } from 'vue'
import axios from 'axios'
import * as Cesium from 'cesium'
import emitter from '../eventBus'
// 注入 viewer 对象
const viewer = inject('viewer')

// 加载点标记函数
const loadPointEntities = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/places')
    const points = res.data // 数组：每个对象包含 place_name, longitude, latitude, elevation

    points.forEach(point => {
      const entity = new Cesium.Entity({
        name: point.place_name,
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.YELLOW,
          pixelSize: 5,
          outlineColor: Cesium.Color.BLACK,
          clampToGround: true
        }),
        label: new Cesium.LabelGraphics({
          text: point.place_name,
          font: '15px sans-serif',
          fillColor: Cesium.Color.WHITE,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 1,// 描边宽度
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(0, -12),
          distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0, 1000000 // 相机距离在0~1000km之间时显示
          )
        })
      })
      viewer.value.entities.add(entity)
      // 添加点击事件
      entity.description = '点击查看详情'
    })
    // 添加全局点击事件
    viewer.value.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
      const pickedObject = viewer.value.scene.pick(movement.position)
      if (Cesium.defined(pickedObject) && pickedObject.id && pickedObject.id.name) {
        // 找到对应点数据
        const clickedPoint = points.find(p => p.place_name === pickedObject.id.name)
        if (clickedPoint) {
          emitter.emit('show-place-detail', clickedPoint)
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)
  } catch (err) {
    console.error('加载点数据失败:', err)
  }
}

onMounted(() => {
  loadPointEntities()
})
</script>

<template>

</template>

<style scoped>

</style>