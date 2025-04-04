import { Viewer, UrlTemplateImageryProvider, WebMercatorTilingScheme, Cartesian3, Math as CesiumMath, CameraEventType, KeyboardEventModifier } from 'cesium';

export function tiandituEffect(viewer: Viewer) {
  // 天地图服务配置
  const token = 'aff67efbdd6b0daba90549b44b0d1c4d';
  const tdtUrl = 'https://t{s}.tianditu.gov.cn/';
  const subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

  // 抗锯齿
  viewer.scene.postProcessStages.fxaa.enabled = true;
  viewer.scene.postProcessStages.fxaa.enabled = false;

  // 水雾特效
  viewer.scene.globe.showGroundAtmosphere = true;

  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  viewer.scene.screenSpaceCameraController.minimumZoomDistance = 1.5;
  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 1.5e7;
  viewer.scene.screenSpaceCameraController.inertiaZoom = 0.5;
  viewer.scene.screenSpaceCameraController.zoomEventTypes = [
    CameraEventType.RIGHT_DRAG,
    CameraEventType.WHEEL,
    CameraEventType.PINCH,
  ];
  viewer.scene.screenSpaceCameraController.tiltEventTypes = [
    CameraEventType.MIDDLE_DRAG,
    CameraEventType.PINCH,
    {
      eventType: CameraEventType.LEFT_DRAG,
      modifier: KeyboardEventModifier.CTRL,
    },
    {
      eventType: CameraEventType.RIGHT_DRAG,
      modifier: KeyboardEventModifier.CTRL,
    },
  ];

  // 叠加影像服务
  // const imgMap = new UrlTemplateImageryProvider({
  //   url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
  //   subdomains: subdomains,
  //   tilingScheme: new WebMercatorTilingScheme(),
  //   maximumLevel: 18,
  // });
  // viewer.imageryLayers.addImageryProvider(imgMap);

  // 叠加国界服务
  const iboMap = new UrlTemplateImageryProvider({
    url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
    subdomains: subdomains,
    tilingScheme: new WebMercatorTilingScheme(),
    maximumLevel: 10,
  });
  viewer.imageryLayers.addImageryProvider(iboMap);

  // 将三维球定位到中国altitude=17850000
  viewer.camera.flyTo({
    destination: Cartesian3.fromDegrees(103.84, 31.15, 10000000),
    orientation: {
      heading: CesiumMath.toRadians(348.4202942851978),
      pitch: CesiumMath.toRadians(-89.74026687972041),
      roll: CesiumMath.toRadians(0),
    },
    complete: function callback() {
      // 定位完成之后的回调函数
    },
  });
}