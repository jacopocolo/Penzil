import * as THREE from "three";
import { renderer, scene, cameraControls, camera } from "../App.vue";

let drawingPlane = {
    plane: undefined,
    count: 0,
    setUp: function () {
        var geometry = new THREE.PlaneGeometry(0.1, 0.1, 0.1);
        // var grid = new THREE.TextureLoader().load(require("@/assets/drawingPlane/grid.png"));
        // var alphaGrid = new THREE.TextureLoader().load(require("@/assets/drawingPlane/amap.png"));
        var material = new THREE.MeshBasicMaterial({
            // map: grid,
            // alphaMap: alphaGrid,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            fog: false,
        });
        var planeBg = new THREE.Mesh(geometry, material);
        this.plane = new THREE.Group();
        this.plane.add(planeBg);
        scene.add(this.plane);
        renderer.render(scene, camera);
    },
    updatePosition: function () {
        let target = new THREE.Vector3();
        target = cameraControls.getTarget(target);
        var x = target.x;
        var y = target.y;
        var z = target.z;
        this.plane.position.set(x, y, z);
        this.updateSlerp();
    },
    updateSlerp: function () {
        let animate = function () {
            drawingPlane.updateSlerp();
        }
        //the issue is in the amount of frames. 60 was kind of eyeballing and basically a way to make sure that we have enough time to slerp the two quaternion together but it keeps the engine busy for too long. I need to figure out a way to say: if the plane is in position, stop
        if (this.count < 12) {
            this.plane.quaternion.slerp(camera.quaternion, 1 / 6);
            this.count++
            requestAnimationFrame(animate);
            renderer.render(scene, camera)
        } else { this.count = 0; }
    },
    hide: function () {
        this.plane.children[0].material.opacity = 0;
    },
    show: function () {
        this.plane.children[0].material.opacity = 1;
    },
}

export { drawingPlane }