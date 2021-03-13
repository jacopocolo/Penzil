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
        constructor() {
            this.line = new MeshLine();
            this.geometry = new THREE.BufferGeometry();
            this.vertices = new Float32Array([]);
            this.geometry.setAttribute("position", new THREE.BufferAttribute(this.vertices, 3));
            this.material = new MeshLineMaterial({
                lineWidth: 0.01,
                sizeAttenuation: 1,
                color: new THREE.Color(0x51074a),
                side: THREE.DoubleSide,
                fog: false,
                wireframe: false
            });
            this.mesh = new THREE.Mesh(this.line, this.material);
            this.uuid = this.mesh.uuid;
            this.line.userData.points = new Array();
            this.line.userData.force = new Array();
            this.mesh.raycast = MeshLineRaycast;
            this.mesh.layers.set(1);
            this.mesh.userData.lineColor = new THREE.Color(0x51074a);
            this.bufferPoints = new Array();
            this.size = 4;

            this.fillGeometry = new THREE.BufferGeometry();
            this.fillVertices = new Float32Array([]);
            this.fillGeometry.setAttribute("position", new THREE.BufferAttribute(this.fillVertices, 3));
            this.triangles = new THREE.BufferAttribute(new Uint16Array(Earcut.triangulate(this.fillGeometry.attributes.position.array, null, 3)), 1);
            this.fillGeometry.setIndex(this.triangles);
            this.fillMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                side: THREE.DoubleSide,
                wireframe: false,
                polygonOffset: true,
                polygonOffsetFactor: 100,
                polygonOffsetUnits: 2
            });
            this.fill = new THREE.Mesh(this.fillGeometry, this.fillMaterial);
        }
        start(x, y, z, force, unproject, mirrorOn) {
            drawingScene.add(this.mesh);
            this.mesh.add(this.fill)

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
        end(mirrorOn) {
            scene.add(this.mesh);
            drawingScene.clear();
            renderer.autoClear = true;
            renderer.render(scene, camera);

            this.geometry.verticesNeedsUpdate = true;
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

            // this.fillGeometry.computeBoundingSphere();

            // let vert = this.geometry.attributes.position.array;
            // var fillGeometry = new THREE.BufferGeometry();
            // fillGeometry.setAttribute('position', new THREE.BufferAttribute(vert, 3));
            // let triangles = new THREE.BufferAttribute(new Uint16Array(Earcut.triangulate(fillGeometry.attributes.position.array, null, 3)), 1);
            // fillGeometry.setIndex(triangles);
            // var fillMaterial = new THREE.MeshBasicMaterial({
            //     color: 0xff0000,
            //     side: THREE.DoubleSide,
            //     polygonOffset: 5000,
            //     polygonOffsetFactor: 100,
            //     polygonOffsetUnits: 2
            // });
            // fillGeometry.computeBoundingSphere();
            // console.log(fillGeometry)
            // var mesh = new THREE.Mesh(fillGeometry, fillMaterial);
            // this.mesh.add(mesh);

            renderer.render(scene, camera);

            let uuid = this.uuid;
            let vertices = this.geometry.attributes.position.array;
            let force = this.mesh.geometry.userData.force;
            let width = this.material.lineWidth;
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
                    this.mesh.geometry.userData.force.push(pt.w);

                    this.geometry.attributes.position.array = this.Float32Concat(this.geometry.attributes.position.array, new Float32Array([pt.x, pt.y, pt.z]));
                    this.geometry.attributes.position.count = this.geometry.attributes.position.count + 3
                    this.geometry.attributes.position.needsUpdate = true;

                    if (this.geometry.attributes.position.count > 3) {

                        console.log("called")
                        //this.fillGeometry = new THREE.BufferGeometry();
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
                this.mesh.geometry.userData.force.push(force);
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
                    let force = this.mesh.geometry.userData.force;
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
    onStart: function (x, y, z, force, unproject, mirrorOn) {
        this.l = new this.draw();
        this.l.start(mirrorOn);
    },
    onMove: function (x, y, z, force, unproject) {
        this.l.move(x, y, z, force, unproject);
    },
    onEnd: function (mirrorOn) {
        this.l.end(mirrorOn);
    },
    onCancel: function () {
        this.l ? this.l.cancel() : null;
    },
    fromVertices(vertices, force, lineWidth, mirrorOn, uuid, position, quaternion, scale, matrix) {
        this.onStart(0, 0, 0, 0, false, mirrorOn);
        this.l.lineWidth = lineWidth;
        this.l.geometry.attributes.position.array = vertices;
        this.l.geometry.attributes.position.count = vertices.length / 3;
        this.l.geometry.attributes.position.needsUpdate = true;
        this.l.mesh.geometry.userData.force = force;
        this.l.setGeometry();
        renderer.autoClear = false;
        renderer.clearDepth();
        renderer.render(drawingScene, camera);
        this.onEnd(mirrorOn);
        this.l.mesh.uuid = uuid;
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