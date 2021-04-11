// {
//     vertices: [],
//     stroke: { show_stroke: true, force: [0], color: 'red', width: 3 },
//     fill: { show_fill: false, color: 'black' },
//   }

import * as THREE from "three";
import { Earcut } from 'three/src/extras/Earcut.js';
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { scene, drawingScene, renderer, camera } from "../App.vue";
import { erase } from "./erase.js"
import { mirror } from "./mirror.js"
import { undoManager, undoRedoComponent } from "./UndoRedo.vue"

let draw = {
    l: undefined,
    draw: class {
        constructor(stroke, fill) {

            this.stroke = stroke;
            this.line = new MeshLine();
            this.geometry = new THREE.BufferGeometry();
            this.vertices = new Float32Array([]);
            this.geometry.setAttribute("position", new THREE.BufferAttribute(this.vertices, 3));
            this.material = new MeshLineMaterial({
                lineWidth: this.stroke.show_stroke ? this.stroke.lineWidth : 0.005,
                sizeAttenuation: 1,
                color: this.stroke.show_stroke ? this.stroke.color : 0xFFFFFF,
                side: THREE.DoubleSide,
                fog: false,
                wireframe: false,
                transparent: this.stroke.show_stroke ? false : true,
                opacity: !this.stroke.show_stroke ? 1 : 1,
            });
            this.mesh = new THREE.Mesh(this.line, this.material);
            this.uuid = this.mesh.uuid;
            // this.line.userData.points = new Array();
            // this.line.userData.force = new Array();

            this.mesh.raycast = MeshLineRaycast;
            this.mesh.layers.set(1);
            this.bufferPoints = new Array();
            this.size = 8;

            this.mesh.userData.vertices = new Array();
            this.mesh.userData.stroke = { show_stroke: stroke.show_stroke, color: stroke.color, lineWidth: stroke.lineWidth };
            this.mesh.userData.stroke.force = new Array();
            this.mesh.userData.fill = { show_fill: fill.show_fill, color: fill.color };

            this.fill = fill;
            this.fillGeometry = new THREE.BufferGeometry();
            this.fillVertices = new Float32Array([]);
            this.fillGeometry.setAttribute("position", new THREE.BufferAttribute(this.fillVertices, 3));
            this.triangles = new THREE.BufferAttribute(new Uint16Array(Earcut.triangulate(this.fillGeometry.attributes.position.array, null, 3)), 1);
            this.fillGeometry.setIndex(this.triangles);
            this.fillMaterial = new THREE.MeshBasicMaterial({
                color: this.fill.color,
                side: THREE.DoubleSide,
                wireframe: false,
                polygonOffset: this.stroke ? true : false,
                polygonOffsetFactor: 10,
                polygonOffsetUnits: 4,
                transparent: this.fill.show_fill ? true : false,
                opacity: this.fill.show_fill ? 0.05 : 0,
            });
            this.fillMesh = new THREE.Mesh(this.fillGeometry, this.fillMaterial);
            this.fillMesh.layers.set(1);
        }
        start(x, y, z, force, unproject, mirrorOn) {
            drawingScene.add(this.mesh);

            if (this.fill.show_fill) {
                this.mesh.add(this.fillMesh)
            }

            switch (mirrorOn) {
                case "x":
                    mirror.object(this.mesh, "x", drawingScene);
                    break;
                case "y":
                    mirror.object(this.mesh, "y", drawingScene);
                    break;
                case "z":
                    mirror.object(this.mesh, "z", drawingScene);
                    break;
                default:
                //it's false, do nothing
            }
            console.log(x, y, z, unproject, force)
            // var v3 = new THREE.Vector3(x, y, z);
            // if (unproject) {
            //     v3.unproject(camera);
            //     this.fillShape.moveTo(v3.x, v3.y)
            // } else {
            //     this.fillShape.moveTo(v3.x, v3.y)
            // }

        }
        move(x, y, z, force, unproject) {
            this.addVertex(x, y, z, force, unproject)
        }
        end_internal(mirrorOn) {
            scene.add(this.mesh);
            drawingScene.clear();
            renderer.autoClear = true;
            renderer.render(scene, camera);

            this.geometry.verticesNeedsUpdate = true;
            this.stroke.show_stroke ? '' : this.mesh.material.opacity = 0;
            this.fill.show_fill ? this.fillMesh.material.transparent = false : '';
            this.fill.show_fill ? this.fillMesh.material.opacity = 1 : '';
            renderer.render(scene, camera);

            this.mesh.position.set(
                this.mesh.geometry.boundingSphere.center.x,
                this.mesh.geometry.boundingSphere.center.y,
                this.mesh.geometry.boundingSphere.center.z
            );
            renderer.render(scene, camera);

            this.geometry.center();
            renderer.render(scene, camera);
            this.setGeometry("tail");
            renderer.render(scene, camera);
            this.geometry.needsUpdate = true;
            renderer.render(scene, camera);

            switch (mirrorOn) {
                case "x":
                    mirror.object(this.mesh, "x", scene);
                    break;
                case "y":
                    mirror.object(this.mesh, "y", scene);
                    break;
                case "z":
                    mirror.object(this.mesh, "z", scene);
                    break;
                default:
                //it's false, do nothing
            }

            renderer.render(scene, camera);

            let vert = this.geometry.attributes.position.array;
            this.fillGeometry.setAttribute('position', new THREE.BufferAttribute(vert, 3));
            let triangles = new THREE.BufferAttribute(new Uint16Array(Earcut.triangulate(this.fillGeometry.attributes.position.array, null, 3)), 1);
            this.fillGeometry.setIndex(triangles);
            this.fillGeometry.computeBoundingSphere();
            renderer.render(scene, camera);
        }
        end(mirrorOn) {

            this.end_internal(mirrorOn);

            let uuid = this.uuid;
            let vertices = this.geometry.attributes.position.array;
            let stroke = this.mesh.userData.stroke;
            let fill = this.mesh.userData.fill;
            let position = new THREE.Vector3();
            this.mesh.getWorldPosition(position);
            let quaternion = new THREE.Quaternion();
            this.mesh.getWorldQuaternion(quaternion);
            let scale = new THREE.Vector3();
            this.mesh.getWorldScale(scale);

            let matrix = this.mesh.matrix;

            undoManager.add({
                undo: function () {
                    erase.deleteObject(scene.getObjectByProperty(
                        "uuid",
                        uuid
                    ))
                    renderer.render(scene, camera);
                },
                redo: function () {
                    draw.fromVertices(
                        vertices,
                        stroke,
                        fill,
                        mirrorOn,
                        uuid,
                        //true
                        position,
                        quaternion,
                        scale,
                        matrix
                    );
                }
            });

            undoRedoComponent.$.ctx.updateUi();

        }
        addVertex(x, y, z, force, unproject) {
            var v3 = new THREE.Vector3(x, y, z);
            if (unproject) {
                v3.unproject(camera);
            }
            var v4 = new THREE.Vector4(v3.x, v3.y, v3.z, force);

            if (unproject) {
                this.appendToBuffer(v4);
                let pt = this.getAveragePoint(0);
                if (pt) {
                    //stroke
                    this.mesh.userData.stroke.force.push(pt.w);

                    this.geometry.attributes.position.array = this.Float32Concat(this.geometry.attributes.position.array, new Float32Array([pt.x, pt.y, pt.z]));
                    this.geometry.attributes.position.count = this.geometry.attributes.position.count + 3
                    this.geometry.attributes.position.needsUpdate = true;

                    if (this.geometry.attributes.position.count > 3 && this.fill != false) {
                        let vert = this.geometry.attributes.position.array;
                        this.fillGeometry.setAttribute('position', new THREE.BufferAttribute(vert, 3));
                        this.fillGeometry.attributes.position.needsUpdate = true;
                        this.fillGeometry.computeBoundingSphere();

                        let triangles = new THREE.BufferAttribute(new Uint16Array(Earcut.triangulate(this.fillGeometry.attributes.position.array, null, 3)), 1);
                        this.fillGeometry.index = triangles;
                        this.fillGeometry.index.needsUpdate = true;

                        this.fillGeometry.needsUpdate = true;
                    }

                    // this.fillGeometry.setIndex(triangles);

                    // this.fillGeometry.attributes.position.array = this.Float32Concat(this.fillGeometry.attributes.position.array, new Float32Array([pt.x, pt.y, pt.z]));
                    // this.fillGeometry.attributes.position.count = this.fillGeometry.attributes.position.count + 3;
                    // this.fillGeometry.attributes.position.needsUpdate = true;

                    // this.triangles = new THREE.BufferAttribute(new Uint16Array(Earcut.triangulate(this.fillGeometry.attributes.position.array, null, 3)), 1);
                    // this.fillGeometry.setIndex(this.triangles);
                    // console.log(this.fillGeometry)
                    // this.fillGeometry.computeBoundingSphere();
                }
            } else {
                this.mesh.userData.stroke.force.push(force);
                this.geometry.attributes.position.array = this.Float32Concat(this.geometry.attributes.position.array, new Float32Array([v3.x, v3.y, v3.z]));
                this.geometry.attributes.position.count = this.geometry.attributes.position.count + 3
                this.geometry.attributes.position.needsUpdate = true;

            }
            this.setGeometry();
            renderer.autoClear = false;
            renderer.clearDepth();
            renderer.render(drawingScene, camera);
        }
        Float32Concat(first, second) {
            var firstLength = first.length,
                result = new Float32Array(firstLength + second.length);

            result.set(first);
            result.set(second, firstLength);

            return result;
        }
        appendToBuffer(pt) {
            this.bufferPoints.push(pt);
            while (this.bufferPoints.length > this.size) {
                this.bufferPoints.shift();
            }
        }
        getAveragePoint(offset) {
            var len = this.bufferPoints.length;
            if (len % 2 === 1 || len >= this.size) {
                var totalX = 0;
                var totalY = 0;
                var totalZ = 0;
                var totalW = 0;
                var pt, i;
                var count = 0;
                for (i = offset; i < len; i++) {
                    count++;
                    pt = this.bufferPoints[i];
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
        }
        setGeometry(end) {
            this.line.setPoints(
                this.geometry.attributes.position.array,
                (p) => {
                    let length = this.geometry.attributes.position.array.length / 3;
                    let force = this.mesh.userData.stroke.force;
                    function map(n, start1, stop1, start2, stop2) {
                        return (
                            ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
                        );
                    }
                    let index = Math.round(p * (length - 1));
                    let minWidth = 0;
                    let baseWidth = 3;
                    let width = force[index] * 16;
                    let tailLength = 3;

                    //Beginning of the line
                    if (index < tailLength) {
                        return map(
                            index,
                            minWidth,
                            tailLength,
                            minWidth,
                            baseWidth + width
                        ); //+ width
                    }
                    //End of the line
                    else if (index > length - tailLength && end == "tail") {
                        return map(
                            index,
                            length - tailLength,
                            length - 1,
                            baseWidth + width,
                            minWidth
                        );
                    }
                    //bulk of the line
                    else {
                        return baseWidth + width;
                    }
                }
            );
        }
        cancel() {
            drawingScene.remove(this.mesh);
            mirror.eraseMirrorOf(this.mesh);
            this.mesh.material.dispose();
            draw.l = undefined;
            draw.l = new draw.draw();
            drawingScene.clear();
            renderer.render(drawingScene, camera);
            renderer.autoClear = true;
            renderer.render(scene, camera);
        }
    },
    onStart: function (x, y, z, force, unproject, mirrorOn, stroke, fill) {
        //this draw acceppts two arguments: stroke and fill. stroke: { show_stroke: bool, color: 'red', lineWidth: 3 }, fill: { show_fill: bool, color: 'black' },
        //I should gate the possibility of drawing something without stroke or fill
        this.l = new this.draw(stroke, fill);
        this.l.start(mirrorOn);
    },
    onMove: function (x, y, z, force, unproject) {
        this.l.move(x, y, z, force, unproject);
    },
    onEnd: function (mirrorOn) {
        this.l.end(mirrorOn);
    },
    onEnd_internal: function (mirrorOn) {
        this.l.end_internal(mirrorOn);
    },
    onCancel: function () {
        this.l ? this.l.cancel() : null;
    },
    fromVertices(vertices, stroke, fill, mirrorOn, uuid, position, quaternion, scale, matrix) {
        this.l = new this.draw(stroke, fill);
        this.onStart(0, 0, 0, 0, false, mirrorOn, stroke, fill);
        console.log(this.l.geometry.attributes.position.array)
        this.l.geometry.attributes.position.array = vertices;
        this.l.geometry.attributes.position.count = vertices.length / 3;
        this.l.geometry.attributes.position.needsUpdate = true;
        this.l.mesh.userData.stroke.force = stroke.force;
        this.l.setGeometry();
        renderer.autoClear = false;
        renderer.clearDepth();
        renderer.render(drawingScene, camera);
        if (uuid) { this.l.mesh.uuid = uuid; }
        this.onEnd_internal(mirrorOn);
        if (matrix) {
            this.l.mesh.applyMatrix4(matrix)
        }
        if (position) {
            this.l.mesh.position.set(
                position.x,
                position.y,
                position.z
            );
        }
        if (quaternion) {
            this.l.mesh.quaternion.set(
                quaternion._x,
                quaternion._y,
                quaternion._z,
                quaternion._w
            );
        }
        if (scale) {
            this.l.mesh.scale.set(
                scale.x,
                scale.y,
                scale.z
            );
        }
        scene.add(this.l.mesh)
        renderer.render(scene, camera)
    }
}

export { draw }