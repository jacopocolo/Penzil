import * as THREE from "three";

import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { scene, drawingScene, renderer, camera } from "../App.vue";
import { mirror } from "./mirror.js"
import { undoManager } from "./UndoRedo.vue"

let line = {
    l: undefined,
    draw: class {
        constructor() {
            this.line = new MeshLine();
            this.geometry = new THREE.Geometry();
            this.material = new MeshLineMaterial({
                lineWidth: 0.01,
                sizeAttenuation: 1,
                color: new THREE.Color("black"),
                side: THREE.DoubleSide,
                fog: false,
            });
            this.mesh = new THREE.Mesh(this.line, this.material);
            // this.mesh.matrixAutoUpdate = false;
            this.uuid = this.mesh.uuid;
            this.line.userData.points = new Array();
            this.line.userData.force = new Array();
            this.mesh.raycast = MeshLineRaycast;
            this.mesh.layers.set(1);
            this.mesh.userData.lineColor = new THREE.Color("black");
            this.bufferPoints = new Array();
            this.size = 4;
        }
        start(mirrorOn) {
            drawingScene.add(this.mesh);

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
        }
        move(x, y, z, force, unproject) {
            var v3 = new THREE.Vector3(x, y, z);
            if (unproject) {
                v3.unproject(camera);
            }
            var v4 = new THREE.Vector4(v3.x, v3.y, v3.z, force);
            if (unproject) {
                this.appendToBuffer(v4);
                let pt = this.getAveragePoint(0);
                if (pt) {
                    v3 = new THREE.Vector3(pt.x, pt.y, pt.z);
                    this.mesh.geometry.userData.force.push(pt.w);
                    this.geometry.vertices.push(v3);
                }
            } else {
                this.mesh.geometry.userData.force.push(force);
                this.geometry.vertices.push(v3);
            }
            this.setGeometry();
            renderer.autoClear = false;
            renderer.clearDepth();
            renderer.render(drawingScene, camera);
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

            let uuid = this.uuid;
            let vertices = this.geometry.vertices;
            let force = this.mesh.geometry.userData.force;
            let width = this.material.lineWidth;
            let position = this.mesh.position;
            let quaternion = this.mesh.quaternion;
            let scale = this.mesh.scale;

            undoManager.add({
                undo: function () {
                    console.log("deleting " + uuid)
                    scene.remove(scene.getObjectByProperty(
                        "uuid",
                        uuid
                    ));
                    renderer.render(scene, camera);
                },
                redo: function () {
                    console.log("redrawing " + uuid)
                    line.fromVertices(
                        vertices,
                        force,
                        //color,
                        width,
                        mirrorOn,
                        uuid,
                        //true
                        position,
                        quaternion,
                        scale
                    );
                }
            });

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
                this.geometry.vertices,
                (p) => {
                    let points = this.geometry.vertices;
                    let force = this.mesh.geometry.userData.force;
                    function map(n, start1, stop1, start2, stop2) {
                        return (
                            ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2
                        );
                    }
                    let index = Math.round(p * (points.length - 1));
                    let minWidth = 0;
                    let baseWidth = 3;
                    let width = force[index] * 16;
                    let tipLength = 5;

                    //Beginning of the line
                    if (index < tipLength) {
                        return map(
                            index,
                            minWidth,
                            tipLength,
                            minWidth,
                            baseWidth + width
                        ); //+ width
                    }
                    //End of the line
                    else if (index > points.length - tipLength && end == "tail") {
                        return map(
                            index,
                            points.length - tipLength,
                            points.length - 1,
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
    },
    onStart: function (mirrorOn) {
        this.l = new this.draw();
        this.l.start(mirrorOn);
    },
    onMove: function (x, y, z, force, unproject) {
        this.l.move(x, y, z, force, unproject);
    },
    onEnd: function (mirrorOn) {
        this.l.end(mirrorOn);
        console.log(this.l.uuid);
    },
    fromVertices(vertices, force, lineWidth, mirrorOn, uuid, position, quaternion, scale) {
        this.l = new this.draw();
        this.l.material.lineWidth = lineWidth;
        this.l.geometry.vertices = vertices;
        this.l.mesh.geometry.userData.force = force;
        this.l.mesh.uuid = uuid;

        switch (mirrorOn) {
            case "x":
                mirror.object(this.l.mesh, "x", scene);
                break;
            case "y":
                mirror.object(this.l.mesh, "y", scene);
                break;
            case "z":
                mirror.object(this.l.mesh, "z", scene);
                break;
            default:
            //It's false, do nothing
        }

        this.l.setGeometry();
        this.l.geometry.verticesNeedsUpdate = true;
        renderer.render(scene, camera);

        this.l.mesh.position.set(
            this.l.mesh.geometry.boundingSphere.center.x,
            this.l.mesh.geometry.boundingSphere.center.y,
            this.l.mesh.geometry.boundingSphere.center.z
        );
        renderer.render(scene, camera);

        this.l.geometry.center();
        renderer.render(scene, camera);
        this.l.setGeometry("tail");
        renderer.render(scene, camera);
        this.l.geometry.needsUpdate = true;
        renderer.render(scene, camera);

        this.l.mesh.position.set(
            position.x,
            position.y,
            position.z
        );
        this.l.mesh.quaternion.set(
            quaternion._x,
            quaternion._y,
            quaternion._z,
            quaternion._w
        );
        this.l.mesh.scale.set(
            scale.x,
            scale.y,
            scale.z
        );

        scene.add(this.l.mesh)
        renderer.render(scene, camera)
        //return this.l.mesh

    }
}

export { line }