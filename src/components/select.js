import * as THREE from "three";
import { scene, renderer, camera, context } from "../App.vue";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { mirror } from "./mirror.js"

let controls;
let helper;

let select = {
    s: undefined,
    dragged: false,
    vertexSelection: class {
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
                    let boundingBoxPoints = this.getObjectBoundingBoxPoints(object)

                    // boundingBoxPoints.forEach((point) => {
                    //     const geometry = new THREE.SphereGeometry(0.1, 3, 3);
                    //     const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                    //     const sphere = new THREE.Mesh(geometry, material);
                    //     scene.add(sphere);
                    //     sphere.position.set(point.x, point.y, point.z)
                    // })
                    // renderer.render(scene, camera);

                    if (boundingBoxPoints != undefined) {
                        for (var j = boundingBoxPoints.length; j--;) {
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
                                //If even one point is inside of the selection, it's worth checking for all the vertices (points), otherwise not
                                for (var k = object.geometry.points.length; k--;) {
                                    let p = new THREE.Vector3(
                                        object.geometry.points[k].x,
                                        object.geometry.points[k].y,
                                        object.geometry.points[k].z
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
    },
    selection: class {
        constructor() {
            this.selected = new Array();
            this.selector = new select.vertexSelection()
            this.helper = undefined;
            this.controls = undefined;
            this.group;
            this.raycaster = new THREE.Raycaster();
            this.raycaster.params.Line.threshold = 0.05;
            this.raycaster.layers.set(1);
            this.color = "red";
        }
        transforming() {
            //have to figure out how to handle this
            if (scene.userData.controls != undefined) {
                return true
            } else {
                return false
            }
        }
        start(tx, ty, cx, cy) {
            this.raycaster.setFromCamera(new THREE.Vector2(tx, ty), camera);
            try {
                var intersectedObject = this.raycaster.intersectObjects(scene.children)[0].object;
                this.selected.push(intersectedObject);
            } catch (err) {
                //console.log(err)
                //expected error if nothing is found
            }
            this.selector.start.x = tx;
            this.selector.start.y = ty;
            this.selector.cssStart.x = cx;
            this.selector.cssStart.y = cy;
        }
        move(cx, cy) {
            if (this.selected.length == 0) {
                context.globalAlpha = 1;
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                context.beginPath();
                context.rect(
                    this.selector.cssStart.x,
                    this.selector.cssStart.y,
                    cx - this.selector.cssStart.x,
                    cy - this.selector.cssStart.y
                );
                // context.strokeStyle = getComputedStyle(
                //     document.documentElement
                // ).getPropertyValue("--accent-color-selected");
                context.lineWidth = 0.7;
                context.setLineDash([4, 4]);
                context.stroke();
            }
        }
        end(tx, ty) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            this.selector.end.x = tx;
            this.selector.end.y = ty;
            let objectsInRect = this.selector.select();

            try {
                objectsInRect.forEach((object) => {
                    this.selected.push(object);
                });
            } catch (err) {
                //console.log(err)
            }

            if (this.selected.length == 0) {
                return
            } else {
                this.select(this.selected);
            }
            renderer.render(scene, camera)
        }
        select(selection) {
            //selection can not be zero so it's either 1 or more than 1
            //It's a single element
            if (selection.length == 1) {
                scene.userData.helper = new THREE.BoxHelper(
                    selection[0],
                    new THREE.Color(this.color)
                );
                this.helper = scene.userData.helper;
                this.toggleSelectionColor(selection[0], true);

                scene.add(this.helper);
                //store the controls in the scene userData so the scene maintains a reference to them as long as they are needed
                scene.userData.controls = new TransformControls(camera, document.getElementById("app"));
                this.controls = scene.userData.controls;
                this.controls.attach(selection[0]);

                this.controls.addEventListener("change", function () {
                    renderer.render(scene, camera)
                })
                this.controls.addEventListener("objectChange", function () {
                    mirror.updateMirrorOf(scene.userData.controls.object, scene);
                    scene.userData.helper.update();
                    renderer.render(scene, camera)
                });
                this.helper.update();
                scene.add(this.controls);
            }
            //It's a group
            else {
                this.group = new THREE.Group();
                scene.add(this.group);
                scene.userData.helper = new THREE.BoxHelper(
                    this.group,
                    new THREE.Color(this.color)
                );
                this.helper = scene.userData.helper;
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
                });
                this.helper.update();
                scene.userData.controls = new TransformControls(camera, document.getElementById("app"));
                this.controls = scene.userData.controls;
                this.controls.attach(this.group);
                this.controls.addEventListener("change", function () {
                    renderer.render(scene, camera)
                })
                this.controls.addEventListener("objectChange", function () {
                    scene.userData.helper.update();
                    scene.userData.controls.object.children.forEach((obj) => {
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
                        mirror.updateMirrorOf(selectedObj, scene);
                        renderer.render(scene, camera)
                    });
                    renderer.render(scene, camera)
                });
                scene.add(this.controls);
            }
            this.selected = new Array();
        }
        toggleSelectionColor(object, bool) {
            if (bool) {
                object.material.color = new THREE.Color(this.color);
            } else {
                object.material.color = new THREE.Color(object.userData.lineColor);
            }
        }
        deselect() {
            if (scene.userData.controls != undefined) {

                switch (true) {
                    case scene.userData.controls.object.type == "Mesh":
                        this.toggleSelectionColor(scene.userData.controls.object, false);
                        //clear references to controls and helper
                        scene.remove(scene.userData.controls);
                        scene.remove(scene.userData.helper);
                        scene.userData.controls.detach();
                        delete scene.userData.controls;
                        delete scene.userData.helper;
                        break;
                    case scene.userData.controls.object.type == "Group":
                        for (var i = 0; i < scene.userData.controls.object.children.length; i++) {
                            this.toggleSelectionColor(scene.userData.controls.object.children[i], false);
                        }
                        scene.remove(this.group);
                        //clear references to controls and helper
                        scene.remove(scene.userData.controls);
                        scene.remove(scene.userData.helper);
                        scene.userData.controls.detach();
                        delete scene.userData.controls;
                        delete scene.userData.helper;
                        break;
                    default:
                    //do nothing, nothing is selected
                }

                renderer.render(scene, camera)
            }
        }
    },
    transforming: function () {
        if (scene.userData.controls === undefined) {
            return false
        } else {
            if (scene.userData.controls.axis == null && scene.userData.controls.dragging == false && this.dragged == false) {
                return false
            } else {
                return true
            }
        }
    },
    onStart: function (tx, ty, cx, cy) {
        if (this.transforming() == false) {
            if (this.s != undefined) {
                this.s.deselect();
            }
            this.s = new this.selection();
            this.s.start(tx, ty, cx, cy)
        }

    },
    onMove: function (cx, cy) {
        if (this.transforming() == false) {
            this.s.move(cx, cy)
        } else {
            this.dragged = true;
        }

    },
    onEnd: function (tx, ty) {
        if (this.transforming() == false) {
            this.s.end(tx, ty);
        }
        this.dragged = false;
    }
}

export { select }