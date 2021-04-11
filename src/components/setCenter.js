import * as THREE from "three";
import {
    camera,
    cameraControls,
    vm,
    scene
} from "../App.vue";

let setCenter = {
    set: function (tx, ty) {

        let newTarget = new THREE.Vector3();

        let raycaster = new THREE.Raycaster();
        raycaster.params.Line.threshold = 0.05;
        raycaster.layers.set(1);
        raycaster.setFromCamera(new THREE.Vector2(tx, ty), camera);
        try {
            var intersectedObject = raycaster.intersectObjects(scene.children)[0];
            newTarget = intersectedObject.point;
        } catch (err) {
            //if nothing is found, it means that we pointed nothing, so we place the center at the unprojected point
            var v3 = new THREE.Vector3(tx, ty, 0);
            v3.unproject(camera);
            newTarget = v3;
        }

        cameraControls.moveTo(newTarget.x, newTarget.y, newTarget.z, true)
        console.log(vm.$.ctx)
        vm.$.ctx.setPreviouslySelectedTool();
    }
}

export { setCenter }