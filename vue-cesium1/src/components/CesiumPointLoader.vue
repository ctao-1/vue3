<script setup>
import { onMounted, inject } from 'vue'
import axios from 'axios'
import * as Cesium from 'cesium'

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
        position: Cesium.Cartesian3.fromDegrees(point.longitude, point.latitude, point.elevation),
        point: new Cesium.PointGraphics({
          color: Cesium.Color.YELLOW,
          pixelSize: 10,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 1
        }),
        // label: new Cesium.LabelGraphics({
        //   text: point.place_name,
        //   font: '14px sans-serif',
        //   fillColor: Cesium.Color.WHITE,
        //   style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        //   outlineWidth: 2,
        //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        //   pixelOffset: new Cesium.Cartesian2(0, -12)
        // })
      })
      viewer.value.entities.add(entity)
    })
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