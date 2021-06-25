import * as THREE from "three";
import { scene, renderer, camera, vm } from "../App.vue";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { mirror } from "./mirror.js"
import { erase } from "./erase.js"
import { MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { startAnimating, stopAnimating, loop } from "./animate.js"
import { undoManager, undoRedoComponent } from "./UndoRedo.vue"

let select = {
    s: undefined,
    dragged: false,
    transformMode: "translate",
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
            this.undoRedoSelection = new Array();
            this.undoRedoMatrix = undefined;
            this.selector = new select.vertexSelection()
            this.helper = undefined;
            this.controls = undefined;
            this.group;
            this.raycaster = new THREE.Raycaster();
            this.raycaster.params.Line.threshold = 0.05;
            this.raycaster.layers.set(1);
            this.color = "red";
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
                console.log(cx, cy)
            }
        }
        end(tx, ty) {
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
        select(selection, matrix) {

            //this.undoRedoMatrix = undefined;

            this.select_internal(selection, matrix)

            let previouslySelected = this.undoRedoSelection;
            //let originalMatrix = this.undoRedoMatrix;
            this.selected.forEach(object => {
                previouslySelected.push(object.uuid)
            })

            undoManager.add({
                undo: function () {
                    console.log("undoing select")
                    select.s.deselect();
                    renderer.render(scene, camera);
                },
                redo: function () {
                    console.log("redoing select")
                    let selection = [];
                    previouslySelected.forEach(uuid => {
                        selection.push(scene.getObjectByProperty(
                            "uuid",
                            uuid
                        ))
                    })
                    select.s.select(selection);
                    renderer.render(scene, camera);
                }
            });
            undoRedoComponent.$.ctx.updateUi();

            this.selected = new Array();
        }
        select_internal(selection, matrix) {
            //selection can not be zero so it's either 1 or more than 1
            //It's a single element
            if (selection.length == 1) {
                this.toggleSelectionColor(selection[0], true);
                this.controls = new TransformControls(camera, document.getElementById("app"));
                this.controls.mode = select.transformMode;
                this.controls.attach(selection[0]);
                this.controls.addEventListener("mouseDown", function () {
                    startAnimating();
                    var position = new THREE.Vector3();
                    this.object.getWorldPosition(position);
                    var quaternion = new THREE.Quaternion();
                    this.object.getWorldQuaternion(quaternion);
                    var scale = new THREE.Vector3();
                    this.object.getWorldScale(scale);
                    this.userData.startingTransform = {
                        position: position,
                        quaternion: quaternion,
                        scale: scale
                    }

                    vm.$.ctx.setTransformToolbarDisplay(false);

                })
                this.controls.addEventListener("change", function () {
                    if (!loop) {
                        select.s.helper.update();
                        renderer.render(scene, camera);
                    }
                })
                this.controls.addEventListener("objectChange", function () {
                    mirror.updateMirrorOf(this.object, scene);
                    select.s.helper.update();
                });
                this.controls.addEventListener("mouseUp", function () {
                    stopAnimating();
                    var endPosition = new THREE.Vector3();
                    this.object.getWorldPosition(endPosition);
                    var endQuaternion = new THREE.Quaternion();
                    this.object.getWorldQuaternion(endQuaternion);
                    var endScale = new THREE.Vector3();
                    this.object.getWorldScale(endScale);

                    let startPosition = this.userData.startingTransform.position;
                    let startQuaternion = this.userData.startingTransform.quaternion;
                    let startScale = this.userData.startingTransform.scale;

                    if (!startPosition.equals(endPosition) || !startQuaternion.equals(endQuaternion) || !startScale.equals(endScale)) {
                        undoManager.add({
                            undo: function () {
                                select.s.controls.object.position.copy(startPosition);
                                select.s.controls.object.quaternion.copy(startQuaternion);
                                select.s.controls.object.scale.copy(startScale);
                                select.s.helper.update();
                                vm.$.ctx.setTransformToolbarDisplay(true)
                                let transfromToolbarPosition = select.s.calculateTransfromToolbarPosition();
                                vm.$.ctx.setTransformToolbarPosition({
                                    left: transfromToolbarPosition.x,
                                    top: transfromToolbarPosition.y,
                                    location: transfromToolbarPosition.location,
                                })
                                select.s.helper.update();
                                renderer.render(scene, camera);
                            },
                            redo: function () {
                                select.s.controls.object.position.copy(endPosition);
                                select.s.controls.object.quaternion.copy(endQuaternion);
                                select.s.controls.object.scale.copy(endScale)
                                select.s.helper.update();
                                vm.$.ctx.setTransformToolbarDisplay(true)
                                let transfromToolbarPosition = select.s.calculateTransfromToolbarPosition();
                                vm.$.ctx.setTransformToolbarPosition({
                                    left: transfromToolbarPosition.x,
                                    top: transfromToolbarPosition.y,
                                    location: transfromToolbarPosition.location,
                                })
                                select.s.helper.update();
                                renderer.render(scene, camera);
                            }
                        });
                    }

                    vm.$.ctx.setTransformToolbarDisplay(true);
                    let position = select.s.calculateTransfromToolbarPosition();
                    vm.$.ctx.setTransformToolbarPosition({
                        left: position.x,
                        top: position.y,
                        location: position.location,
                    })
                    select.s.helper.update();

                    renderer.render(scene, camera);
                })
                this.helper = new THREE.BoxHelper(
                    selection[0],
                    new THREE.Color(this.color)
                );
                scene.add(this.controls);
                scene.add(this.helper);
                this.helper.geometry.computeBoundingBox();
                this.helper.update();
            }
            //It's a group
            else {
                this.group = new THREE.Group();
                scene.add(this.group);
                //we pass a matrix into the selection only to restore the group matrix properly on undo. This way worldTransformations can be applied in referse efficiently 
                if (matrix) {
                    this.group.applyMatrix4(matrix);
                    this.undoRedoMatrix = this.group.matrix
                } else {
                    this.undoRedoMatrix = this.group.matrix
                }
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
                this.controls = new TransformControls(camera, document.getElementById("app"));
                this.controls.mode = select.transformMode;
                this.controls.attach(this.group);
                this.controls.addEventListener("mouseDown", function () {
                    startAnimating();
                    var position = new THREE.Vector3();
                    this.object.getWorldPosition(position);
                    var quaternion = new THREE.Quaternion();
                    this.object.getWorldQuaternion(quaternion);
                    var scale = new THREE.Vector3();
                    this.object.getWorldScale(scale);

                    this.userData.startingTransform = {
                        position: position,
                        quaternion: quaternion,
                        scale: scale
                    }

                    vm.$.ctx.setTransformToolbarDisplay(false);

                })
                this.controls.addEventListener("change", function () {
                    if (!loop) {
                        select.s.helper.update();
                        renderer.render(scene, camera);
                    }
                })
                this.controls.addEventListener("objectChange", function () {
                    select.s.helper.update();
                    this.object.children.forEach((obj) => {
                        var position = new THREE.Vector3();
                        obj.getWorldPosition(position);
                        var quaternion = new THREE.Quaternion();
                        obj.getWorldQuaternion(quaternion);
                        var scale = new THREE.Vector3();
                        obj.getWorldScale(scale);
                        var selectedObj = scene.getObjectByProperty("uuid", obj.userData.uuid);
                        selectedObj.position.copy(position);
                        selectedObj.quaternion.copy(quaternion);
                        selectedObj.scale.copy(scale);
                        mirror.updateMirrorOf(selectedObj, scene);
                    });
                });
                this.controls.addEventListener("mouseUp", function () {
                    stopAnimating();

                    var endPosition = new THREE.Vector3();
                    this.object.getWorldPosition(endPosition);
                    var endQuaternion = new THREE.Quaternion();
                    this.object.getWorldQuaternion(endQuaternion);
                    var endScale = new THREE.Vector3();
                    this.object.getWorldScale(endScale);

                    let startPosition = this.userData.startingTransform.position;
                    let startQuaternion = this.userData.startingTransform.quaternion;
                    let startScale = this.userData.startingTransform.scale;

                    var delta = endQuaternion.clone().invert();
                    delta.multiply(startQuaternion);

                    if (!startPosition.equals(endPosition) || !startQuaternion.equals(endQuaternion) || !startScale.equals(endScale)) {

                        //There is a problem when we are coming back from a deselect because the object position, scale, quaternion is reset. I think it's possible to adjust these to be deltas
                        undoManager.add({
                            undo: function () {

                                select.s.controls.object.position.copy(startPosition);
                                select.s.controls.object.quaternion.copy(startQuaternion);
                                select.s.controls.object.scale.copy(startScale);

                                select.s.helper.update();

                                vm.$.ctx.setTransformToolbarDisplay(true)
                                let transfromToolbarPosition = select.s.calculateTransfromToolbarPosition();
                                vm.$.ctx.setTransformToolbarPosition({
                                    left: transfromToolbarPosition.x,
                                    top: transfromToolbarPosition.y,
                                    location: transfromToolbarPosition.location,
                                })

                                select.s.helper.update();

                                select.s.controls.object.children.forEach((obj) => {
                                    var position = new THREE.Vector3();
                                    obj.getWorldPosition(position);
                                    var quaternion = new THREE.Quaternion();
                                    obj.getWorldQuaternion(quaternion);
                                    var scale = new THREE.Vector3();
                                    obj.getWorldScale(scale);
                                    var selectedObj = scene.getObjectByProperty("uuid", obj.userData.uuid);
                                    selectedObj.position.copy(position);
                                    selectedObj.quaternion.copy(quaternion);
                                    selectedObj.scale.copy(scale);
                                    mirror.updateMirrorOf(selectedObj, scene);
                                });

                                renderer.render(scene, camera);
                            },
                            redo: function () {
                                select.s.controls.object.position.copy(endPosition);
                                select.s.controls.object.quaternion.copy(endQuaternion);
                                select.s.controls.object.scale.copy(endScale)

                                select.s.helper.update();

                                vm.$.ctx.setTransformToolbarDisplay(true)
                                let transfromToolbarPosition = select.s.calculateTransfromToolbarPosition();
                                vm.$.ctx.setTransformToolbarPosition({
                                    left: transfromToolbarPosition.x,
                                    top: transfromToolbarPosition.y,
                                    location: transfromToolbarPosition.location,
                                })

                                select.s.helper.update();

                                select.s.controls.object.children.forEach((obj) => {
                                    var position = new THREE.Vector3();
                                    obj.getWorldPosition(position);
                                    var quaternion = new THREE.Quaternion();
                                    obj.getWorldQuaternion(quaternion);
                                    var scale = new THREE.Vector3();
                                    obj.getWorldScale(scale);
                                    var selectedObj = scene.getObjectByProperty("uuid", obj.userData.uuid);
                                    selectedObj.position.copy(position);
                                    selectedObj.quaternion.copy(quaternion);
                                    selectedObj.scale.copy(scale);
                                    mirror.updateMirrorOf(selectedObj, scene);
                                });

                                renderer.render(scene, camera);
                            }
                        });
                    }

                    vm.$.ctx.setTransformToolbarDisplay(true)
                    let transfromToolbarPosition = select.s.calculateTransfromToolbarPosition();
                    vm.$.ctx.setTransformToolbarPosition({
                        left: transfromToolbarPosition.x,
                        top: transfromToolbarPosition.y,
                        location: transfromToolbarPosition.location,
                    })
                    select.s.helper.update();

                    renderer.render(scene, camera);
                })
                scene.add(this.controls);
                this.helper = new THREE.BoxHelper(
                    this.group,
                    new THREE.Color(this.color)
                );
                scene.add(this.helper);
                this.helper.geometry.computeBoundingBox();
                this.helper.update();
            }

            vm.$.ctx.setTransformToolbarDisplay(true)
            let position = this.calculateTransfromToolbarPosition();
            vm.$.ctx.setTransformToolbarPosition({
                left: position.x,
                top: position.y,
                location: position.location,
            })
            this.helper.update();
            renderer.render(scene, camera)

        }
        toggleSelectionColor(object, bool) {
            if (bool) {
                object.material.color = new THREE.Color(this.color);
            } else {
                object.userData.stroke != false ? object.material.color = new THREE.Color(object.userData.stroke.color) : '';
            }
        }
        deselect() {
            if (this.controls != undefined) {

                this.deselect_internal();

                let previouslySelected = this.undoRedoSelection;
                this.selected.forEach(object => {
                    previouslySelected.push(object.uuid)
                })
                let previousMatrix = this.undoRedoMatrix;

                //TODO: deselect should update setTransformationToolbar on its own
                undoManager.add({
                    undo: function () {
                        console.log("undoing deselect")
                        let selection = [];
                        previouslySelected.forEach(uuid => {
                            selection.push(scene.getObjectByProperty(
                                "uuid",
                                uuid
                            ))
                        })
                        select.s = new select.selection();
                        select.s.select(selection, previousMatrix);
                        renderer.render(scene, camera);
                    },
                    redo: function () {

                        console.log("redo deselect")

                        select.s.deselect()
                        renderer.render(scene, camera);
                    }
                });

                undoRedoComponent.$.ctx.updateUi();

                renderer.render(scene, camera)
            }
        }
        deselect_internal() {
            switch (true) {
                case this.controls.object.type == "Mesh":
                    this.undoRedoSelection = new Array();
                    this.undoRedoSelection.push(this.controls.object.uuid); //for undo
                    this.toggleSelectionColor(this.controls.object, false);
                    //clear references to controls and helper
                    scene.remove(this.controls);
                    scene.remove(this.helper);
                    this.controls.detach();
                    this.controls.dispose();
                    this.controls = undefined;
                    this.helper = undefined;
                    break;
                case this.controls.object.type == "Group":
                    this.undoRedoSelection = new Array();
                    this.undoRedoMatrix = this.controls.object.matrix;
                    this.controls.object.children.forEach;
                    for (var i = 0; i < this.controls.object.children.length; i++) {
                        this.undoRedoSelection.push(this.controls.object.children[i].userData.uuid)
                        this.toggleSelectionColor(this.controls.object.children[i], false);
                    }
                    scene.remove(this.group);
                    //clear references to controls and helper
                    scene.remove(this.controls);
                    scene.remove(this.helper);
                    this.controls.detach();
                    this.controls.dispose();
                    this.controls = undefined;
                    this.helper = undefined;
                    break;
                default:
                //do nothing, nothing is selected
            }
            vm.$.ctx.setTransformToolbarDisplay(false)
        }
        duplicate() {
            let duplicateArray = new Array();
            let previousSelectedArray = new Array();
            let transformMatrix = undefined;

            switch (true) {
                case this.controls.object.type == "Mesh":
                    previousSelectedArray.push(this.controls.object.uuid);
                    var duplicate = this.controls.object.clone();
                    console.log(duplicate.userData.stroke)
                    var duplicateMaterial = new MeshLineMaterial({
                        lineWidth: duplicate.userData.stroke.show_stroke ? duplicate.userData.stroke.lineWidth : 0.005,
                        sizeAttenuation: 1,
                        color: duplicate.userData.stroke.show_stroke ? duplicate.userData.stroke.color : 0xFFFFFF,
                        transparent: duplicate.userData.stroke.show_stroke ? false : true,
                        opacity: duplicate.userData.stroke.show_stroke ? 1 : 0,
                        side: THREE.DoubleSide,
                        fog: false,
                    });
                    duplicate.material = duplicateMaterial;
                    scene.add(duplicate);
                    duplicate.raycast = MeshLineRaycast;
                    if (duplicate.userData.mirrorAxis) {
                        mirror.object(duplicate, duplicate.userData.mirrorAxis, scene);
                    }
                    duplicateArray.push(duplicate);
                    this.deselect_internal();
                    this.select_internal(duplicateArray);
                    break;
                case this.controls.object.type == "Group":
                    transformMatrix = this.controls.object.matrix;

                    this.controls.object.children.forEach((object) => {
                        //Here we are picking the original hidden object that we use for working around the grouping and ungrouping issues
                        let originalObject = scene.getObjectByProperty("uuid", object.userData.uuid);
                        previousSelectedArray.push(object.userData.uuid);

                        var duplicate = originalObject.clone();
                        duplicate.layers.set(1);
                        var duplicateMaterial = new MeshLineMaterial({
                            lineWidth: duplicate.userData.stroke.show_stroke ? duplicate.userData.stroke.lineWidth : 0.005,
                            sizeAttenuation: 1,
                            color: duplicate.userData.stroke.show_stroke ? duplicate.userData.stroke.color : 0xFFFFFF,
                            transparent: duplicate.userData.stroke.show_stroke ? false : true,
                            opacity: duplicate.userData.stroke.show_stroke ? 1 : 0,
                            side: THREE.DoubleSide,
                            fog: false,
                        });
                        duplicate.material = duplicateMaterial;
                        duplicate.raycast = MeshLineRaycast;
                        duplicateArray.push(duplicate);
                        scene.add(duplicate);
                        if (duplicate.userData.mirrorAxis) {
                            mirror.object(duplicate, duplicate.userData.mirrorAxis, scene);
                        }
                    });
                    //deselect selected group
                    this.deselect_internal();

                    this.selected = duplicateArray;
                    this.selected.forEach((element) => {
                        this.toggleSelectionColor(element, true);
                    });
                    this.select_internal(this.selected);
                    this.helper.update();
                    mirror.updateMirrorOf(this.group, scene);
                    break;
                default:
                //do nothing, nothing is selected
            }

            this.undoRedoSelection = new Array();
            renderer.render(scene, camera)

            undoManager.add({
                undo: function () {
                    console.log("undoing duplicate")
                    //deselect the current selection
                    select.s.deselect_internal();
                    duplicateArray.forEach(object => {
                        erase.deleteObject(object)
                    })
                    let selection = [];
                    previousSelectedArray.forEach(uuid => {
                        selection.push(scene.getObjectByProperty(
                            "uuid",
                            uuid
                        ))
                    })
                    select.s = new select.selection();
                    select.s.select_internal(selection, transformMatrix);
                    renderer.render(scene, camera);
                },
                redo: function () {

                    console.log("redoing duplicate")

                    select.s.duplicate();
                    renderer.render(scene, camera);
                }
            });
        }
        calculateTransfromToolbarPosition() {

            //find the center 
            let position = this.helper.geometry.boundingSphere.center;
            position = position.project(camera);

            //find the min and max vertical distance
            let buffArray = this.helper.geometry.attributes.position.array;
            let vectors = [];
            for (let i = 0; i < buffArray.length; i = i + 3) {
                vectors.push(new THREE.Vector3().fromArray(buffArray, i));
            }
            let vectorsY = [];
            vectors.forEach(v => {
                v.project(camera);
                let y = (-(v.y - 1) * window.innerHeight) / 2;
                vectorsY.push(y)
            });
            let minY = Math.min(...vectorsY);
            let maxY = Math.max(...vectorsY);

            let location;

            if (
                this.controls.children[0].gizmo.translate.children[5].visible
            ) {
                position.y = maxY;
                location = "below";
            } else {
                position.y = minY;
                location = "above";
            }

            return {
                x: ((position.x + 1) * window.innerWidth) / 2,
                y: position.y,
                location: location
            }
        }
        cancel() {
            this.s = undefined;
            return;
        }
    },
    transforming: function () {
        if (this.s != undefined) {
            if (this.s.controls === undefined) {
                return false
            } else {
                if (this.s.controls.axis == null && this.s.controls.dragging == false && this.dragged == false) {
                    return false
                } else {
                    return true
                }
            }
        } else {
            return false
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
    },
    onCancel: function () {
        this.s ? this.s.cancel() : null;
    }
}

export { select }