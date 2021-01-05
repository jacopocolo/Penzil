import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/controls/TransformControls.js";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "three.meshline";
import { scene, drawingScene, renderer, camera } from "../App.vue";
import { mirror } from "./mirror.js"

let line = {
    l: undefined,
    uuid: null,
    draw: class {
        constructor() {
            this.line = new MeshLine();
            this.geometry = new THREE.Geometry();
            this.material = new MeshLineMaterial({
                lineWidth: 0.01,
                // sizeAttenuation: 1,
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
        end(mirrorOn) {

            scene.add(this.mesh);
            drawingScene.clear();
            renderer.autoClear = true;
            renderer.render(scene, camera);

            this.mesh.geometry.verticesNeedsUpdate = true;
            renderer.render(scene, camera);

            this.mesh.position.set(
                this.mesh.geometry.boundingSphere.center.x,
                this.mesh.geometry.boundingSphere.center.y,
                this.mesh.geometry.boundingSphere.center.z
            );
            renderer.render(scene, camera);

            this.mesh.geometry.geometry.center();
            renderer.render(scene, camera);
            this.setGeometry("tail");
            renderer.render(scene, camera);
            this.mesh.geometry.needsUpdate = true;
            renderer.render(scene, camera);

            console.log(this.mesh)

            this.mesh.geometry.points.forEach(element => {
                const geometry = new THREE.SphereGeometry(0.01, 3, 3);
                const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
                const sphere = new THREE.Mesh(geometry, material);
                sphere.position.set(element.x, element.y, element.z)
                scene.add(sphere);
            });

            console.log(mirrorOn)
            // switch (mirrorOn) {
            //     case "x":
            //         mirror.object(this.mesh, "x", scene);
            //         break;
            //     case "y":
            //         mirror.object(this.mesh, "y", scene);
            //         break;
            //     case "z":
            //         mirror.object(this.mesh, "z", scene);
            //         break;
            //     default:
            //     //it's false, do nothing
            // }
            // this.mesh.matrixAutoUpdate = false;

            let helper = new THREE.BoxHelper(
                this.mesh,
                new THREE.Color(0x000000)
            );
            scene.add(helper);

            let transformControls = new TransformControls(camera, document.getElementById("app"));

            transformControls.addEventListener("change", function () {
                renderer.render(scene, camera)
            });
            transformControls.addEventListener("objectChange", function () {
                transformControls.object.updateMatrix();
                helper.update();
            });

            transformControls.attach(this.mesh);
            transformControls.setMode("rotate")
            scene.add(transformControls);

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

                // this.mesh.geometry.geometry.verticesNeedsUpdate = true;

                // this.mesh.position.set(
                //     this.mesh.geometry.boundingSphere.center.x,
                //     this.mesh.geometry.boundingSphere.center.y,
                //     this.mesh.geometry.boundingSphere.center.z
                // );
                // this.mesh.updateMatrix();
                // this.mesh.geometry.geometry.center();
                // //this.mesh.updateMatrix();
                // this.setGeometry("tail");
                // this.mesh.geometry.geometry.needsUpdate = true;

                // if (this.mesh.userData.mirror) {
                //     this.mirror.updateMirrorOf(this.mesh);
                // }
            }
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
    },
    fromVertices(vertices, mirrorOn) {
        this.l = new this.draw();
        scene.add(this.l.mesh)
        // this.l.material.color = lineColor;
        // this.l.material.lineWidth = lineWidth;
        for (let i = 0; i < vertices.length; i++) {
            let v3 = new THREE.Vector3(vertices[i].x, vertices[i].y, vertices[i].z);
            let force = vertices[i].w;
            this.l.mesh.geometry.userData.force.push(force);
            this.l.mesh.geometry.userData.points.push(v3);
        }
        this.l.setGeometry("mouseup");

        switch (mirrorOn) {
            case "x":
                mirror.object(this.l, "x", scene);
                break;
            case "y":
                mirror.object(this.l, "y", scene);
                break;
            case "z":
                mirror.object(this.l, "z", scene);
                break;
            default:
            //it's false, do nothing
        }

        return scene.getObjectByProperty("uuid", this.l.uuid);
    }
}

export { line }