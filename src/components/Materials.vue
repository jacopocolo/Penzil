
<template>
  <div></div>
</template>

<script>
import * as THREE from "three";
import { MeshLineMaterial } from "meshline";
export let materialsComponent;

export default {
  name: "Materials",
  data() {
    return {
      materials: [],
    };
  },
  props: {},
  emits: [],
  methods: {
    returnMaterials: function (stroke, fill) {
      let strokeAndFillMaterials = [null, null];
      let hadStrokeMaterialAlready = false;
      let hadFillMaterialAlready = false;

      console.log(this.materials);

      //iterate through the whole array and see if we have the materials already
      for (let x = 0; x < this.materials.length; x++) {
        console.log(
          stroke.show_stroke == this.materials[x][0].opacity ? true : false
        );

        if (
          new THREE.Color(stroke.color).equals(this.materials[x][0].color) &&
          stroke.lineWidth === this.materials[x][0].lineWidth &&
          stroke.show_stroke == this.materials[x][0].opacity
        ) {
          strokeAndFillMaterials[0] = this.materials[x][0];
          hadStrokeMaterialAlready = true;
        }

        if (
          new THREE.Color(fill.color).equals(this.materials[x][1].color) &&
          fill.show_fill === this.materials[x][1].transparent
        ) {
          strokeAndFillMaterials[1] = this.materials[x][1];
          hadFillMaterialAlready = true;
        }
      }

      if (
        hadStrokeMaterialAlready === true &&
        hadFillMaterialAlready === true
      ) {
        return strokeAndFillMaterials;
      } else {
        if (hadStrokeMaterialAlready === false) {
          let strokeMaterial = new MeshLineMaterial({
            lineWidth: stroke.lineWidth,
            sizeAttenuation: 1,
            color: stroke.show_stroke ? stroke.color : 0xffffff,
            side: THREE.DoubleSide,
            fog: true,
            wireframe: false,
            alphaTest: 0.9,
            blending: THREE.NormalBlending,
            transparent: false,
            repeat: new THREE.Vector2(1, 1),
            opacity: 1, //overwritten afterward
          });
          strokeAndFillMaterials[0] = strokeMaterial;
        }
        if (hadFillMaterialAlready === false) {
          let fillMaterial = new THREE.MeshBasicMaterial({
            color: fill.color,
            side: THREE.DoubleSide,
            wireframe: false,
            polygonOffset: stroke.show_stroke ? true : false,
            polygonOffsetFactor: stroke.lineWidth * 1000,
            depthTest: true,
            polygonOffsetUnits: -1,
            transparent: fill.show_fill ? true : false,
            opacity: fill.show_fill ? 0.05 : 0,
            fog: true,
          });
          strokeAndFillMaterials[1] = fillMaterial;
        }
        this.materials.push(strokeAndFillMaterials);
        return strokeAndFillMaterials;
      }
    },
  },
  mounted() {
    materialsComponent = this;
  },
};
</script>