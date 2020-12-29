<template>
  <viewport-cube
    :quaternion="quaternion"
    @viewport-camera-update="updateCameraPosition"
  />
  <tool-selector @selected-tool="setSelectedTool" />
  <Canvas :selectedTool="tool" />
</template>

<script>
import * as THREE from "three";
//import { TransformControls } from "three";
//import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import CameraControls from "camera-controls";
CameraControls.install({ THREE: THREE });

import Canvas from "./components/Canvas.vue";
import ToolSelector from "./components/ToolSelector.vue";
import ViewportCube from "./components/ViewportCube.vue";

//import Modal from "./components/Modal.vue";
//import Toast from "./components/Toast.vue";
//import LineSettings from "./components/LineSettings.vue";
//import Old from "./components/Old.vue";

export let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: false,
});
export let camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0,
  20
);
export let scene, cameraControls, clock;

var main, drawingCanvas;
//context

export default {
  name: "App",
  components: {
    // Modal,
    // Toast,
    // ToolSelector,
    Canvas,
    // LineSettings,
    ToolSelector,
    ViewportCube,
  },
  data() {
    return {
      tool: "draw",
      quaternion: undefined,
    };
  },
  methods: {
    init: function () {
      CameraControls.install({ THREE: THREE });
      drawingCanvas = document.getElementById("twod");
      //context = drawingCanvas.getContext("2d");
      main = document.getElementById("threed");

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      main.appendChild(renderer.domElement);
      renderer.domElement.id = "threeJsCanvas";

      scene = new THREE.Scene();
      //Set the background based on the css variable;
      var bgCol = 0xffffff;
      scene.background = new THREE.Color(bgCol);
      // scene.fog = new THREE.Fog(bgCol, 9, 13);

      var axesHelper = new THREE.AxesHelper();
      axesHelper.applyMatrix4(new THREE.Matrix4().makeScale(5, 5, 5));
      axesHelper.layers.set(0);
      axesHelper.material.fog = false;
      scene.add(axesHelper);

      var axesHelperFlipped = new THREE.AxesHelper();
      axesHelperFlipped.applyMatrix4(new THREE.Matrix4().makeScale(-5, -5, -5));
      axesHelperFlipped.layers.set(0);
      axesHelperFlipped.material.fog = false;
      scene.add(axesHelperFlipped);

      var size = 1;
      var divisions = 1;
      var gridHelper = new THREE.GridHelper(size, divisions);
      gridHelper.applyMatrix4(new THREE.Matrix4().makeScale(5, 5, 5));
      gridHelper.layers.set(0);
      gridHelper.material.fog = false;
      scene.add(gridHelper);

      camera.layers.enable(0); // enabled by default
      camera.layers.enable(1);
      camera.zoom = 160;
      camera.position.set(0, 0, 10);

      clock = new THREE.Clock();

      cameraControls = new CameraControls(camera, drawingCanvas);
      cameraControls.dampingFactor = 10;
      cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
      cameraControls.mouseButtons.wheel = CameraControls.ACTION.ROTATE;
      cameraControls.mouseButtons.right = CameraControls.ACTION.ZOOM;
      cameraControls.touches.one = CameraControls.ACTION.NONE;
      cameraControls.touches.two = CameraControls.ACTION.TOUCH_ROTATE;
      cameraControls.touches.three = CameraControls.ACTION.TOUCH_DOLLY_TRUCK;

      cameraControls.addEventListener("update", () => {
        if (cameraControls.enabled == true) {
          this.quaternion = [
            camera.quaternion.x,
            camera.quaternion.y,
            camera.quaternion.z,
            camera.quaternion.w,
          ];
        }
      });

      var geometry = new THREE.SphereBufferGeometry(0.025, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
      var targetSphere = new THREE.Mesh(geometry, material);
      scene.add(targetSphere);

      window.addEventListener("resize", this.onWindowResize);
      window.addEventListener("orientationchange", this.onWindowResize);
      this.onWindowResize();

      renderer.render(scene, camera);
    },
    onWindowResize: function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.left = (900 * camera.aspect) / -2;
      camera.right = (900 * camera.aspect) / 2;
      camera.top = 900 / 2;
      camera.bottom = -900 / 2;

      camera.updateProjectionMatrix();

      renderer.setSize(window.innerWidth, window.innerHeight);
      drawingCanvas.width = window.innerWidth;
      drawingCanvas.height = window.innerHeight;
    },
    animate: function () {
      const delta = clock.getDelta();
      let hasCameraControlsUpdated = cameraControls.update(delta);

      requestAnimationFrame(this.animate);

      if (hasCameraControlsUpdated) {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
      }
    },
    setSelectedTool: function (val) {
      this.tool = val;
    },
    updateCameraPosition: function (val) {
      console.log(val);
      renderer.render(scene, camera);
      switch (val) {
        case "start":
          cameraControls.enabled = false;
          cameraControls.dampingFactor = 1;
          console.log("cameraControls disabled");
          break;
        case "update":
          // this.quaternion = [
          //   camera.quaternion.x,
          //   camera.quaternion.y,
          //   camera.quaternion.z,
          //   camera.quaternion.w,
          // ];
          // console.log(this.quaternion);
          //cameraControls.update();
          break;
        case "end":
          cameraControls.enabled = true;
          cameraControls.dampingFactor = 10;
          break;
        default:
        //nothing
      }
      renderer.render(scene, camera);
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>


// how to update component data from app https://stackoverflow.com/questions/47281746/vue-update-component-data-from-vue-instance

<style>
:root {
  --bg-color: rgb(60, 57, 60);
  --accent-color: rgb(255, 176, 0);
  --accent-color-selected: rgb(228, 156, 0);
  --ui-bg-color: rgb(30, 30, 30);
  --line-color-lightest: rgb(255, 242, 213);
  --line-color-light: rgb(255, 231, 178);
  --line-color-medium: rgb(255, 220, 142);
  --line-color-dark: rgb(255, 209, 107);
}

body,
html,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: 0;
  padding: 0;
  border: 0;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}
</style>
