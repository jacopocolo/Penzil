import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { scene, drawingScene, renderer, camera } from "../App.vue";

let line = {
    l: undefined,
    uuid: null,
    draw: class {
        constructor() {
            this.geometry = new THREE.Geometry();
            this.line = new MeshLine();
            this.material = new MeshLineMaterial({
                lineWidth: 0.01,
                sizeAttenuation: 1,
                color: new THREE.Color("black"),
                side: THREE.DoubleSide,
                fog: false,
            });
            this.mesh = new THREE.Mesh(this.line, this.material);
            this.mesh.matrixAutoUpdate = false;
            this.uuid = this.mesh.uuid;
            this.line.userData.points = new Array();
            this.line.userData.force = new Array();
            this.mesh.raycast = MeshLineRaycast;
            this.mesh.layers.set(1);
            this.bufferPoints = new Array();
            this.size = 4;
        }
        start() {
            //renderer.render(scene, camera);
            drawingScene.add(this.mesh);
            //renderer.render(drawingScene, camera);
            // switch (mirrorOn) {
            //   case "x":
            //     // mirror.object(mesh, "x");
            //     break;
            //   case "y":
            //     // mirror.object(mesh, "y");
            //     break;
            //   case "z":
            //     // mirror.object(mesh, "z");
            //     break;
            //   default:
            //   //it's false, do nothing
            // }
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
                    this.mesh.geometry.userData.points.push(v3);
                }
            } else {
                this.mesh.geometry.userData.force.push(force);
                this.mesh.geometry.userData.points.push.push(v3);
            }

            // const geometry = new THREE.SphereGeometry(0.01, 32, 32);
            // const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
            // const sphere = new THREE.Mesh(geometry, material);
            // scene.add(sphere);
            // sphere.position.set(v3.x, v3.y, v3.z);

            this.setGeometry();

            renderer.autoClear = false;
            renderer.clearDepth();
            renderer.render(drawingScene, camera);

        }
        end() {

            console.log("end")

            this.setGeometry("mouseup");
            scene.add(this.mesh)
            drawingScene.clear();

            console.log(scene);
            console.log(drawingScene);

            renderer.autoClear = true;
            renderer.render(scene, camera);
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
            this.mesh.geometry.setPoints(
                this.mesh.geometry.userData.points,
                (p) => {
                    let points = this.mesh.geometry.userData.points;
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

            if (end == "mouseup") {
                //   this.geometry.verticesNeedsUpdate = true;
                //   this.mesh.position.set(
                //     this.mesh.geometry.boundingSphere.center.x,
                //     this.mesh.geometry.boundingSphere.center.y,
                //     this.mesh.geometry.boundingSphere.center.z
                //   );
                //   this.geometry.center();
                this.setGeometry("tail");
                //   this.geometry.needsUpdate = true;
                //   // if (mesh.userData.mirror) {
                //   //   mirror.updateMirrorOf(mesh);
                //   // }
            }
        }
        // fromVertices(vertices, lineColor, lineWidth, mirrorOn, returnLineBool) {
        //   line.render.start(
        //     vertices[0].x,
        //     vertices[0].y,
        //     vertices[0].z,
        //     vertices[0].w,
        //     false,
        //     lineColor,
        //     lineWidth,
        //     mirrorOn
        //   );
        //   for (var i = 1; i < vertices.length; i++) {
        //     line.render.update(
        //       vertices[i].x,
        //       vertices[i].y,
        //       vertices[i].z,
        //       vertices[i].w,
        //       false
        //     );
        //   }
        //   var l = scene.getObjectByProperty("uuid", this.uuid);
        //   line.render.end();
        //   if (returnLineBool == true) {
        //     return l;
        //   }
        // }
    },
    onStart: function () {
        this.l = new this.draw();
        this.l.start();
    },
    onMove: function (x, y, z, force, unproject) {
        this.l.move(x, y, z, force, unproject);
    },
    onEnd: function () {
        this.l.end();
    },
}

export { line }