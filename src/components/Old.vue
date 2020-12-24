
<template>
  <canvas id="drawingCanvas"></canvas>
  <div id="main"></div>

  <div id="mainToolbar" v-bind:class="[ui.show ? '' : 'hidden']">
    <div id="toolSelection">
      <span>
        <input
          type="radio"
          id="toolDraw"
          name="tools"
          value="draw"
          v-model="selectedTool"
        /><label for="toolDraw"> Draw </label>
        <div></div> </span
      ><span>
        <input
          type="radio"
          id="toolEraser"
          name="tools"
          value="erase"
          v-model="selectedTool"
        /><label for="toolEraser"> Erase </label>
        <div></div> </span
      ><span>
        <input
          type="radio"
          id="toolSelect"
          name="tools"
          value="select"
          v-model="selectedTool"
          checked
        /><label for="toolSelect"> Select </label>
        <div></div>
      </span>
    </div>
  </div>

  <div id="miniAxis" v-bind:class="[ui.show ? '' : 'hidden']">
    <div class="handle" id="miniAxisHandle">
      <div class="handleLine"></div>
    </div>
    <div class="circle-under-orientation-gizmo"></div>
    <div id="cameraControlSelection">
      <p class="label-camera"></p>
      <span>
        <input
          type="radio"
          id="cameraRotate"
          name="camera"
          value="rotate"
          v-model="selectedCameraControl"
        /><label for="cameraRotate"> ROT </label>
        <div></div> </span
      ><span>
        <input
          type="radio"
          id="cameraPan"
          name="camera"
          value="pan"
          v-model="selectedCameraControl"
        /><label for="cameraPan"> PAN </label>
        <div></div>
      </span>
      <span>
        <input
          type="radio"
          id="cameraZoom"
          name="camera"
          value="zoom"
          v-model="selectedCameraControl"
        /><label for="cameraZoom"> ZOOM </label>
        <div></div>
      </span>
    </div>
    <span
      class="reset-camera"
      @click="resetCamera()"
      v-bind:class="[ui.resetDisabled ? 'disabled ' : '']"
      >↺</span
    >
  </div>

  <div
    class="toolbar"
    id="toolbar"
    v-bind:class="[
      ui.show == true ? '' : 'hidden',
      selectedTool != 'erase' ? '' : 'hidden',
    ]"
  >
    <!-- <div class="handle" id="toolbarHandle">
                <div class="handleLine"></div>
                <div class="handleLine"></div>
            </div> -->

    <span class="lineTools" v-if="selectedTool == 'draw'">
      <div class="toolbarLabel">Width</div>
      <span id="lineWidth">
        <span>
          <input
            type="radio"
            id="smallestLineWidth"
            value="1"
            name="smallestLineWidth"
            v-model="lineWidth"
          />
          <label for="smallestLineWidth">
            <span
              id="smallestLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: lineColor }"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="smallLineWidth"
            value="3"
            name="smallLineWidth"
            v-model="lineWidth"
          />
          <label for="smallLineWidth">
            <span
              id="smallLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: lineColor }"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="mediumLineWidth"
            value="10"
            name="mediumLineWidth"
            v-model="lineWidth"
          />
          <label for="mediumLineWidth"
            ><span
              id="mediumLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: lineColor }"
            ></span
          ></label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="largeLineWidth"
            value="30"
            name="largeLineWidth"
            v-model="lineWidth"
          />
          <label for="largeLineWidth"
            ><span
              id="largeLineWidthIndicator"
              class="indicator"
              v-bind:style="{ backgroundColor: lineColor }"
            ></span
          ></label>
          <div></div>
        </span>
      </span>

      <div class="toolbarLabel">Color</div>
      <span id="lineColor">
        <span>
          <input
            type="radio"
            id="lightestColor"
            value="lightest"
            name="lightestColor"
            v-model="selectedColor"
          />
          <label for="lightestColor">
            <span
              class="colorSelector indicator"
              id="lightestColorSelector"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="lightColor"
            value="light"
            name="lightColor"
            v-model="selectedColor"
          />
          <label for="lightColor">
            <span
              class="colorSelector indicator"
              id="lightColorSelector"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="mediumColor"
            value="medium"
            name="mediumColor"
            v-model="selectedColor"
          />
          <label for="mediumColor">
            <span
              class="colorSelector indicator"
              id="mediumColorSelector"
            ></span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            id="darkColor"
            value="dark"
            name="darkColor"
            v-model="selectedColor"
          />
          <label for="darkColor">
            <span class="colorSelector indicator" id="darkColorSelector"></span>
          </label>
          <div></div>
        </span>
      </span>

      <div class="toolbarLabel">Mirror</div>
      <span id="mirror" class="button">
        <span>
          <input
            type="radio"
            value="false"
            name="noMirror"
            id="noMirror"
            v-model="mirror"
          />
          <label for="noMirror">
            <span class="mirrorRadio indicator">No</span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            value="x"
            name="mirrorX"
            id="mirrorX"
            v-model="mirror"
          />
          <label for="mirrorX">
            <span class="mirrorRadio indicator">X</span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            value="y"
            name="mirrorY"
            id="mirrorY"
            v-model="mirror"
          />
          <label for="mirrorY">
            <span class="mirrorRadio indicator">Y</span>
          </label>
          <div></div>
        </span>
        <span>
          <input
            type="radio"
            value="z"
            name="mirrorZ"
            id="mirrorZ"
            v-model="mirror"
          />
          <label for="mirrorZ">
            <span class="mirrorRadio indicator">Z</span>
          </label>
          <div></div>
        </span>
      </span>

      <div class="toolbarLabel" v-if="experimental">Smoothing {{ smooth }}</div>
      <input
        type="range"
        id="smooth"
        name="smooth"
        min="4"
        max="60"
        step="1"
        v-model="smooth"
        v-if="experimental"
      />

      <!-- <div class="button" id="zDepth" v-if="experimental">
                    <span class="toolbarLabel">Drawing plane</span>
                    <div>
                        <label for="distance">
                            <span class="depthLabel">Far</span>
                        </label>
                        <label for="distance">
                            <span class="depthLabel near">Near</span>
                        </label>
                        <input type="range" id="distance" name="distance" min="-0.25" max="0.25" step="0.01" value="0"
                            v-model="zDepth">
                    </div> 
                </div>-->
    </span>

    <span id="transformationSelection" v-if="selectedTool === 'select'">
      <span>
        <input
          type="radio"
          id="translate"
          name="transformations"
          value="translate"
          v-model="selectedTransformation"
          checked
        /><label for="translate"> Move</label>
        <div></div>
      </span>
      <span>
        <input
          type="radio"
          id="rotate"
          name="transformations"
          value="rotate"
          v-model="selectedTransformation"
        /><label for="rotate"> Rotate</label>
        <div></div>
      </span>
      <span>
        <input
          type="radio"
          id="scale"
          name="transformations"
          value="scale"
          v-model="selectedTransformation"
        /><label for="scale"> Scale</label>
        <div></div>
      </span>
    </span>
    <button
      v-if="selectedTool === 'select'"
      id="duplicate"
      class="button"
      v-bind:class="[selection.selected.length ? '' : 'disabled']"
      v-on:click="duplicateSelected"
    >
      Duplicate
    </button>
  </div>
  <button
    id="more"
    @click="ui.showOverflowMenu = !ui.showOverflowMenu"
    v-bind:class="[ui.show ? '' : 'hidden']"
  >
    {{ ui.showOverflowMenu ? "X" : "…" }}
  </button>
  <div id="overflowMenu" v-bind:class="[ui.showOverflowMenu ? '' : 'hidden']">
    <button id=" Save" @click="exportTo.json()">Save…</button>
    <button id="Load" @click="importFrom.json()">Load…</button>
    <button id=" Export" @click="exportTo.geometry">Export geometry</button>
    <button id="makeVideo" @click="exportTo.mp4.start(360, 60, false)">
      Export 360 video
    </button>
    <button id="makeVideo" @click="exportTo.mp4.start(30, 30, true)">
      Export wiggle video
    </button>
    <button id="hidePlane" @click="toggleDrawingPlane()">
      {{ ui.showDrawingPlane ? "Hide drawing plane" : "Show drawing plane" }}
    </button>
    <!-- <button @click=" toggleUi()">{{ui.show?"Hide menus":"Show menus"}}</button> -->
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls, TransformControls, GLTFExporter } from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import CameraControls from "camera-controls";
CameraControls.install({ THREE: THREE });

var app;

export default {
  name: "Old",
  data() {
    return {
      selectedTool: "draw", //Options are 'draw', 'erase', 'select'
      selectedTransformation: "translate", //Options are "translate", "rotate" and "scale"
      selectedCameraControl: "rotate",
      isAGroupSelected: false, //Transform tools must be restricted if true
      selectedColor: "lightest", //buffer from the selector so it can be genericized
      lineColor: getComputedStyle(document.documentElement).getPropertyValue(
        "--line-color-lightest"
      ), //Rgb value
      lineWidth: 3, //Default 3
      smooth: 8,
      tipLength: 3,
      controlsLocked: false,
      mirror: false,
      autoRotate: false,
      selection: {}, //to be filled from init
      importFrom: {},
      exportTo: {},
      ui: {
        intro: true,
        resetDisabled: true,
        show: true,
        showDrawingPlane: true,
        showOverflowMenu: false,
        theme: "",
      },
      modal: {
        show: false,
        mode: "loader", //modal, loader
        title: "Saving your drawing",
        helptext: "This might take a moment, please be patient",
        source: "",
      },
      toast: {
        show: false,
        text: "Selection duplicated",
      },
      experimental:
        new URL(document.URL).hash == "#experimental" ? true : false,
      zDepth: 0,
    };
  },
  watch: {
    selectedTool: function () {
      //on tool change we always deselect
      app.selection.deselect();
      picking.resetPicking();
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);

      switch (this.selectedTool) {
        case "draw":
          if (this.ui.showDrawingPlane) {
            line.showDrawingPlane();
          }
          break;
        case "erase":
          line.hideDrawingPlane();
          break;
        case "select":
          line.hideDrawingPlane();
          break;
      }
    },
    selectedColor: function () {
      switch (true) {
        case app.selectedColor == "lightest":
          app.lineColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--line-color-lightest");
          break;
        case app.selectedColor == "light":
          app.lineColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--line-color-light");
          break;
        case app.selectedColor == "medium":
          app.lineColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--line-color-medium");
          break;
        case app.selectedColor == "dark":
          app.lineColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--line-color-dark");
          break;
        default:
          app.lineColor = getComputedStyle(
            document.documentElement
          ).getPropertyValue("--line-color-lightest"); //safe
      }
    },
    zDepth: function () {
      line.drawingPlane.position.copy(
        new THREE.Vector3(
          directControls.target.x,
          directControls.target.y,
          -app.zDepth + app.lineWidth / 1500 / 2
        ).unproject(camera)
      );
    },
    smooth: function (val) {
      line.render.buffer.size = val;
    },
  },
  methods: {
    duplicateSelected: function () {
      app.selection.duplicate();
      app.toast.show = true;
      app.toast.text = "Selection duplicated";
      setTimeout(function () {
        app.toast.show = false;
      }, 700);
    },
    deselect: function () {
      app.selection.deselectFromButton();
    },
    resetCamera: function () {
      directControls.dampingFactor = 0.5;
      directControls.enabled = false;
      directControls.setLookAt(0, 0, 10, 0, 0, 0, true);
      directControls.zoomTo(160, true);
      directControls.enabled = true;
      setTimeout(() => {
        directControls.dampingFactor = 10;
      }, 100);
    },
    toggleUi: function () {
      app.ui.show = !app.ui.show;
    },
    toggleDrawingPlane: function () {
      this.ui.showDrawingPlane = !this.ui.showDrawingPlane;
      line.drawingPlane.children[0].material.opacity = this.ui.showDrawingPlane
        ? "1"
        : "0";
    },
    //MOUSE HANDLERS
    onTapStart: function (event) {
      if (event.which == 3) {
        return;
      }

      if (event.touches && event.touches.length > 1) {
        mouse.multitouch = true;
        drawingCanvas.removeEventListener("touchmove", this.onTapMove, false);
        drawingCanvas.removeEventListener("mousemove", this.onTapMove, false);
        drawingCanvas.removeEventListener("touchend", this.onTapEnd, false);
        drawingCanvas.removeEventListener("mouseup", this.onTapEnd, false);
        return;
      } else {
        mouse.multitouch = false;
        mouse.updateCoordinates(event);

        switch (this.selectedTool) {
          case "draw":
            line.start();
            break;
          case "erase":
            eraser.start();
            break;
          case "select":
            app.selection.start();
            break;
        }

        drawingCanvas.addEventListener("touchmove", this.onTapMove, false);
        drawingCanvas.addEventListener("mousemove", this.onTapMove, false);
        drawingCanvas.addEventListener("touchend", this.onTapEnd, false);
        drawingCanvas.addEventListener("mouseup", this.onTapEnd, false);
      }
    },
    onTapMove: function (event) {
      if (mouse.multitouch == false) {
        mouse.updateCoordinates(event);
        //DRAW
        switch (this.selectedTool) {
          case "draw":
            line.move();
            break;
          case "erase":
            eraser.move();
            break;
          case "select":
            app.selection.move();
            break;
        }
      }
    },
    onTapEnd: function (event) {
      if (mouse.multitouch == false) {
        //handler if it's a touch event
        mouse.updateCoordinates(event);
        //DRAW
        switch (this.selectedTool) {
          case "draw":
            line.end();
            break;
          case "erase":
            eraser.end();
            break;
          case "select":
            app.selection.end();
            break;
        }
        drawingCanvas.removeEventListener("touchmove", this.onTapMove, false);
        drawingCanvas.removeEventListener("mousemove", this.onTapMove, false);
        drawingCanvas.removeEventListener("touchend", this.onTapEnd, false);
        drawingCanvas.removeEventListener("mouseup", this.onTapEnd, false);
      }
    },
  },
  mounted() {
    document.getElementById("welcome").style.zIndex = -1;
    var element = document.getElementById("welcome");
    element.parentNode.removeChild(element);

    app = this;

    drawingCanvas = document.getElementById("drawingCanvas");
    context = drawingCanvas.getContext("2d");
    drawingCanvas.width = window.innerWidth;
    drawingCanvas.height = window.innerHeight;

    init();
    introAnimation();
    animate();
  },
};

var renderer,
  miniAxisRenderer,
  scene,
  miniAxisScene,
  camera,
  miniAxisCamera,
controls,
  directControls,
  transformControls;
//clock;

var drawingCanvas, contex;

//var drawingCanvas = document.getElementById("drawingCanvas");
//var context = drawingCanvas.getContext("2d");
var main = document.getElementById("main");
var miniAxis = document.getElementById("miniAxis");
CameraControls.install({ THREE: THREE });

let mouse = {
  down: false,
  tx: 0, //x coord for threejs
  ty: 0, //y coord for threejs
  cx: 0, //x coord for canvas
  cy: 0, //y coord for canvas
  force: 0,
  smoothing: function () {
    return 0;
    // if (app.lineWidth <= 3 && (line.render.geometry && line.render.geometry.vertices.length > 6)) { return 8 } else { return 3 }
  }, //Smoothing can create artifacts if it's too high. Might need to play around with it
  updateCoordinates: function (event) {
    if (
      event.touches &&
      new THREE.Vector2(
        event.changedTouches[0].pageX,
        event.changedTouches[0].pageY
      ).distanceTo(new THREE.Vector2(this.cx, this.cy)) > this.smoothing()
    ) {
      this.tx = (event.changedTouches[0].pageX / window.innerWidth) * 2 - 1;
      this.ty = -(event.changedTouches[0].pageY / window.innerHeight) * 2 + 1;
      this.cx = event.changedTouches[0].pageX;
      this.cy = event.changedTouches[0].pageY;

      if (event.touches[0] && event.touches[0]["force"] !== undefined) {
        this.force = event.touches[0]["force"];
      } else {
        this.force = 0;
      }
    } else {
      if (
        event.button == 0 &&
        new THREE.Vector2(event.clientX, event.clientY).distanceTo(
          new THREE.Vector2(this.cx, this.cy)
        ) > this.smoothing()
      ) {
        this.tx = (event.clientX / window.innerWidth) * 2 - 1;
        this.ty = -(event.clientY / window.innerHeight) * 2 + 1;
        this.cx = event.clientX;
        this.cy = event.clientY;
      }
    }
  },
};

let line = {
  start: function () {
    this.render.start(
      mouse.tx,
      mouse.ty,
      -app.zDepth,
      mouse.force,
      true,
      app.lineColor,
      app.lineWidth,
      app.mirror
    );
  },
  move: function () {
    this.render.update(mouse.tx, mouse.ty, -app.zDepth, mouse.force, true);
  },
  end: function () {
    this.render.end();
  },
  render: {
    line: null,
    geometry: null,
    uuid: null,
    buffer: {
      points: [],
      size: app.smooth,
      appendToBuffer: function (pt) {
        this.points.push(pt);
        while (this.points.length > this.size) {
          this.points.shift();
        }
      },
      getAveragePoint: function (offset) {
        var len = this.points.length;
        if (len % 2 === 1 || len >= this.size) {
          var totalX = 0;
          var totalY = 0;
          var totalZ = 0;
          var totalW = 0;
          var pt, i;
          var count = 0;
          for (i = offset; i < len; i++) {
            count++;
            pt = this.points[i];
            totalX += pt.x;
            totalY += pt.y;
            totalZ += pt.z;
            totalW += pt.w;
          }
          return {
            x: totalX / count,
            y: totalY / count,
            z: totalZ / count,
            w: totalW / count,
          };
        }
        return null;
      },
    },
    start: function (
      x,
      y,
      z,
      force,
      unproject,
      lineColor,
      lineWidth,
      mirrorOn
    ) {
      var vNow = new THREE.Vector3(x, y, z);
      if (unproject) {
        vNow.unproject(camera);
      }
      this.geometry = new THREE.Geometry();
      this.line = new MeshLine();
      this.line.geometry.userData.originalPoints = [];
      this.line.geometry.userData.force = [];
      //let strokeTexture = new THREE.TextureLoader().load("../img/watercolor.png");
      var material = new MeshLineMaterial({
        lineWidth: lineWidth / 1000, //kind of eyballing it
        sizeAttenuation: 1,
        color: new THREE.Color(lineColor),
        side: THREE.DoubleSide,
        fog: true,
        //For textured stroke
        // useMap: true,
        // map: strokeTexture,
        // transparent: true,
        // depthTest: false,
        //resolution: new THREE.Vector2(insetWidth, insetHeight)
      });
      var mesh = new THREE.Mesh(this.line.geometry, material);
      mesh.raycast = MeshLineRaycast;
      scene.add(mesh);

      mesh.userData.lineColor = lineColor;
      mesh.userData.lineWidth = lineWidth;

      switch (mirrorOn) {
        case "x":
          mirror.object(mesh, "x");
          break;
        case "y":
          mirror.object(mesh, "y");
          break;
        case "z":
          mirror.object(mesh, "z");
          break;
        default:
        //it's false, do nothing
      }

      mesh.layers.set(1);
      this.uuid = mesh.uuid;
    },
    update: function (x, y, z, force, unproject) {
      var v3 = new THREE.Vector3(x, y, z);
      if (unproject) {
        v3.unproject(camera);
      }
      var v4 = new THREE.Vector4(v3.x, v3.y, v3.z, force);

      if (unproject) {
        this.buffer.appendToBuffer(v4);
        let pt = this.buffer.getAveragePoint(0);
        if (pt) {
          v3 = new THREE.Vector3(pt.x, pt.y, pt.z);
          this.line.geometry.userData.force.push(pt.w);
          this.geometry.vertices.push(v3);
        }
      } else {
        this.line.geometry.userData.force.push(force);
        this.geometry.vertices.push(v3);
      }

      this.setGeometry();
    },
    end: function () {
      //this produces only a very minor reduction of length. Not sure if we need it
      //this.geometry.vertices = simplify(this.geometry.vertices, 0.00001, true)

      this.setGeometry("mouseup");
      //reset
      this.buffer.points = [];
      this.line = null;
      this.geometry = null;
      this.uuid = null;
    },
    setGeometry(end) {
      this.line.setGeometry(this.geometry, function (p) {
        function map(n, start1, stop1, start2, stop2) {
          return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        }
        let index = Math.round(p * (this.geometry.vertices.length - 1));
        let minWidth = 0;
        let baseWidth = 3;
        let width = this.geometry.geometry.userData.force[index] * 16;
        let tipLength = app.tipLength;

        //Beginning of the line
        if (index < tipLength) {
          return map(index, minWidth, tipLength, minWidth, baseWidth + width); //+ width
        }
        //End of the line
        else if (
          index > this.geometry.vertices.length - tipLength &&
          end == "tail"
        ) {
          return map(
            index,
            this.geometry.vertices.length - tipLength,
            this.geometry.vertices.length - 1,
            baseWidth + width,
            minWidth
          );
        }
        //bulk of the line
        else {
          return baseWidth + width;
        }
      });

      if (end == "mouseup") {
        var mesh = scene.getObjectByProperty("uuid", this.uuid);
        this.geometry.verticesNeedsUpdate = true;
        mesh.position.set(
          mesh.geometry.boundingSphere.center.x,
          mesh.geometry.boundingSphere.center.y,
          mesh.geometry.boundingSphere.center.z
        );
        this.geometry.center();
        this.setGeometry("tail");
        this.geometry.needsUpdate = true;
        if (mesh.userData.mirror) {
          mirror.updateMirrorOf(mesh);
        }
      }
    },
    fromVertices(vertices, lineColor, lineWidth, mirrorOn, returnLineBool) {
      line.render.start(
        vertices[0].x,
        vertices[0].y,
        vertices[0].z,
        vertices[0].w,
        false,
        lineColor,
        lineWidth,
        mirrorOn
      );
      for (var i = 1; i < vertices.length; i++) {
        line.render.update(
          vertices[i].x,
          vertices[i].y,
          vertices[i].z,
          vertices[i].w,
          false
        );
      }
      var l = scene.getObjectByProperty("uuid", this.uuid);
      line.render.end();
      if (returnLineBool == true) {
        return l;
      }
    },
  },
  drawingPlane: null, //defined in init
  drawingPlaneNeedsUpdate: false,
  count: 0,
  addDrawingPlane: function () {
    var geometry = new THREE.PlaneGeometry(4, 4, 4);
    var grid = new THREE.TextureLoader().load("../img/grid-dark.png");
    var material = new THREE.MeshBasicMaterial({
      map: grid,
      // color: 0xffffff,
      transparent: true,
      side: THREE.DoubleSide,
      opacity: 1,
      fog: false,
    });
    var planeBg = new THREE.Mesh(geometry, material);

    var metaGeometry = new THREE.PlaneGeometry(4, 4, 4);
    var metaTexture = new THREE.TextureLoader().load("../img/meta-dark.png");
    var metaMaterial = new THREE.MeshBasicMaterial({
      map: metaTexture,
      // color: 0xffffff,
      transparent: true,
      opacity: 1,
      fog: false,
    });
    var planeMeta = new THREE.Mesh(metaGeometry, metaMaterial);
    planeMeta.position.z = planeBg.position.z + 1;

    // var planeGrid = new THREE.GridHelper(
    //     1,
    //     1,
    //     new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--line-color-light')),
    //     new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--line-color-light'))
    // );
    // planeGrid.rotation.x = Math.PI / 2;
    this.drawingPlane = new THREE.Group();
    this.drawingPlane.add(planeBg);
    this.drawingPlane.add(planeMeta);
    scene.add(this.drawingPlane);
  },
  updateDrawingPlane: function () {
    let target = new THREE.Vector3();
    target = directControls.getTarget(target);
    var x = target.x;
    var y = target.y;
    var z = target.z;

    this.drawingPlane.position.set(x, y, z);

    if (this.count < 60) {
      this.drawingPlane.quaternion.slerp(camera.quaternion, 0.2);
      this.count++;
    }
  },
  hideDrawingPlane: function () {
    line.drawingPlane.children[0].material.opacity = 0;
  },
  showDrawingPlane: function () {
    line.drawingPlane.children[0].material.opacity = 1;
  },
};

let mirror = {
  updateMirrorOf: function (obj) {
    if (obj.type === "Group") {
      obj.children.forEach((obj) => {
        mirror.updateMirrorOf(obj);
      });
    } else if (obj.userData.mirror) {
      //let's check if there's a matching mirror object otherwise we do nothing
      let mirroredObject = scene.getObjectByProperty(
        "uuid",
        obj.userData.mirror
      );
      var position = new THREE.Vector3();
      obj.getWorldPosition(position);
      var quaternion = new THREE.Quaternion();
      obj.getWorldQuaternion(quaternion);
      var scale = new THREE.Vector3();
      obj.getWorldScale(scale);
      switch (obj.userData.mirrorAxis) {
        case "x":
          mirroredObject.position.set(-position.x, position.y, position.z);
          mirroredObject.quaternion.set(
            -quaternion.x,
            quaternion.y,
            quaternion.z,
            -quaternion.w
          );
          mirroredObject.scale.set(-scale.x, scale.y, scale.z);
          break;
        case "y":
          mirroredObject.position.set(position.x, -position.y, position.z);
          mirroredObject.quaternion.set(
            quaternion.x,
            -quaternion.y,
            quaternion.z,
            -quaternion.w
          );
          mirroredObject.scale.set(scale.x, -scale.y, scale.z);
          break;
        case "z":
          mirroredObject.position.set(position.x, position.y, -position.z);
          mirroredObject.quaternion.set(
            quaternion.x,
            quaternion.y,
            -quaternion.z,
            -quaternion.w
          );
          mirroredObject.scale.set(scale.x, scale.y, -scale.z);
          break;
        default:
          return;
      }
      obj.matrixWorldNeedsUpdate = true;
    }
  },
  object: function (obj, axis) {
    var clone = obj.clone();
    clone.layers.set(1);
    clone.raycast = MeshLineRaycast;
    clone.userData.mirror = obj.uuid;
    clone.userData.mirrorAxis = axis;
    obj.userData.mirror = clone.uuid;
    obj.userData.mirrorAxis = axis;
    switch (axis) {
      case "x":
        clone.applyMatrix(obj.matrixWorld.makeScale(-1, 1, 1));
        break;
      case "y":
        clone.applyMatrix(obj.matrixWorld.makeScale(1, -1, 1));
        break;
      case "z":
        clone.applyMatrix(obj.matrixWorld.makeScale(1, 1, -1));
        break;
      default:
        return;
    }
    scene.add(clone);
  },
  eraseMirrorOf: function (obj) {
    if (obj.userData.mirror) {
      let mirroredObject = scene.getObjectByProperty(
        "uuid",
        obj.userData.mirror
      );
      scene.remove(mirroredObject);
    }
  },
};

class GPUPickHelper {
  constructor() {
    this.pickingTexture = new THREE.WebGLRenderTarget();
    this.pixelBuffer = new Uint8Array(4);
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  calcPointsInBetween(x1, y1, x2, y2) {
    var coordinatesArray = new Array();
    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = x1 < x2 ? 1 : -1;
    var sy = y1 < y2 ? 1 : -1;
    var err = dx - dy;
    // Set first coordinates
    coordinatesArray.push(new THREE.Vector2(x1, y1));
    // Main loop
    while (!(x1 == x2 && y1 == y2)) {
      var e2 = err << 1;
      if (e2 > -dy) {
        err -= dy;
        x1 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y1 += sy;
      }
      // Set coordinates
      coordinatesArray.push(new THREE.Vector2(x1, y1));
    }
    // Return the result
    return coordinatesArray;
  }
  pick(cssPosition, scene, camera) {
    const { pickingTexture, pixelBuffer } = this;
    // set the view offset to represent just a single pixel under the mouse
    const pixelRatio = renderer.getPixelRatio();
    camera.setViewOffset(
      renderer.getContext().drawingBufferWidth, // full width
      renderer.getContext().drawingBufferHeight, // full top
      (cssPosition.x * pixelRatio) | 0, // rect x
      (cssPosition.y * pixelRatio) | 0, // rect y
      1, // rect width
      1 // rect height
    );
    // render the scene
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    // clear the view offset so rendering returns to normal
    camera.clearViewOffset();
    //read the pixel
    renderer.readRenderTargetPixels(
      pickingTexture,
      0, // x
      0, // y
      1, // width
      1, // height
      pixelBuffer
    );

    const id = (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
    const intersectedObject = picking.idToObject[id];

    if (intersectedObject) {
      return intersectedObject;
    }
  }
  pickArea(x1, y1, x2, y2, scene, camera) {
    const { pickingTexture, pixelBuffer } = this;
    const width = () => {
      if (x2 - x1 < 0) {
        return -(x2 - x1);
      } else if (x2 - x1 == 0) {
        return 1;
      } else {
        return x2 - x1;
      }
    };
    const height = () => {
      if (y2 - y1 < 0) {
        return -(y2 - y1);
      } else if (y2 - y1 == 0) {
        return 1;
      } else {
        return y2 - y1;
      }
    };
    let intersectObjects = new Array();

    // set the view offset to represent just a single pixel under the mouse
    const pixelRatio = renderer.getPixelRatio();
    camera.setViewOffset(
      renderer.getContext().drawingBufferWidth, // full width
      renderer.getContext().drawingBufferHeight, // full top
      (x1 * pixelRatio) | 0, // rect x
      (y1 * pixelRatio) | 0, // rect y
      (width() * pixelRatio) | 1, // height
      (height() * pixelRatio) | 1 // width
    );
    // render the scene
    this.pickingTexture.setSize(width(), height());
    renderer.setRenderTarget(pickingTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    // clear the view offset so rendering returns to normal
    camera.clearViewOffset();
    //read the pixel

    this.calcPointsInBetween(0, 0, width(), height()).forEach((point) => {
      renderer.readRenderTargetPixels(
        this.pickingTexture,
        point.x, // x
        point.y, // y
        1, // width
        1, // height
        pixelBuffer
      );
      const id =
        (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
      const intersectedObject = picking.idToObject[id];
      if (
        intersectedObject != undefined &&
        intersectObjects.indexOf(intersectedObject) < 0
      ) {
        intersectObjects.push(intersectedObject);
      }
    });
    return intersectObjects;
  }
}
let picking = {
  scene: null,
  idToObject: {},
  id: 1,
  picker: new GPUPickHelper(),
  setupPicking: function () {
    console.log("setupPicking");
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0);
    scene.children.forEach((children) => {
      if (children.layers.mask == 2) {
        var clone = children.clone();
        var cloneMaterial = children.material.clone();
        clone.material = cloneMaterial;
        cloneMaterial.color = new THREE.Color(this.id);
        this.scene.add(clone);
        this.idToObject[this.id] = children;
        this.id = this.id + 1;
      }
    });
  },
  resetPicking: function () {
    if (this.scene != null) {
      this.idToObject = {};
      this.id = 1;
      this.scene.children.forEach((children) => {
        scene.remove(children);
        children.material.dispose();
      });
    }
  },
};

let eraser = {
  linepaths: [],
  color: getComputedStyle(document.documentElement).getPropertyValue(
    "--accent-color"
  ),
  start: function () {
    picking.resetPicking();
    picking.setupPicking();
    var pickedObjects = picking.picker.pickArea(
      mouse.cx - 5,
      mouse.cy - 5,
      mouse.cx + 5,
      mouse.cy + 5,
      picking.scene,
      camera
    );
    if (pickedObjects != undefined && pickedObjects.length > 0) {
      pickedObjects.forEach((object) => {
        scene.remove(object);
        mirror.eraseMirrorOf(object);
        object.material.dispose();
      });
    }
    context.globalAlpha = 0.25;
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "white";
    context.fillRect(mouse.cx - 8, mouse.cy - 8, 16, 16);
    // this.linepaths.push([mouse.cx, mouse.cy]);
  },
  move: function () {
    // this.linepaths[this.linepaths.length - 1].push([mouse.cx, mouse.cy]);
    // this.redrawLine('rgba(255,255,255)');
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "white";
    context.fillRect(mouse.cx - 8, mouse.cy - 8, 16, 16);

    var pickedObjects = picking.picker.pickArea(
      mouse.cx - 5,
      mouse.cy - 5,
      mouse.cx + 5,
      mouse.cy + 5,
      picking.scene,
      camera
    );
    if (pickedObjects != undefined && pickedObjects.length > 0) {
      pickedObjects.forEach((object) => {
        scene.remove(object);
        mirror.eraseMirrorOf(object);
        object.material.dispose();
      });
    }
  },
  end: function () {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    picking.resetPicking();
    // context.closePath();
    // context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    // this.linepaths = [];
  },
  redrawLine: function (color) {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    context.strokeStyle = color;
    context.globalAlpha = 0.25;
    // context.lineCap = 'round';
    context.lineJoin = "bevel";
    context.lineWidth = 15;
    context.beginPath();
    for (var i = 0; i < this.linepaths.length; ++i) {
      var path = this.linepaths[i];
      if (this.linepaths.length < 1) continue;
      context.moveTo(path[0][0], path[0][1]);
      for (var j = 1; j < path.length; ++j)
        context.lineTo(path[j][0], path[j][1]);
    }
    context.stroke();
  },
};

class vertexSelection {
  constructor() {
    this.start = new THREE.Vector2();
    this.end = new THREE.Vector2();
    this.cssStart = new THREE.Vector2();
    this.cssEnd = new THREE.Vector2();
  }
  pointInRect(x, y, z1, z2, z3, z4) {
    let x1 = Math.min(z1, z3);
    let x2 = Math.max(z1, z3);
    let y1 = Math.min(z2, z4);
    let y2 = Math.max(z2, z4);
    if (x1 <= x && x <= x2 && y1 <= y && y <= y2) {
      return true;
    } else {
      return false;
    }
  }
  getObjectBoundingBoxPoints(object) {
    let bb;
    if (object.geometry.boundingBox != undefined) {
      bb = object.geometry.boundingBox;
    } else {
      return;
    }

    var points = [
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ];

    points[0].set(bb.min.x, bb.min.y, bb.min.z); // 000
    points[1].set(bb.min.x, bb.min.y, bb.max.z); // 001
    points[2].set(bb.min.x, bb.max.y, bb.min.z); // 010
    points[3].set(bb.min.x, bb.max.y, bb.max.z); // 011
    points[4].set(bb.max.x, bb.min.y, bb.min.z); // 100
    points[5].set(bb.max.x, bb.min.y, bb.max.z); // 101
    points[6].set(bb.max.x, bb.max.y, bb.min.z); // 110
    points[7].set(bb.max.x, bb.max.y, bb.max.z); // 111
    points[8].set(
      object.geometry.boundingSphere.center.x,
      object.geometry.boundingSphere.center.y,
      object.geometry.boundingSphere.center.z
    ); //does it make sense to add this?

    points.forEach((point) => {
      point.applyMatrix4(object.matrix);
      point.project(camera);
    });

    return points;
  }
  select() {
    let selectedObjects = new Array();

    scene.children.forEach((object) => {
      if (object.layers.mask == 2) {
        //get the projected bounding points of the rectangle
        let boundingBoxPoints = this.getObjectBoundingBoxPoints(object);

        if (boundingBoxPoints != undefined) {
          for (var j = boundingBoxPoints.length; j--; ) {
            //check if any of the points is part of the selection
            let point = boundingBoxPoints[j];
            if (
              this.pointInRect(
                point.x,
                point.y,
                this.start.x,
                this.start.y,
                this.end.x,
                this.end.y
              )
            ) {
              //If even one point is inside of the selection, it's worth checking for all the vertices, otherwise not
              for (var k = object.geometry.vertices.length; k--; ) {
                let p = new THREE.Vector3(
                  object.geometry.vertices[k].x,
                  object.geometry.vertices[k].y,
                  object.geometry.vertices[k].z
                );
                p.applyMatrix4(object.matrix);
                p.project(camera);

                if (
                  this.pointInRect(
                    p.x,
                    p.y,
                    this.start.x,
                    this.start.y,
                    this.end.x,
                    this.end.y
                  )
                ) {
                  selectedObjects.push(object);
                  return;
                }
              }
            }
          }
        }
      }
    });

    return selectedObjects;
  }
}

app.selection = {
  array: [],
  selection: [],
  selected: [],
  selector: new vertexSelection(),
  helper: undefined,
  group: undefined,
  transforming: function () {
    if (transformControls.userData.hover) {
      return transformControls.userData.hover;
    } else {
      return false;
    }
  },
  color: getComputedStyle(document.documentElement).getPropertyValue(
    "--accent-color"
  ),
  start: function () {
    if (this.transforming() === false) {
      let raycaster = new THREE.Raycaster();
      raycaster.params.Line.threshold = 0.05;
      raycaster.layers.set(1);
      raycaster.setFromCamera(new THREE.Vector2(mouse.tx, mouse.ty), camera);
      try {
        var intersectedObject = raycaster.intersectObjects(scene.children)[0]
          .object;
        this.selection.push(intersectedObject);
      } catch (err) {
        //expected error if nothing is found
      }

      this.selector.start.x = mouse.tx;
      this.selector.start.y = mouse.ty;
      this.selector.cssStart.x = mouse.cx;
      this.selector.cssStart.y = mouse.cy;
    }
  },
  move: function () {
    if (this.transforming() === false && this.selected.length == 0) {
      context.globalAlpha = 1;
      context.clearRect(0, 0, window.innerWidth, window.innerHeight);
      context.beginPath();
      context.rect(
        this.selector.cssStart.x,
        this.selector.cssStart.y,
        mouse.cx - this.selector.cssStart.x,
        mouse.cy - this.selector.cssStart.y
      );
      context.strokeStyle = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--accent-color-selected");
      context.lineWidth = 0.7;
      context.setLineDash([4, 4]);
      context.stroke();
    }
  },
  end: function () {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.selector.end.x = mouse.tx;
    this.selector.end.y = mouse.ty;
    let objectsInRect = this.selector.select();

    try {
      objectsInRect.forEach((object) => {
        this.selection.push(object);
      });
    } catch (err) {
      alert(err);
    }

    if (this.transforming() === false) {
      if (this.selection.length == 0 || this.selected.length > 0) {
        this.deselect();
      } else {
        this.select(this.selection);
      }
    }
  },
  duplicate: function () {
    //it's a group
    if (this.selected.length > 1) {
      //var sourcePosition = this.group.position;
      var duplicateArray = [];
      console.log(app.selection.selection);
      this.selected.forEach((object) => {
        var duplicate = object.clone();
        duplicate.layers.set(1);
        var duplicateMaterial = object.material.clone();
        duplicate.material = duplicateMaterial;
        duplicate.raycast = MeshLineRaycast;
        duplicateArray.push(duplicate);
        scene.add(duplicate);
        mirror.object(duplicate, duplicate.userData.mirrorAxis);
      });
      //deselect selected group
      this.deselect();
      app.selection.selection = duplicateArray;
      app.selection.selection.forEach((element) => {
        this.toggleSelectionColor(element, true);
      });
      this.select(app.selection.selection);
      this.helper.update();
      mirror.updateMirrorOf(this.group);
    }
    //it's a single objet
    else if (this.selected.length == 1) {
      var duplicate = this.selected[0].clone();
      //var originalPosition = duplicate.position;
      var duplicateMaterial = duplicate.material.clone();
      duplicate.material = duplicateMaterial;
      // duplicate.position.set(
      //     originalPosition.x + 0.1,
      //     originalPosition.y,
      //     originalPosition.z
      // )
      scene.add(duplicate);
      duplicate.raycast = MeshLineRaycast;
      mirror.object(duplicate, duplicate.userData.mirrorAxis);
      //deselect selected object
      this.deselect();
      this.selection.push(duplicate);
      this.select(this.selection);
      this.selection = [];
      this.helper.update();
    }
  },
  select: function (selection) {
    //selection can not be zero so it's either 1 or more than 1
    //It's a single element
    if (selection.length == 1) {
      this.helper = new THREE.BoxHelper(
        selection[0],
        new THREE.Color(this.color)
      );
      this.toggleSelectionColor(selection[0], true);
      scene.add(this.helper);
      transformControls = new TransformControls(camera, drawingCanvas);
      transformControls.attach(selection[0]);
      transformControls.addEventListener("objectChange", function () {
        mirror.updateMirrorOf(app.selection.selected[0]);
      });
      this.selected.push(selection[0]);
      this.helper.update();
    }
    //It's a group
    else {
      this.group = new THREE.Group();
      scene.add(this.group);
      this.helper = new THREE.BoxHelper(
        this.group,
        new THREE.Color(this.color)
      );
      scene.add(this.helper);
      //calculate where is the center for the selected objects so we can set the center of the group before we attach objects to it;
      var center = new THREE.Vector3();
      selection.forEach((obj) => {
        this.toggleSelectionColor(obj, true);
        center.add(obj.position);
      });
      center.divideScalar(selection.length);
      this.group.position.set(center.x, center.y, center.z);
      //Clone all the elements in the selection to the temporary groups
      selection.forEach((element) => {
        var clone = element.clone();
        scene.add(clone);
        this.group.attach(clone);
        clone.userData.uuid = element.uuid;
        clone.visible = false;
        this.selected.push(element);
      });
      this.helper.update();
      transformControls = new TransformControls(camera, drawingCanvas);
      transformControls.attach(this.group);
    }
    transformControls.addEventListener("objectChange", function () {
      app.selection.helper.update();
      transformControls.object.children.forEach((obj) => {
        var position = new THREE.Vector3();
        obj.getWorldPosition(position);
        var quaternion = new THREE.Quaternion();
        obj.getWorldQuaternion(quaternion);
        var scale = new THREE.Vector3();
        obj.getWorldScale(scale);
        var selectedObj = scene.getObjectByProperty("uuid", obj.userData.uuid);
        selectedObj.position.set(position.x, position.y, position.z);
        selectedObj.quaternion.set(
          quaternion.x,
          quaternion.y,
          quaternion.z,
          quaternion.w
        );
        selectedObj.scale.set(scale.x, scale.y, scale.z);
        mirror.updateMirrorOf(selectedObj);
      });
    });
    scene.add(transformControls);
    this.selection = [];
  },
  deselect: function () {
    transformControls.detach();
    scene.remove(transformControls);
    scene.remove(this.helper);

    switch (true) {
      case this.selected.length == 0:
        break;
      case this.selected.length == 1:
        this.toggleSelectionColor(this.selected[0], false);

        break;
      case this.selected.length > 1:
        //var ungroupArray = [];

        for (var i = 0; i < this.selected.length; i++) {
          var obj = this.selected[i];
          this.toggleSelectionColor(obj, false);
        }

        scene.remove(this.group);
        this.group = undefined;

        break;
      default:
    }
    this.selected = [];
    this.selection = [];
  },
  toggleSelectionColor: function (object, bool) {
    if (bool) {
      object.material.color = new THREE.Color(this.color);
    } else {
      object.material.color = new THREE.Color(object.userData.lineColor);
    }
  },
  computeGroupCenter: function () {
    var center = new THREE.Vector3();
    var children = app.selection.group.children;
    var count = children.length;
    for (var i = 0; i < count; i++) {
      center.add(children[i].position);
    }
    center.divideScalar(count);
    return center;
  },
  redrawLine: function (color) {
    context.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    context.strokeStyle = color;
    context.globalAlpha = 0.25;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 15;
    context.beginPath();
    for (var i = 0; i < this.linepaths.length; ++i) {
      context.lineTo(this.linepaths[i].x, this.linepaths[i].y);
    }
    context.stroke();
  },
};

app.importFrom = {
  json: function () {
    var file;
    var input = document.createElement("input");
    input.style.display = "none";
    input.type = "file";
    document.body.appendChild(input);

    input.onchange = (event) => {
      file = event.target.files[0];

      function onReaderLoad(event) {
        var json = JSON.parse(event.target.result);

        var lightestColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--line-color-lightest");
        var lightColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--line-color-light");
        var mediumColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--line-color-medium");
        var darkColor = getComputedStyle(
          document.documentElement
        ).getPropertyValue("--line-color-dark");

        try {
          json.forEach((importedLine) => {
            if (importedLine.g.length > 1) {
              //Let's make sure there are at least 2 points in the line
              var vertices = [];

              for (var i = 0; i < importedLine.g.length; i = i + 4) {
                vertices.push(new THREE.Vector4().fromArray(importedLine.g, i));
              }

              var color;
              switch (true) {
                case importedLine.c == 0:
                  color = lightestColor;
                  break;
                case importedLine.c == 1:
                  color = lightColor;
                  break;
                case importedLine.c == 2:
                  color = mediumColor;
                  break;
                case importedLine.c == 3:
                  color = darkColor;
                  break;
                default:
                  color = lightestColor; //safe
              }

              var l = line.render.fromVertices(
                vertices,
                color,
                importedLine.w,
                importedLine.a,
                true
              );

              l.position.set(
                importedLine.p.x,
                importedLine.p.y,
                importedLine.p.z
              );
              l.quaternion.set(
                importedLine.q._x,
                importedLine.q._y,
                importedLine.q._z,
                importedLine.q._w
              );
              l.scale.set(importedLine.s.x, importedLine.s.y, importedLine.s.z);

              mirror.updateMirrorOf(l);
            }
          });
          app.ui.showOverflowMenu = false;
        } catch (err) {
          app.toast.show = true;
          app.toast.text = "Error. No line data found";
          setTimeout(function () {
            app.toast.show = false;
          }, 2000);
        }
      }

      if (file.type == "application/json") {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(file);
      } else {
        app.toast.show = true;
        app.toast.text = "Error. File type not correct";
        setTimeout(function () {
          app.toast.show = false;
        }, 2000);
      }
    };
    input.click();
  },
};

app.exportTo = {
  json: async function () {
    var itemProcessed = 0;
    var json = [];
    var mirroredObject = [];
    var lightestColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--line-color-lightest");
    var lightColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--line-color-light");
    var mediumColor = getComputedStyle(
      document.documentElement
    ).getPropertyValue("--line-color-medium");
    var darkColor = getComputedStyle(document.documentElement).getPropertyValue(
      "--line-color-dark"
    );
    scene.children.forEach((obj) => {
      //check if it's a line, if it's in the right layer and that we don't already have its original
      if (
        obj.geometry &&
        obj.geometry.type == "MeshLine" &&
        obj.layers.mask == 2 &&
        mirroredObject.indexOf(obj.uuid) == -1
      ) {
        var line = {};
        line.c = 0;
        var color = obj.userData.lineColor;
        switch (true) {
          case color === lightestColor:
            line.c = 0;
            break;
          case color === lightColor:
            line.c = 1;
            break;
          case color === mediumColor:
            line.c = 2;
            break;
          case color === darkColor:
            line.c = 3;
            break;
          default:
            return; //already defined a
        }
        line.w = obj.userData.lineWidth;
        line.g = [];

        for (let i = 0; i < obj.geometry.vertices.length; i++) {
          line.g.push(obj.geometry.vertices[i].x);
          line.g.push(obj.geometry.vertices[i].y);
          line.g.push(obj.geometry.vertices[i].z);
          line.g.push(obj.geometry.userData.force[i]);
        }

        //Old force-less implementation
        // obj.geometry.vertices.forEach(vector3 => {
        //     line.g.push(vector3.x);
        //     line.g.push(vector3.y);
        //     line.g.push(vector3.z);
        // });

        var position = new THREE.Vector3();
        position = obj.getWorldPosition(position);
        line.p = position;

        var quaternion = new THREE.Quaternion();
        quaternion = obj.getWorldQuaternion(quaternion);
        line.q = quaternion;

        var scale = new THREE.Vector3();
        scale = obj.getWorldScale(scale);
        line.s = scale;

        if (obj.userData.mirror) {
          //Push the id of the mirrored line in the array to exclude mirrors
          mirroredObject.push(obj.userData.mirror);
        }
        //This is all we need to restore its mirror, the renderLine takes care of it
        if (obj.userData.mirrorAxis) {
          line.a = obj.userData.mirrorAxis;
        }

        json.push(line);
      }
      itemProcessed = itemProcessed + 1;
      if (itemProcessed >= scene.children.length) {
        return;
      }
    });
    // return json
    var dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(json));

    var filename = prompt("Enter filename", "sketch");

    if (filename != null) {
      var el = document.createElement("a");
      el.setAttribute("href", dataStr);
      el.setAttribute("download", filename + ".json");
      el.click();
    }
    app.ui.showOverflowMenu = false;
  },
  geometry: function () {
    app.selection.deselect();
    //Essentially this function creates a new scene from scratch, iterates through all the line2 in Scene 1, converts them to line1 that the GLTF exporter can export and Blender can import and exports the scene. Then deletes the scene.
    var scene2 = new THREE.Scene();
    function exportGLTF(input) {
      var gltfExporter = new GLTFExporter();
      var options = {};
      gltfExporter.parse(
        input,
        function (result) {
          if (result instanceof ArrayBuffer) {
            saveArrayBuffer(result, "scene.glb");
          } else {
            var output = JSON.stringify(result, null, 2);
            // console.log(output);
            saveString(output, "scene.gltf");
          }
        },
        options
      );

      scene2.traverse((object) => {
        if (!object.isMesh) return;

        console.log("dispose geometry!");
        object.geometry.dispose();

        if (object.material.isMaterial) {
          cleanMaterial(object.material);
        } else {
          // an array of materials
          for (const material of object.material) cleanMaterial(material);
        }
      });
      const cleanMaterial = (material) => {
        console.log("dispose material!");
        material.dispose();
        // dispose textures
        for (const key of Object.keys(material)) {
          const value = material[key];
          if (value && typeof value === "object" && "minFilter" in value) {
            console.log("dispose texture!");
            value.dispose();
          }
        }
      };
      scene2.dispose();
    }
    var link = document.createElement("a");
    link.style.display = "none";
    document.body.appendChild(link); // Firefox workaround, see #6594

    function save(blob) {
      link.href = URL.createObjectURL(blob);
      link.download = "scene.gltf";
      link.click();
      // URL.revokeObjectURL( url ); breaks Firefox...
    }
    function saveString(text, filename) {
      save(
        new Blob([text], {
          type: "text/plain",
        }),
        filename
      );
    }
    function saveArrayBuffer(buffer, filename) {
      save(
        new Blob([buffer], {
          type: "application/octet-stream",
        }),
        filename
      );
    }
    //may need to scale up a bit
    function convertMeshLinetoLine() {
      var itemProcessed = 0;
      scene.children.forEach((obj) => {
        if (
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2
        ) {
          var material = new THREE.LineBasicMaterial({
            color: obj.material.color,
            linewidth: obj.material.linewidth,
          });
          var geometry = new THREE.BufferGeometry().setFromPoints(
            obj.geometry.vertices
          );
          var convertedLine = new THREE.Line(geometry, material);
          var position = obj.getWorldPosition(position);
          var quaternion = obj.getWorldQuaternion(quaternion);
          var scale = obj.getWorldScale(scale);
          convertedLine.position.set(position.x, position.y, position.z);
          convertedLine.quaternion.set(
            quaternion.x,
            quaternion.y,
            quaternion.z,
            quaternion.w
          );
          convertedLine.scale.set(scale.x, scale.y, scale.z);
          scene2.add(convertedLine);
          convertedLine.geometry.center();
          convertedLine.geometry.applyMatrix(convertedLine.matrix); //maybe?
        }
        itemProcessed = itemProcessed + 1;
        if (itemProcessed === scene.children.length) {
          exportGLTF(scene2);
        }
      });
    }
    convertMeshLinetoLine();
  },
  mp4: {
    exporting: false,
    currentLength: 0,
    length: 60,
    loop: false,
    rotation: 360,
    images: new Array(),
    worker: undefined,
    start: function (rotation, length, loop) {
      this.length = length;
      this.rotation = rotation;
      this.loop = loop;
      this.worker = new Worker("../build/ffmpeg-worker-mp4.js");
      camera.layers.disable(0);
      this.exporting = true;
    },
    pad: function (n, insetWidth, z) {
      z = z || "0";
      n = n + "";
      return n.length >= insetWidth
        ? n
        : new Array(insetWidth - n.length + 1).join(z) + n;
    },
    addFrame: function () {
      if (this.currentLength == 0) {
        this.images = new Array();
        app.modal.show = true;
        app.ui.show = false;
        app.ui.showOverflowMenu = false;
        app.modal.mode = "loader";
        app.modal.title = "Making you a movie";
        app.modal.helptext = "This might take a moment, please be patient";
      } else {
        app.modal.helptext =
          "Recording frame " + this.currentLength + " out of " + this.length;
      }

      //   const img = new Image(),
      const mimeType = "image/jpeg";

      const imgString = renderer.domElement.toDataURL(mimeType, 1);

      const data = this.convertDataURIToBinary(imgString);

      this.images.push({
        name: `img${this.pad(this.images.length, 3)}.jpeg`,
        data,
      });
    },
    convertDataURIToBinary: function (dataURI) {
      var base64 = dataURI.replace(/^data[^,]+,/, "");
      var raw = window.atob(base64);
      var rawLength = raw.length;

      var array = new Uint8Array(new ArrayBuffer(rawLength));
      for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
      }
      return array;
    },
    finalizeVideo: function () {
      app.modal.helptext = "Generating your video";

      this.worker.onmessage = function (e) {
        var messages;
        var msg = e.data;
        switch (msg.type) {
          case "stdout":
          case "stderr":
            messages += msg.data + "\n";
            app.modal.helptext = msg.data;
            break;
          case "exit":
            console.log("Process exited with code " + msg.data);
            //worker.terminate();
            break;
          case "done":
            var blob = new Blob([msg.data.MEMFS[0].data], {
              type: "video/mp4",
            });
            app.exportTo.mp4.done(blob);
            break;
        }
        console.log(messages);
        //app.modal.helptext = messages
      };

      if (this.loop) {
        this.worker.postMessage({
          type: "run",
          TOTAL_MEMORY: 468435456,
          arguments: [
            "-r",
            "20",
            "-stream_loop", //loop twice
            "1", //loop twice
            "-i",
            "img%03d.jpeg",
            "-c:v",
            "libx264",
            "-crf",
            "1",
            "-vf",
            "scale=" + 1024 + ":" + 1024 + "",
            "-pix_fmt",
            "yuv420p",
            "-vb",
            "20M",
            "out.mp4",
          ],
          MEMFS: this.images,
        });
      } else {
        this.worker.postMessage({
          type: "run",
          TOTAL_MEMORY: 468435456,
          arguments: [
            "-r",
            "20",
            "-i",
            "img%03d.jpeg",
            "-c:v",
            "libx264",
            "-crf",
            "1",
            "-vf",
            "scale=" + 1024 + ":" + 1024 + "",
            "-pix_fmt",
            "yuv420p",
            "-vb",
            "20M",
            "out.mp4",
          ],
          MEMFS: this.images,
        });
      }
    },
    done: function (output) {
      let webkitURL; //???
      const url = webkitURL.createObjectURL(output);
      console.log("Completed video");
      app.modal.title = "Here’s your video";
      app.modal.source = url;
      app.modal.helptext = url;
      app.modal.mode = "modal";
      console.log("done");
      app.autoRotate = false;
    },
  },
};

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.left = (900 * camera.aspect) / -2;
  camera.right = (900 * camera.aspect) / 2;
  camera.top = 900 / 2;
  camera.bottom = -900 / 2;

  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  drawingCanvas.width = window.innerWidth;
  drawingCanvas.height = window.innerHeight;

  //   insetWidth = window.innerHeight / 4;
  //   insetHeight = window.innerHeight / 4;
}

function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false,
  });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  main.appendChild(renderer.domElement);
  renderer.domElement.id = "threeJsCanvas";

  miniAxisRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  miniAxisRenderer.setPixelRatio(window.devicePixelRatio);
  miniAxisRenderer.setClearColor(
    new THREE.Color(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--ui-bg-color"
      )
    ),
    0
  );
  miniAxisRenderer.setSize(150, 150);
  miniAxis.appendChild(miniAxisRenderer.domElement);

  scene = new THREE.Scene();
  //Set the background based on the css variable;
  var bgCol = getComputedStyle(document.documentElement).getPropertyValue(
    "--bg-color"
  );
  scene.background = new THREE.Color(bgCol);
  scene.fog = new THREE.Fog(bgCol, 9, 13);
  miniAxisScene = new THREE.Scene();

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

  drawAxisHelperControls();

  var size = 1;
  var divisions = 1;
  var gridHelper = new THREE.GridHelper(size, divisions);
  gridHelper.applyMatrix4(new THREE.Matrix4().makeScale(5, 5, 5));
  gridHelper.layers.set(0);
  gridHelper.material.fog = false;
  scene.add(gridHelper);

  camera = new THREE.OrthographicCamera(
    window.innerWidth / -2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    window.innerHeight / -2,
    0,
    20
  );
  camera.layers.enable(0); // enabled by default
  camera.layers.enable(1);
  camera.zoom = 160;
  camera.position.set(10, 10, 10);

  //   clock = new THREE.Clock();

  directControls = new CameraControls(camera, drawingCanvas);
  directControls.dampingFactor = 10;
  directControls.mouseButtons.left = CameraControls.ACTION.NONE;
  directControls.mouseButtons.wheel = CameraControls.ACTION.ROTATE;
  directControls.mouseButtons.right = CameraControls.ACTION.ZOOM;
  directControls.touches.one = CameraControls.ACTION.NONE;
  directControls.touches.two = CameraControls.ACTION.TOUCH_ROTATE_ZOOM;
  directControls.touches.three = CameraControls.ACTION.TOUCH_DOLLY_TRUCK;

  controls = new OrbitControls(camera, miniAxisRenderer.domElement);
  controls.rotateSpeed = 0.4;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.saveState();

  var geometry = new THREE.SphereBufferGeometry(0.025, 32, 32);
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  var targetSphere = new THREE.Mesh(geometry, material);
  scene.add(targetSphere);

  //small hack to have OrbitControls and CameraControls work together
  directControls.addEventListener("update", () => {
    let target = new THREE.Vector3();
    target = directControls.getTarget(target);
    // var x = target.x;
    // var y = target.y;
    // var z = target.z;
    controls.target = target;
    targetSphere.position.set(target.x, target.y, target.z);
    if (app.experimental) {
      line.drawingPlane.position.set(target.x, target.y, target.z);
    }
  });
  directControls.addEventListener("sleep", () => {
    let target = new THREE.Vector3();
    target = directControls.getTarget(target);
    var x = target.x;
    var y = target.y;
    var z = target.z;

    line.count = 0;

    if (
      camera.position.z != 10 ||
      x != 0 ||
      y != 0 ||
      z != 0 ||
      camera.zoom != 160
    ) {
      app.ui.resetDisabled = false;
    } else {
      app.ui.resetDisabled = true;
    }
  });

  transformControls = new TransformControls(camera, drawingCanvas);

  miniAxisCamera = new THREE.OrthographicCamera();
  miniAxisCamera.position.set(0, 0, 10);
  //miniAxisCamera.zoom = 750;
  miniAxisCamera.layers.enable(0);
  miniAxisCamera.layers.enable(1);

  line.addDrawingPlane();

  window.addEventListener("resize", onWindowResize);
  window.addEventListener("orientationchange", onWindowResize);
  onWindowResize();
  drawingCanvas.addEventListener("touchstart", app.onTapStart, false);
  drawingCanvas.addEventListener("mousedown", app.onTapStart, false);

  renderer.render(scene, camera);
  miniAxisRenderer.render(miniAxisScene, miniAxisCamera);
}

function animate() {
  //   const delta = clock.getDelta();
  updateminiAxisScene();

  if (!app.ui.intro) {
    line.updateDrawingPlane();
  }

  //???
  //   let hasdirectControlsUpdated;
  //   if (directControls.enabled == true) {
  //     hasdirectControlsUpdated = directControls.update(delta);
  //   }

  requestAnimationFrame(animate);
  if (transformControls) {
    transformControls.mode = app.selectedTransformation;
  }

  renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
  miniAxisRenderer.setViewport(0, 0, 150, 150);
  renderer.render(scene, camera);
  miniAxisRenderer.render(miniAxisScene, miniAxisCamera);

  if (app.exportTo.mp4.exporting) {
    if (app.exportTo.mp4.rotation == 360) {
      if (app.exportTo.mp4.currentLength < app.exportTo.mp4.length) {
        directControls.rotate(6 * THREE.MathUtils.DEG2RAD, 0, true);
        app.exportTo.mp4.addFrame();
        app.exportTo.mp4.currentLength++;
      } else {
        if (app.exportTo.mp4.currentLength == app.exportTo.mp4.length) {
          camera.layers.enable(0);
          app.exportTo.mp4.finalizeVideo();
          app.exportTo.mp4.currentLength = 0;
          app.exportTo.mp4.exporting = false;
        }
      }
    }

    if (app.exportTo.mp4.rotation == 30) {
      if (app.exportTo.mp4.currentLength < app.exportTo.mp4.length / 2) {
        directControls.rotate(1 * THREE.MathUtils.DEG2RAD, 0, true);
        app.exportTo.mp4.addFrame();
        app.exportTo.mp4.currentLength++;
      } else if (
        app.exportTo.mp4.currentLength >= app.exportTo.mp4.length / 2 &&
        app.exportTo.mp4.currentLength < app.exportTo.mp4.length
      ) {
        directControls.rotate(-1 * THREE.MathUtils.DEG2RAD, 0, true);
        app.exportTo.mp4.addFrame();
        app.exportTo.mp4.currentLength++;
      } else {
        if (app.exportTo.mp4.currentLength == app.exportTo.mp4.length) {
          camera.layers.enable(0);
          app.exportTo.mp4.finalizeVideo();
          app.exportTo.mp4.currentLength = 0;
          app.exportTo.mp4.exporting = false;
        }
      }
    }
  }
}

function introAnimation() {
  directControls.dampingFactor = 0.04;
  directControls.setLookAt(0, 0, 10, 0, 0, 0, true);
  setTimeout(() => {
    directControls.dampingFactor = 10;
    app.ui.intro = false;
  }, 2000);

  setTimeout(() => {
    line.drawingPlane.children[1].material.opacity = 0;
  }, 1800);

  setTimeout(() => {
    line.drawingPlane.children[1].material.opacity = 1;
  }, 1900);

  setTimeout(() => {
    line.drawingPlane.children[1].material.opacity = 0;
  }, 1930);
}

//MINI CAMERA
function updateminiAxisScene() {
  miniAxisScene.quaternion.copy(camera.quaternion).inverse();
}
function drawAxisHelperControls() {
  let size = 0.9;
  let distance = size / 2;

  var front = new THREE.TextureLoader().load("../img/sides/front.png");
  var frontGeometry = new THREE.PlaneGeometry(size, size, size);
  var frontMaterial = new THREE.MeshBasicMaterial({
    map: front,
    color: 0x0099ff,
  });
  var frontPlane = new THREE.Mesh(frontGeometry, frontMaterial);
  frontPlane.position.set(0, 0, distance);
  frontPlane.name = "z";
  frontPlane.layers.set(1);
  miniAxisScene.add(frontPlane);

  var back = new THREE.TextureLoader().load("../img/sides/back.png");
  var backGeometry = new THREE.PlaneGeometry(size, size, size);
  var backMaterial = new THREE.MeshBasicMaterial({
    map: back,
    color: 0x0099ff,
  });
  var backPlane = new THREE.Mesh(backGeometry, backMaterial);
  backPlane.position.set(0, 0, -distance);
  backPlane.rotation.y = Math.PI;
  backPlane.name = "-z";
  backPlane.layers.set(1);
  miniAxisScene.add(backPlane);

  var top = new THREE.TextureLoader().load("../img/sides/top.png");
  var topGeometry = new THREE.PlaneGeometry(size, size, size);
  var topMaterial = new THREE.MeshBasicMaterial({ map: top, color: 0x99ff00 });
  var topPlane = new THREE.Mesh(topGeometry, topMaterial);
  topPlane.position.set(0, distance, 0);
  topPlane.rotation.x = Math.PI / 2;
  topPlane.rotation.y = Math.PI;
  topPlane.rotation.z = Math.PI;
  topPlane.name = "y";
  topPlane.layers.set(1);
  miniAxisScene.add(topPlane);

  var bottom = new THREE.TextureLoader().load("../img/sides/bottom.png");
  var bottomGeometry = new THREE.PlaneGeometry(size, size, size);
  var bottomMaterial = new THREE.MeshBasicMaterial({
    map: bottom,
    color: 0x99ff00,
  });
  var bottomPlane = new THREE.Mesh(bottomGeometry, bottomMaterial);
  bottomPlane.position.set(0, -distance, 0);
  bottomPlane.rotation.x = Math.PI / 2;
  bottomPlane.name = "-y";
  bottomPlane.layers.set(1);
  miniAxisScene.add(bottomPlane);

  var right = new THREE.TextureLoader().load("../img/sides/right.png");
  var rightGeometry = new THREE.PlaneGeometry(size, size, size);
  var rightMaterial = new THREE.MeshBasicMaterial({
    map: right,
    color: 0xff6600,
  });
  var rightPlane = new THREE.Mesh(rightGeometry, rightMaterial);
  rightPlane.position.set(distance, 0, 0);
  rightPlane.rotation.y = Math.PI / 2;
  rightPlane.rotation.z = Math.PI;
  rightPlane.rotation.x = Math.PI;
  rightPlane.name = "x";
  rightPlane.layers.set(1);
  miniAxisScene.add(rightPlane);

  var left = new THREE.TextureLoader().load("../img/sides/left.png");
  var leftGeometry = new THREE.PlaneGeometry(size, size, size);
  var leftMaterial = new THREE.MeshBasicMaterial({
    map: left,
    color: 0xff6600,
  });
  var leftPlane = new THREE.Mesh(leftGeometry, leftMaterial);
  leftPlane.position.set(-distance, 0, 0);
  leftPlane.rotation.y = -Math.PI / 2;
  leftPlane.rotation.z = Math.PI;
  leftPlane.rotation.x = Math.PI;
  leftPlane.name = "-x";
  leftPlane.layers.set(1);
  miniAxisScene.add(leftPlane);

  miniAxisRenderer.domElement.addEventListener(
    "mousedown",
    () => {
      directControls.enabled = false;
    },
    false
  );
  miniAxisRenderer.domElement.addEventListener(
    "touchstart",
    () => {
      directControls.enabled = false;
    },
    false
  );

  miniAxisRenderer.domElement.addEventListener(
    "mousemove",
    (e) => {
      if (directControls.enabled == false) {
        console.log(e.movementX, e.movementY);
        miniAxisMouse.moved = true;
      }
    },
    false
  );
  miniAxisRenderer.domElement.addEventListener(
    "touchmove",
    () => {
      if (directControls.enabled == false) {
        miniAxisMouse.moved = true;
      }
    },
    false
  );

  miniAxisRenderer.domElement.addEventListener(
    "mouseup",
    (event) => {
      directControls.enabled = true;
      console.log(miniAxisMouse.moved);
      if (miniAxisMouse.moved == true) {
        directControls.setLookAt(
          camera.position.x,
          camera.position.y,
          camera.position.z,
          controls.target.x,
          controls.target.y,
          controls.target.z,
          false
        );
      } else {
        repositionCamera(event);
      }
      miniAxisMouse.moved = false;
    },
    false
  );
  miniAxisRenderer.domElement.addEventListener(
    "touchend",
    (event) => {
      directControls.enabled = true;
      if (miniAxisMouse.moved == true) {
        directControls.setLookAt(
          camera.position.x,
          camera.position.y,
          camera.position.z,
          controls.target.x,
          controls.target.y,
          controls.target.z,
          false
        );
      } else {
        repositionCamera(event);
      }
      miniAxisMouse.moved = false;
    },
    false
  );
}
let miniAxisMouse = {
  tx: 0, //x coord for threejs
  ty: 0, //y coord for threejs
  moved: false,
  updateCoordinates: function (event) {
    let canvasBounds = miniAxisRenderer
      .getContext()
      .canvas.getBoundingClientRect();
    if (event.touches) {
      this.tx =
        ((event.changedTouches[0].pageX - canvasBounds.left) /
          (canvasBounds.right - canvasBounds.left)) *
          2 -
        1;
      this.ty =
        -(
          (event.changedTouches[0].pageY - canvasBounds.top) /
          (canvasBounds.bottom - canvasBounds.top)
        ) *
          2 +
        1;
      //handler if it's a mouse event
    } else {
      this.tx =
        ((event.clientX - canvasBounds.left) /
          (canvasBounds.right - canvasBounds.left)) *
          2 -
        1;
      this.ty =
        -(
          (event.clientY - canvasBounds.top) /
          (canvasBounds.bottom - canvasBounds.top)
        ) *
          2 +
        1;
    }
  },
};
function repositionCamera() {
  if (!app.controlsLocked) {
    miniAxisMouse.updateCoordinates(event);
    var miniAxisRaycaster = new THREE.Raycaster();
    miniAxisRaycaster.layers.set(1);
    try {
      miniAxisRaycaster.setFromCamera(
        new THREE.Vector2(miniAxisMouse.tx, miniAxisMouse.ty),
        miniAxisCamera
      );
    } catch (err) {
      return;
    }
    var object = miniAxisRaycaster.intersectObjects(miniAxisScene.children)[0]
      .object;

    let target = new THREE.Vector3();
    target = directControls.getTarget(target);
    // var x = target.x;
    // var y = target.y;
    // var z = target.z;

    switch (object.name) {
      case "z":
        directControls.dampingFactor = 0.5;
        directControls.enabled = false;
        directControls.setLookAt(
          target.x,
          target.y,
          target.z + 10,
          target.x,
          target.y,
          target.z,
          true
        );
        directControls.enabled = true;
        setTimeout(() => {
          directControls.dampingFactor = 10;
        }, 100);
        break;
      case "x":
        directControls.dampingFactor = 0.5;
        directControls.enabled = false;
        directControls.setLookAt(
          target.x + 10,
          target.y,
          target.z,
          target.x,
          target.y,
          target.z,
          true
        );
        directControls.enabled = true;
        setTimeout(() => {
          directControls.dampingFactor = 10;
        }, 100);
        break;
      case "y":
        directControls.dampingFactor = 0.5;
        directControls.enabled = false;
        directControls.setLookAt(
          target.x,
          target.y + 10,
          target.z,
          target.x,
          target.y,
          target.z,
          true
        );
        directControls.enabled = true;
        setTimeout(() => {
          directControls.dampingFactor = 10;
        }, 100);
        break;
      case "-x":
        directControls.dampingFactor = 0.5;
        directControls.enabled = false;
        directControls.setLookAt(
          target.x - 10,
          target.y,
          target.z,
          target.x,
          target.y,
          target.z,
          true
        );
        directControls.enabled = true;
        setTimeout(() => {
          directControls.dampingFactor = 10;
        }, 100);
        break;
      case "-y":
        directControls.dampingFactor = 0.5;
        directControls.enabled = false;
        directControls.setLookAt(
          target.x,
          target.y - 10,
          target.z,
          target.x,
          target.y,
          target.z,
          true
        );
        directControls.enabled = true;
        setTimeout(() => {
          directControls.dampingFactor = 10;
        }, 100);
        break;
      case "-z":
        directControls.dampingFactor = 0.5;
        directControls.enabled = false;
        directControls.setLookAt(
          target.x,
          target.y,
          target.z - 10,
          target.x,
          target.y,
          target.z,
          true
        );
        directControls.enabled = true;
        setTimeout(() => {
          directControls.dampingFactor = 10;
        }, 100);
        break;
      default:
    }
  }
}
</script>

<style>
</style>