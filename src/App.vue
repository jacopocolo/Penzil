<template>
  <video-export-preview :show="previewing" @stop-previewing="setPreview" />
  <modal :modalProp="modalProp" @modal-set="setModal" />
  <viewport-cube
    :quaternion="quaternion"
    :cameraResetDisabled="cameraResetDisabled"
    :cameraControlsEnabled="multitouch"
  />
  <tool-selector @selected-tool="setSelectedTool" :selectedTool="tool" />
  <multitouch-selector
    @selected-multitouch="setSelectedMultitouch"
    :selectedMultitouch="multitouch"
  />
  <line-settings @stroke="setStroke" @fill="setFill" :selectedTool="tool" />
  <transorm-toolbar
    :top="transformToolbar.top"
    :left="transformToolbar.left"
    :location="transformToolbar.location"
    :display="transformToolbar.display"
    :selectedTool="tool"
  />
  <undo-redo @selected-tool="setSelectedTool" ref="undoRedo" />
  <Input :selectedTool="tool" :mirror="mirror" :stroke="stroke" :fill="fill" />
  <Canvas ref="raycastCanvas" :enabled="multitouch" />
  <Menu @modal-set="setModal" @preview="setPreview" />
  <show-tutorial @modal-set="setModal" :show="showTutorialButton" />
  <div>
    <!-- https://cwervo.com/writing/quicklook-web/ -->
    <a id="ar" rel="ar"><img src="@/assets/icons/AR.png" /></a>
  </div>
</template>

<script>
import * as THREE from "three";
//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import CameraControls from "camera-controls";
CameraControls.install({ THREE: THREE });
// import InfiniteGridHelper from "./components/InfiniteGridHelper.js";

import Input from "./components/Input.vue";
import ToolSelector from "./components/ToolSelector.vue";
import MultitouchSelector from "./components/MultitouchSelector.vue";
import ViewportCube from "./components/ViewportCube.vue";
import UndoRedo, { undoManager } from "./components/UndoRedo.vue";
import TransormToolbar from "./components/TransformToolbar.vue";
import { select } from "./components/select.js";
import LineSettings from "./components/LineSettings.vue";
import Menu from "./components/Menu.vue";
import Canvas from "./components/Canvas.vue";
import Modal from "./components/Modal.vue";
import VideoExportPreview from "./components/VideoExportPreview.vue";
import ShowTutorial from "./components/ShowTutorial.vue";

export let renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  preserveDrawingBuffer: true, //this is the configuration that allows the renderer to redraw only the current line when we are drawing instead of the whole scene. If I remember correctly it could create some issues with the video rendering. Leaving a note in case it does. One potential workaround would be to have two separte renderers, one for the scene, one for the current line.
});
export let camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
export let scene, drawingScene, cameraControls, vm, drawingprop;

var main, clock;

export default {
  name: "App",
  components: {
    Input,
    LineSettings,
    ToolSelector,
    TransormToolbar,
    ViewportCube,
    UndoRedo,
    Menu,
    Canvas,
    MultitouchSelector,
    Modal,
    VideoExportPreview,
    ShowTutorial,
  },
  data() {
    return {
      tool: "draw",
      multitouch: "canvas",
      toolHistory: ["draw"],
      stroke: {}, //filled by the component on mount
      fill: {}, //filled by the component on mount
      mirror: false,
      quaternion: undefined,
      cameraResetDisabled: false,
      selected: undefined,
      transformToolbar: { top: 0, left: 0, location: "above", display: false },
      canvasTransformEnabled: true,
      modalProp: { show: false, mode: "about" },
      previewing: false,
      showTutorialButton: true,
    };
  },
  emits: ["modal-set"],
  methods: {
    init: function () {
      CameraControls.install({ THREE: THREE });
      main = document.getElementById("threed");

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0); // the default
      renderer.setSize(window.innerWidth, window.innerHeight);
      main.appendChild(renderer.domElement);
      renderer.domElement.id = "threeJsCanvas";

      scene = new THREE.Scene();
      //Set the background based on the css variable;
      var bgCol = 0xdddddd;
      scene.background = new THREE.Color(bgCol);
      scene.fog = new THREE.Fog(bgCol, 10, 25);

      drawingScene = new THREE.Scene(); //this scene is only used for rendering lines as they are being drawn. Lines are then moved to the main scene.

      // const grid = new InfiniteGridHelper(1, 10, new THREE.Color(0x0000ff), 40);
      // scene.add(grid);

      camera.layers.enable(0); // enabled by default
      camera.layers.enable(1);
      camera.zoom = 3;
      camera.position.set(5, 5, 10);

      clock = new THREE.Clock();

      cameraControls = new CameraControls(camera, renderer.domElement);
      cameraControls.dampingFactor = 20;
      cameraControls.draggingDampingFactor = 200;
      cameraControls.mouseButtons.left = CameraControls.ACTION.NONE;
      cameraControls.mouseButtons.wheel = CameraControls.ACTION.ROTATE;
      cameraControls.mouseButtons.right = CameraControls.ACTION.ZOOM;
      cameraControls.touches.one = CameraControls.ACTION.NONE;
      cameraControls.touches.two = CameraControls.ACTION.TOUCH_ZOOM_ROTATE;
      cameraControls.touches.three = CameraControls.ACTION.TOUCH_DOLLY_TRUCK;
      cameraControls.maxZoom = 4000;
      cameraControls.minZoom = 2;
      cameraControls.enabled = false;

      this.quaternion = [
        camera.quaternion.x,
        camera.quaternion.y,
        camera.quaternion.z,
        camera.quaternion.w,
      ];

      cameraControls.addEventListener("update", () => {
        this.quaternion = [
          camera.quaternion.x,
          camera.quaternion.y,
          camera.quaternion.z,
          camera.quaternion.w,
        ];

        let target = new THREE.Vector3();
        target = cameraControls.getTarget(target);
        targetSphere.position.set(target.x, target.y, target.z);

        //hide the contextual transformControls while we adjust the camera is something is selected
        if (select.s && select.s.controls != undefined) {
          this.transformToolbar.display = false;
        }
        if (select.s && select.s.controls != undefined) {
          if (this.tool == "select") {
            select.s.helper.update();
          }
        }
      });

      cameraControls.addEventListener("sleep", () => {
        //reposition the drawingPlane
        // drawingPlane.updatePosition();

        //reposition the contextual transformControls after we adjusted the camera is something is selected
        if (select.s && select.s.controls != undefined) {
          if (this.tool == "select") {
            select.s.helper.update();
            let position = select.s.calculateTransfromToolbarPosition();
            this.transformToolbar.left = position.x;
            this.transformToolbar.top = position.y;
            this.transformToolbar.location = position.location;
            this.transformToolbar.display = true;
          }
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
          camera.zoom != 3
        ) {
          this.cameraResetDisabled = false;
        } else {
          this.cameraResetDisabled = true;
        }
      });

      var geometry = new THREE.SphereBufferGeometry(0.025, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0xffc75f });
      var targetSphere = new THREE.Mesh(geometry, material);
      scene.add(targetSphere);

      const light = new THREE.HemisphereLight(0xffffff, 0x222222, 1); //0x080820
      light.position.set(0, 1, 5);
      scene.add(light);

      this.$.refs.raycastCanvas.setUp();

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

      this.toolHistory.push(val);
      if (this.toolHistory.length > 2) {
        this.toolHistory.shift();
      }

      let current = val;
      let previous = this.toolHistory[0];

      undoManager.add({
        undo: function () {
          vm.setSelectedTool(previous);
        },
        redo: function () {
          vm.setSelectedTool(current);
        },
      });

      this.$.refs.undoRedo.updateUi();
    },
    setSelectedTool_internal: function (val) {
      //this is a version without undo so that it can be called by the setCenter tool
      this.tool = val;
    },
    setSelectedMultitouch: function (val) {
      this.multitouch = val;

      if (val === "camera") {
        cameraControls.enabled = true;
      } else {
        cameraControls.enabled = false;
      }
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
    setStroke: function (val) {
      this.stroke = val;
    },
    setFill: function (val) {
      this.fill = val;
    },
    setModal: function (val) {
      this.modalProp = val;
    },
    setPreview: function (val) {
      this.previewing = val;
    },
  },
  mounted() {
    this.init();
    this.animate();
    vm = this;
    this.cameraResetDisabled = false; //this is an override, I'm not quite sure what sets it to true on mount

    //check if we need to display the tutorial
    if (localStorage.getItem("tut01") === null) {
      localStorage.setItem("tut01", 0);
      this.showTutorialButton = true;
    } else {
      let count = parseInt(window.localStorage.tut01);
      localStorage.setItem("tut01", ++count);
      if (count + 1 <= 5) {
        this.showTutorialButton = true;
      } else {
        this.showTutorialButton = false;
      }
    }
  },
};
</script>

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
  touch-action: manipulation;
  font-weight: 900;
  color: #1c1c1e;
}

button {
  font-weight: 900;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}

input[type="radio"] {
  opacity: 0;
  position: fixed;
  width: 0;
}

label {
  display: flex;
  width: 60px;
  height: 44px;
  align-content: center;
  justify-content: center;
}

input[type="radio"]:checked + label {
  background-color: #ffe8b3;
}

input[type="radio"]:not(:checked) + label {
  background-color: #ffffff;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.hidden {
  display: none;
}

a {
  color: #ffb000;
  text-decoration: none;
}

a:hover {
  color: #ff8400;
}

#ar {
  position: absolute;
  z-index: 6;
  bottom: 12px;
  right: 56px;
}

@media (min-width: 320px) and (max-width: 480px) {
  #viewport {
    display: none;
  }

  .lineSettings {
    display: none;
  }

  .canvasSettings {
    display: none;
  }

  .soapbar {
    display: none;
  }
}
</style>
