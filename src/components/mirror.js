import * as THREE from "three";
import { MeshLineRaycast } from "three.meshline";
import { scene } from "../App.vue";

let mirror = {
    updateMirrorOf: function (obj, activeScene) {
        if (obj.type === "Group") {
            obj.children.forEach((obj) => {
                mirror.updateMirrorOf(obj, activeScene);
            });
        } else if (obj.userData.mirror) {
            //let's check if there's a matching mirror object otherwise we do nothing
            let mirroredObject = activeScene.getObjectByProperty(
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
    object: function (obj, axis, activeScene) {
        var clone = obj.clone();
        clone.layers.set(1);
        clone.raycast = MeshLineRaycast;
        clone.userData.mirror = obj.uuid;
        clone.userData.mirrorAxis = axis;
        obj.userData.mirror = clone.uuid;
        obj.userData.mirrorAxis = axis;
        switch (axis) {
            case "x":
                clone.applyMatrix4(obj.matrixWorld.makeScale(-1, 1, 1));
                break;
            case "y":
                clone.applyMatrix4(obj.matrixWorld.makeScale(1, -1, 1));
                break;
            case "z":
                clone.applyMatrix4(obj.matrixWorld.makeScale(1, 1, -1));
                break;
            default:
                //if it's false do nothing
                return
        }
        activeScene.add(clone);
        //clone.updateMatrix();
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

export { mirror };