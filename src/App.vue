<template>
  <viewport-cube
    :quaternion="quaternion"
    :cameraResetDisabled="cameraResetDisabled"
  />
  <tool-selector @selected-tool="setSelectedTool" />
  <transorm-toolbar
    :top="transformToolbar.top"
    :left="transformToolbar.left"
    :location="transformToolbar.location"
    :display="transformToolbar.display"
  />
  <Canvas
    :selectedTool="tool"
    :mirror="mirror"
    @setTransformToolbarDisplay="setTransformToolbarDisplay"
    @setTransformToolbarPosition="setTransformToolbarPosition"
  />
  <undo-redo />
  <import />
</template>

<script>
import * as THREE from "three";
//import { TransformControls } from "three";
import CameraControls from "camera-controls";
CameraControls.install({ THREE: THREE });

import Canvas from "./components/Canvas.vue";
import ToolSelector from "./components/ToolSelector.vue";
import ViewportCube from "./components/ViewportCube.vue";
import UndoRedo from "./components/UndoRedo.vue";
import Import from "./components/Import.vue";
import TransormToolbar from "./components/TransformToolbar.vue";
import { select } from "./components/select.js";

//import Modal from "./components/Modal.vue";
//import Toast from "./components/Toast.vue";
//import LineSettings from "./components/LineSettings.vue";
//import Old from "./components/Old.vue";

export let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true, //this is the configuration that allows the renderer to redraw only the current line when we are drawing instead of the whole scene. If I remember correctly it could create some issues with the video rendering. Leaving a note in case it does. One potential workaround would be to have two separte renderers, one for the scene, one for the current line.
});
export let camera = new THREE.OrthographicCamera(
  window.innerWidth / -2,
  window.innerWidth / 2,
  window.innerHeight / 2,
  window.innerHeight / -2,
  0,
  20
);
export let scene, drawingScene, cameraControls, context;

var main, drawingCanvas, clock;

export default {
  name: "App",
  components: {
    // Modal,
    // Toast,
    // ToolSelector,
    Canvas,
    // LineSettings,
    ToolSelector,
    TransormToolbar,
    ViewportCube,
    UndoRedo,
    Import,
  },
  data() {
    return {
      tool: "draw",
      mirror: "x",
      quaternion: undefined,
      cameraResetDisabled: false,
      selected: undefined,
      transformToolbar: { top: 0, left: 0, location: "above", display: false },
    };
  },
  methods: {
    init: function () {
      CameraControls.install({ THREE: THREE });
      drawingCanvas = document.getElementById("twod");
      context = drawingCanvas.getContext("2d");
      main = document.getElementById("threed");

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // the default
      renderer.setSize(window.innerWidth, window.innerHeight);
      main.appendChild(renderer.domElement);
      renderer.domElement.id = "threeJsCanvas";

      scene = new THREE.Scene();
      //Set the background based on the css variable;
      var bgCol = 0xffffff;
      scene.background = new THREE.Color(bgCol);
      // scene.fog = new THREE.Fog(bgCol, 9, 13);

      drawingScene = new THREE.Scene(); //this scene is only used for rendering lines as they are being drawn. Lines are then moved to the main scene.

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

        //hide the contextual transformControls while we adjust the camera is something is selected
        if (select.s && select.s.controls != undefined) {
          this.transformToolbar.display = false;
        }
        if (select.s && select.s.controls != undefined) {
          select.s.helper.update();
        }
      });

      cameraControls.addEventListener("sleep", () => {
        //reposition the contextual transformControls after we adjusted the camera is something is selected
        if (select.s && select.s.controls != undefined) {
          select.s.helper.update();

          let position = select.s.calculateTransfromToolbarPosition();

          this.transformToolbar.left = position.x;
          this.transformToolbar.top = position.y;
          this.transformToolbar.location = position.location;
          this.transformToolbar.display = true;
        }

        //set if the camera is resettable after we adjusted the camera
        let target = new THREE.Vector3();
        target = cameraControls.getTarget(target);
        var x = target.x;
        var y = target.y;
        var z = target.z;

        if (
          camera.position.z != 10 ||
          x != 0 ||
          y != 0 ||
          z != 0 ||
          camera.zoom != 160
        ) {
          this.cameraResetDisabled = false;
        } else {
          this.cameraResetDisabled = true;
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

      renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
      renderer.render(scene, camera);
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
    setSelectedObject: function (val) {
      this.selected = val;
    },
    setTransformToolbarPosition: function (val) {
      this.transformToolbar.top = val.top;
      this.transformToolbar.left = val.left;
      this.transformToolbar.location = val.location;
    },
    setTransformToolbarDisplay: function (val) {
      this.transformToolbar.display = val;
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

.disabled {
  pointer-events: none;
  opacity: 0.6;
}
</style>
