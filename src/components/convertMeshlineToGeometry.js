import * as THREE from "three";
import { TubeBufferGeometry } from "./TubeGeometryWithVariableWidth.js";

export function convertMeshlineToGeometry(line) {
    let obj = line;
    let geometry = obj.geometry.clone();
    geometry.applyMatrix4(obj.matrix);
    let vertices = [];
    let points = Array.from(geometry.attributes.position.array);


    function map(n, start1, stop1, start2, stop2) {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    }

    for (let i = 0; i <= points.length; i = i + 6) {
        let v3 = new THREE.Vector3(
            points[i],
            points[i + 1],
            points[i + 2]
        );
        //why do I have 0,0,0 points in my positions? :thinking:
        if (v3.x != 0 && v3.y != 0 && v3.z != 0) {
            vertices.push(v3);
        }
    }


    let force = [0];
    for (let i = 0; i < obj.userData.stroke.force.length; i++) {
        let length = obj.userData.stroke.force.length;
        let minWidth = 0;
        let baseWidth = obj.userData.stroke.lineWidth * 2.5;

        //https://github.com/spite/THREE.MeshLine/blob/master/src/THREE.MeshLine.js#L424
        //in the shader it seems like it's base witdth * width
        let width = obj.userData.stroke.force[i] / 15;
        let tailLength = 3;

        //Beginning of the line
        if (i < tailLength) {
            let n = map(
                i,
                minWidth,
                tailLength,
                minWidth,
                baseWidth + width
            );

            force.push(n);
        }
        //End of the line
        else if (i > length - tailLength) {
            let n = map(
                i,
                length - tailLength,
                length - 1,
                baseWidth + width,
                minWidth
            );

            force.push(n);
        }
        //bulk of the line
        else {
            force.push(baseWidth + width);
        }
    }

    var pathBase = new THREE.CatmullRomCurve3(vertices);
    const tubeGeometry = new TubeBufferGeometry(
        pathBase,
        vertices.length,
        force,
        8,
        !true
    );

    const material = new THREE.MeshStandardMaterial({
        color: obj.userData.stroke.color,
        flatShading: true,
        roughness: 1,
        shininess: 0,
        metalness: 1,
    });
    const mesh = new THREE.Mesh(tubeGeometry, material);
    return mesh;
}


export function convertMeshlineFillToGeometry(mesh) {
    let obj = mesh;
    let fill = obj.children[0].clone();
    let fillGeometry = obj.children[0].geometry.clone();
    fill.geometry = fillGeometry;
    fill.geometry.applyMatrix4(obj.matrix);
    fill.position.set(0, 0, 0);
    fill.rotation.set(0, 0, 0);
    fill.scale.set(1, 1, 1);
    fill.material = new THREE.MeshStandardMaterial({
        color: obj.userData.fill.color,
        side: THREE.DoubleSide,
    });
    return fill;
}