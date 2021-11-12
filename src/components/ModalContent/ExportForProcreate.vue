
<template>
  <div>
    <h1>Export for Procreate</h1>

    <p>Export your sketch for Procreate with the button below.</p>
    <button @click="exportToUSDZ">Export</button>
    <p>
      Because of limitations in the USDZ format, some things may not work as
      expected. Here are known limitations:
    </p>
    <p>
      1️⃣ All your lines will be merged in a single element and colors discarded.
      So, in Procreate you will find a single geometry containing all your lines
      and it will be in black. You can still apply colors to it but coloring
      individual elements won't be possible.
    </p>
    <p>
      2️⃣ Because USDZ doesn't support “backfaces”, fills will only be paintable
      from one side. To make the two faces look the same, paint the “roughness”
      level completely white.
    </p>
    <p>
      3️⃣ Penzil uses some strange tecniquies to create fills so fills may not
      look and paint particularly good in Procreate. Painting them in 2d mode
      (3d > Show 2d texture) can help.
    </p>
  </div>
</template>

<script>
import * as THREE from "three";
import { scene } from "../../App.vue";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { USDZExporter } from "three/examples/jsm/exporters/USDZExporter.js";
import { TubeBufferGeometry } from "../TubeGeometryWithVariableWidth.js";

// let texture = new THREE.TextureLoader().load("/watercolor.jpg");
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.repeat.set(1, 1);

export default {
  name: "Export",
  data() {
    return {};
  },
  methods: {
    exportToUSDZ: async function () {
      let sceneUSDZ = new THREE.Scene();
      const group = new THREE.Group();

      function map(n, start1, stop1, start2, stop2) {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
      }

      let geometries = [];

      for (let o = 0; o <= scene.children.length; o++) {
        let obj = scene.children[o];

        if (
          obj != undefined &&
          obj.geometry &&
          obj.geometry.type == "MeshLine" &&
          obj.layers.mask == 2 &&
          obj.geometry.attributes.position.array.length > 0
        ) {
          // The stroke
          if (obj.userData.stroke.show_stroke === true) {
            let geometry = obj.geometry.clone();
            geometry.applyMatrix4(obj.matrix);
            let vertices = [];
            let points = Array.from(geometry.attributes.position.array);

            for (let i = 0; i <= points.length; i = i + 6) {
              let v3 = new THREE.Vector3(
                points[i],
                points[i + 1],
                points[i + 2]
              );
              //why do I have 0,0,0 points in my positions? :thinking:
              if (v3.x != 0 && v3.y != 0 && v3.z != 0) {
                vertices.push(v3);
              }
            }

            //if the line is too short, we skip this iteration
            if (vertices.length < 2) continue;

            let force = [0];
            for (let i = 0; i < obj.userData.stroke.force.length; i++) {
              let length = obj.userData.stroke.force.length;
              let minWidth = 0;
              let baseWidth = obj.userData.stroke.lineWidth;

              //https://github.com/spite/THREE.MeshLine/blob/master/src/THREE.MeshLine.js#L424
              //in the shader it seems like it's base witdth * width
              let width = obj.userData.stroke.force[i] / (baseWidth * 10000);
              let tailLength = 3;

              //Beginning of the line
              if (i < tailLength) {
                let n = map(
                  i,
                  minWidth,
                  tailLength,
                  minWidth,
                  baseWidth + width
                );

                force.push(n);
              }
              //End of the line
              else if (i > length - tailLength) {
                let n = map(
                  i,
                  length - tailLength,
                  length - 1,
                  baseWidth + width,
                  minWidth
                );

                force.push(n);
              }
              //bulk of the line
              else {
                force.push(baseWidth + width);
              }
            }

            var pathBase = new THREE.CatmullRomCurve3(vertices);
            const tubeGeometry = new TubeBufferGeometry(
              pathBase,
              vertices.length,
              force,
              8,
              !true
            );

            geometries.push(tubeGeometry);
          }

          // The fill
          if (obj.userData.fill.show_fill === true) {
            let fill = obj.children[0].clone();
            let fillGeometry = obj.children[0].geometry.clone();
            fillGeometry.name = "Fill " + o;

            fill.geometry = fillGeometry;
            fill.geometry.applyMatrix4(obj.matrix);
            fill.position.set(0, 0, 0);
            fill.rotation.set(0, 0, 0);
            fill.scale.set(1, 1, 1);

            fill.material = new THREE.MeshStandardMaterial({
              color: obj.userData.fill.color,
              side: THREE.DoubleSide,
              roughness: 1,
              // map: texture,
            });

            let texture;
            if (obj.children[0].material.map) {
              texture = obj.children[0].material.map.clone();
              fill.material.map = texture;
            }

            sceneUSDZ.add(fill);
            // fill.position.set(
            //   fill.position.x,
            //   fill.position.y,
            //   fill.position.z + 0.005
            // );

            // let fillFlipped = fill.clone();
            // let fillFlippedGeometry = fill.geometry.clone();
            // fillFlippedGeometry.index.array =
            //   fillFlippedGeometry.index.array.reverse();
            // fillFlipped.geometry = fillFlippedGeometry;
            // fillFlipped.material = new THREE.MeshStandardMaterial({
            //   color: obj.userData.fill.color,
            //   side: THREE.DoubleSide,
            //   map: texture,
            // });
            // sceneUSDZ.add(fillFlipped);
            // fillFlipped.position.set(
            //   fillFlipped.position.x,
            //   fillFlipped.position.y,
            //   fillFlipped.position.z - 0.005
            // );
          }
        }
      }

      if (geometries.length > 0) {
        const material = new THREE.MeshStandardMaterial({
          color: 0x1c1c1e,
          flatShading: true,
        });
        const mergedGeometry = mergeBufferGeometries(geometries, false);
        const mesh = new THREE.Mesh(mergedGeometry, material);
        group.attach(mesh);
        sceneUSDZ.add(mesh);
      }

      sceneUSDZ.add(group);
      sceneUSDZ.scale.set(0.1, 0.1, 0.1);
      sceneUSDZ.updateMatrixWorld(true);

      const exporter = new USDZExporter();
      const arraybuffer = await exporter.parse(sceneUSDZ);
      const blob = new Blob([arraybuffer], {
        type: "application/octet-stream",
      });
      var filename = prompt("Enter a name for your file", "sketch");

      if (filename != null) {
        var el = document.createElement("a");
        el.setAttribute("href", URL.createObjectURL(blob));
        el.setAttribute("download", filename + ".usdz");
        el.click();
      }
    },
  },
};
</script>

<style scoped>
div {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

h1 {
  font-size: 60px;
  display: inline;
}

h1 > h2 {
  display: inline;
}

h2 {
  font-size: 18px;
  line-height: 120%;
}

p {
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5em;
}

button {
  align-content: center;
  background-color: rgba(0, 0, 0, 0);
  border: none;
  height: 44px;
  width: 50%;
  padding-left: 16px;
  padding-right: 16px;
  border: 1px solid #ffb000;
  border-radius: 8px;
}
</style>