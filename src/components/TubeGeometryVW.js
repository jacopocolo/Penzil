//http://web.archive.org/web/20170106063058/http://www.lab4games.net/zz85/blog/2012/04/24/spline-extrusions-tubes-and-knots-of-sorts/
//https://mattdesl.svbtle.com/shaping-curves-with-parametric-equations
//https://github.com/mattdesl/parametric-curves/blob/45f321fd43af3a0786aa2dd4016931cc39325944/lib/shaders/tube.vert#L66-L162
//https://stackoverflow.com/questions/31660099/threejs-tubegeometry-applying-custom-curve-causes-unexpected-twisting

//https://avikdas.com/2020/09/08/rendering-curves-in-3d.html
//https://avikdas.com/assets/js/curve-optimization/curve-geometry.mjs

import { BufferGeometry } from 'three';
import { Float32BufferAttribute } from 'three';
// import { Vector2 } from 'three';
import { Vector3 } from 'three';

// TubeBufferGeometry

class TubeBufferGeometry extends BufferGeometry {

    constructor(path, tubularSegments = 10, radius = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1], radialSegments = 8, closed = false) {

        super();
        this.type = 'TubeBufferGeometry';

        this.parameters = {
            path: path,
            tubularSegments: tubularSegments,
            radius: radius,
            radialSegments: radialSegments,
            closed: closed
        };

        tubularSegments = tubularSegments || 64;
        radius = radius || 1;
        radialSegments = radialSegments || 8;
        closed = closed || false;

        var frames = path.computeFrenetFrames(tubularSegments, closed);

        // expose internals

        this.tangents = frames.tangents;
        this.normals = frames.normals;
        this.binormals = frames.binormals;

        // helper variables

        var vertex = new Vector3();
        var normal = new Vector3();
        // var uv = new Vector2();
        var P = new Vector3();

        var i, j;

        // buffer

        var vertices = [];
        var normals = [];
        // var uvs = [];
        var indices = [];

        // create buffer data

        generateBufferData();

        // build geometry

        this.setIndex(indices);
        this.setAttribute('position', new Float32BufferAttribute(vertices, 3));
        // Commenting out normals and UVs. For exporting to USDZ the result is better if the object has none of them
        // this.setAttribute('normal', new Float32BufferAttribute(normals, 3));
        // this.setAttribute('uv', new Float32BufferAttribute(uvs, 2));

        // functions

        function generateBufferData() {

            for (i = 0; i < tubularSegments; i++) {

                generateSegment(i);

            }

            // if the geometry is not closed, generate the last row of vertices and normals
            // at the regular position on the given path
            //
            // if the geometry is closed, duplicate the first row of vertices and normals (uvs will differ)

            generateSegment((closed === false) ? tubularSegments : 0);

            // uvs are generated in a separate function.
            // this makes it easy compute correct values for closed geometries
            // generateUVs();

            // finally create faces

            generateIndices();

        }

        function generateSegment(i) {

            // we use getPointAt to sample evenly distributed points from the given path

            P = path.getPointAt(i / tubularSegments, P);

            // If you avoid rotations completely, the model looks flatter but works
            // var N = frames.normals[0];
            // var B = frames.binormals[0];

            // retrieve corresponding normal and binormal
            var N = frames.normals[i];
            var B = frames.binormals[i];

            // generate normals and vertices for the current segment

            for (j = 0; j <= radialSegments; j++) {

                var v = j / radialSegments * Math.PI * 2;

                var sin = Math.sin(v);
                var cos = - Math.cos(v);

                normal
                normal.x = (cos * N.x + sin * B.x);
                normal.y = (cos * N.y + sin * B.y);
                normal.z = (cos * N.z + sin * B.z);
                normal.normalize();

                normals.push(normal.x, normal.y, normal.z);

                // vertex
                const r = (typeof radius === 'function') ? radius(i / tubularSegments) : radius[i];
                // const r = (typeof radius === 'function') ? radius(i / tubularSegments) : radius;

                vertex.x = P.x + r * normal.x;
                vertex.y = P.y + r * normal.y;
                vertex.z = P.z + r * normal.z;

                vertices.push(vertex.x, vertex.y, vertex.z);

            }

        }

        function generateIndices() {

            for (j = 1; j <= tubularSegments; j++) {

                for (i = 1; i <= radialSegments; i++) {

                    var a = (radialSegments + 1) * (j - 1) + (i - 1);
                    var b = (radialSegments + 1) * j + (i - 1);
                    var c = (radialSegments + 1) * j + i;
                    var d = (radialSegments + 1) * (j - 1) + i;

                    // faces

                    indices.push(a, b, d);
                    indices.push(b, c, d);

                }

            }

        }

        // function generateUVs() {

        //     for (i = 0; i <= tubularSegments; i++) {

        //         for (j = 0; j <= radialSegments; j++) {

        //             uv.x = i / tubularSegments;
        //             uv.y = j / radialSegments;

        //             uvs.push(uv.x, uv.y);

        //         }

        //     }

        // }

    }
}

// TubeBufferGeometry.prototype = Object.create(THREE.BufferGeometry.prototype);
// TubeBufferGeometry.prototype.constructor = TubeBufferGeometry;

export { TubeBufferGeometry };