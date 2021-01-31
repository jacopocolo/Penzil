import * as THREE from "three";
import { scene, renderer, camera, context } from "../App.vue";
import { mirror } from "./mirror.js"
import { MeshLineMaterial } from "three.meshline";
import { draw } from "./draw.js";
import { undoManager, undoRedoComponent } from "./UndoRedo.vue"

let erase = {
    e: undefined,
    GPUPickHelper: class {
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
            const intersectedObject = erase.e.idToObject[id];

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
                    pickingTexture,
                    point.x, // x
                    point.y, // y
                    1, // width
                    1, // height
                    pixelBuffer
                );
                const id =
                    (pixelBuffer[0] << 16) | (pixelBuffer[1] << 8) | pixelBuffer[2];
                const intersectedObject = erase.e.idToObject[id];
                if (
                    intersectedObject != undefined &&
                    intersectObjects.indexOf(intersectedObject) < 0
                ) {
                    intersectObjects.push(intersectedObject);
                }
            });
            return intersectObjects;
        }
    },
    eraser: class {
        constructor() {
            this.pscene = new THREE.Scene();
            this.pscene.background = new THREE.Color(0);
            this.idToObject = {};
            this.id = 1;
            this.picker = new erase.GPUPickHelper()
        }
        setupPicking() {
            scene.children.forEach((children) => {
                if (children.layers.mask == 2) {
                    var clone = children.clone();
                    var cloneMaterial = new MeshLineMaterial({
                        lineWidth: clone.material.lineWidth,
                        sizeAttenuation: 1,
                        color: new THREE.Color(this.id),
                        side: THREE.DoubleSide,
                        fog: false,
                    });
                    clone.material = cloneMaterial;
                    this.pscene.add(clone);
                    this.idToObject[this.id] = children;
                    this.id = this.id + 1;
                }
            });
        }
        resetPicking() {
            if (this.scene != null) {
                this.idToObject = {};
                this.id = 1;
                this.scene.children.forEach((children) => {
                    scene.remove(children);
                    children.material.dispose();
                });
            }
        }
        start(cx, cy) {
            var pickedObjects = this.picker.pickArea(
                cx - 5,
                cy - 5,
                cx + 5,
                cy + 5,
                this.pscene,
                camera
            );

            if (pickedObjects != undefined && pickedObjects.length > 0) {
                pickedObjects.forEach((object) => {
                    erase.deleteObject(object)
                });
            }

            context.globalAlpha = 0.25;
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            context.fillStyle = "black";
            context.fillRect(cx - 8, cy - 8, 16, 16);

            renderer.render(scene, camera)
        }
        move(cx, cy) {

            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            context.fillStyle = "black";
            context.fillRect(cx - 8, cy - 8, 16, 16);

            var pickedObjects = this.picker.pickArea(
                cx - 5,
                cy - 5,
                cx + 5,
                cy + 5,
                this.pscene,
                camera
            );
            if (pickedObjects != undefined && pickedObjects.length > 0) {
                pickedObjects.forEach((object) => {
                    erase.deleteObject(object);
                });
            }
            renderer.render(scene, camera)
        }
        end() {
            renderer.render(scene, camera)
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            //actually nothing here
        }
    },
    deleteObject: function (object) {
        //ignore triggers for objects already deleted
        if (scene.getObjectByProperty(
            "uuid",
            object.uuid
        ) == undefined) { return }

        let uuid = object.uuid;
        let vertices = object.geometry.points;
        let force = object.geometry.userData.force;
        let mirrorOn = object.userData.mirror;
        let width = object.material.lineWidth;
        let position = new THREE.Vector3();
        object.getWorldPosition(position);
        let quaternion = new THREE.Quaternion();
        object.getWorldQuaternion(quaternion);
        let scale = new THREE.Vector3();
        object.getWorldScale(scale);

        let matrix = object.matrix;

        scene.remove(object);
        mirror.eraseMirrorOf(object);
        object.material.dispose();

        undoManager.add({
            undo: function () {
                draw.fromVertices(
                    vertices,
                    force,
                    //color,
                    width,
                    mirrorOn,
                    uuid,
                    //true
                    position,
                    quaternion,
                    scale,
                    matrix
                );
                renderer.render(scene, camera);
            },
            redo: function () {
                erase.deleteObject(scene.getObjectByProperty(
                    "uuid",
                    uuid
                ))
                renderer.render(scene, camera);
            }
        });

        undoRedoComponent.$.ctx.updateUi();

    },
    onStart: function (cx, cy) {
        this.e = new this.eraser();
        this.e.resetPicking();
        this.e.setupPicking();
        this.e.start(cx, cy);
    },
    onMove: function (cx, cy) {
        this.e.move(cx, cy);
    },
    onEnd: function () {
        this.e.end();
        this.e.resetPicking();
    }
}

export { erase }