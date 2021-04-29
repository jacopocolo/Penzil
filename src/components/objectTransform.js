//touchTransform = new TouchTransform(objet, element)
import * as THREE from "three";
import { renderer, scene, camera } from "../App.vue";

let ObjectTransform = class {
    constructor(object, element) {
        this.element = element
        this.object = object
        this.enabled = true
        this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
        this.raycaster = new THREE.Raycaster()
        this.intersects = new THREE.Vector3()
        this.previousIntersects = new THREE.Vector3();
    }
    mouse = {
        down: false,
        tx: 0, //x coord for threejs
        ty: 0, //y coord for threejs
        cx: 0, //x coord for css
        cy: 0, //y coord for css
        dragStartPosition: new THREE.Vector2(),
        lastDragPosition: new THREE.Vector2(),
        touches: 0,
    }
    touches = {
        down: false,
        0: {
            tx: 0, //x coord for threejs
            ty: 0, //y coord for threejs
            cx: 0, //x coord for css
            cy: 0, //y coord for css
            dragStartPosition: new THREE.Vector2(),
            lastDragPosition: new THREE.Vector2()
        },
        1: {
            tx: 0, //x coord for threejs
            ty: 0, //y coord for threejs
            cx: 0, //x coord for css
            cy: 0, //y coord for css
            dragStartPosition: new THREE.Vector2(),
            lastDragPosition: new THREE.Vector2()
        },
        length: 0,
        delta: 0
    }
    start() {
        this.element.addEventListener("touchstart", this.handleInput.bind(this), false);
        this.element.addEventListener("touchend", this.handleInput.bind(this), false);
        this.element.addEventListener("touchcancel", this.handleInput.bind(this), false);
        this.element.addEventListener("touchmove", this.handleInput.bind(this), false);
    }
    updateMouse(event) {
        this.mouse.tx = (event.clientX / 150) * 2 - 1;
        this.mouse.ty = -(event.clientY / 150) * 2 + 1;
        this.mouse.cx = event.clientX;
        this.mouse.cy = event.clientY;
    }
    updateTouches(event) {
        this.touches.length = event.changedTouches.length;
        for (let i = 0; i < event.changedTouches.length; i++) {
            if (i > 1) { return } //we only care about touches 0 and 1 for now
            this.touches[i].tx = (event.changedTouches[i].pageX / this.element.width) * 2 - 1;
            this.touches[i].ty = -(event.changedTouches[0].pageY / this.element.height) * 2 + 1;
            this.touches[i].cx = event.changedTouches[i].pageX;
            this.touches[i].cy = event.changedTouches[i].pageY;
        }
    }
    onMouseStart() {
        console.log('mousestart')
    }
    onMouseMove() {
        console.log('mousemove')
    }
    onMouseEnd() {
        console.log('mouseend')
    }
    onTouchStart() {

        console.log(this.object.position)

        this.touches.down = true;
        for (let i = 0; i < this.touches.length; i++) {
            this.touches[i].dragStartPosition = new THREE.Vector2(
                this.touches[i].cx,
                this.touches[i].cy
            )
            this.touches[i].lastDragPosition = new THREE.Vector2(
                this.touches[i].cx,
                this.touches[i].cy
            )
        }
    }
    onTouchMove() {
        if (this.touches.length === 1) {
            let objectCoord = this.object.position;
            objectCoord.project(camera);
            let ox = ((objectCoord.x + 1) * this.element.width) / 2;
            let oy = (-(objectCoord.y - 1) * this.element.height) / 2;
            let offset = new THREE.Vector2(ox, oy);

            // let d = document.createElement("div");
            // d.style.position = "absolute";
            // d.style.top = offset.y + "px";
            // d.style.left = offset.x + "px";
            // d.style.backgroundColor = "blue";
            // d.style.width = "10px"
            // d.style.height = "10px";
            // document.body.appendChild(d);

            let lastDragX = this.touches[0].lastDragPosition.x;
            let lastDragY = this.touches[0].lastDragPosition.y;
            let x = this.touches[0].cx;
            let y = this.touches[0].cy;

            let deltaX = lastDragX - x;
            let deltaY = lastDragY - y;

            this.translateObject(offset, deltaX, deltaY)
            this.updateLastDragPosition()
            return;
        }

        if (this.touches.length === 2) {
            //for rotation
            let lastDragX = this.touches[0].lastDragPosition.x;
            let lastDragY = this.touches[0].lastDragPosition.y;
            let x = this.touches[0].cx;
            let y = this.touches[0].cy;

            //for zoom
            var dx = this.touches[0].cx - this.touches[1].cx;
            var dy = this.touches[0].cy - this.touches[1].cy;
            let currentDist = Math.sqrt(dx * dx + dy * dy);
            var px = this.touches[0].lastDragPosition.x - this.touches[1].lastDragPosition.x;
            var py = this.touches[0].lastDragPosition.y - this.touches[1].lastDragPosition.y;
            let prevDistance = Math.sqrt(px * px + py * py);
            let distance = prevDistance - currentDist;

            if (distance > -3 && distance < 3) {

                this.rotateObject(
                    -(lastDragX - x),
                    -(lastDragY - y)
                )
            } else {
                this.scaleObject(distance)
            }
            this.updateLastDragPosition();
            return
        }
    }
    onTouchEnd() {

        console.log("touchend")

        if (this.touches.length == 0) {
            this.touches.down = false
        }
        for (let i = 0; i < this.touches.length; i++) {
            this.touches[i].cx = 0;
            this.touches[i].cy = 0;
            this.touches[i].dragStartPosition = new THREE.Vector2()
            this.touches[i].lastDragPosition = new THREE.Vector2()
            this.touches.delta = 0;
        }
    }
    handleInput(event) {
        if (this.enabled === false) { return } else {
            switch (event.type) {
                case "mousedown":
                    if (event.button != 3) { return }
                    this.updateMouse(event);
                    this.onMouseStart();
                    break;
                case "touchstart":
                    this.updateTouches(event);
                    this.onTouchStart();
                    break;
                case "mousemove":
                    if (event.button != 3) { return }
                    this.updateMouse(event);
                    this.onTouseMove();
                    break;
                case "touchmove":
                    this.updateTouches(event);
                    this.onTouchMove();
                    break;
                case "mouseup":
                    if (event.button != 3) { return }
                    this.updateMouse(event);
                    this.onMouseEnd();
                    break;
                case "touchend":
                    this.updateTouches(event);
                    this.onTouchEnd();
                    break;
                default:
                //nothing;
            }
        }
    }
    updateLastDragPosition() {
        for (let i = 0; i < this.touches.length - 1; i++) {
            this.touches[i].lastDragPosition = new THREE.Vector2(
                this.touches[i].cx,
                this.touches[i].cy
            )
        }
    }
    translateObject(offset, deltaX, deltaY) {

        // console.log(offset)

        // let d = document.createElement("div");
        // d.style.position = "absolute";
        // d.style.top = offset.y + "px";
        // d.style.left = offset.x + "px";
        // d.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
        // d.style.width = "10px"
        // d.style.height = "10px";
        // document.body.appendChild(d);
        let speed = 1.1;

        let x = (((offset.x - deltaX * speed) / this.element.width) * 2 - 1)
        let y = (-((offset.y - deltaY * speed) / this.element.height) * 2 + 1)


        let coord = new THREE.Vector2(x, y);
        this.raycaster.setFromCamera(coord, camera);
        this.raycaster.ray.intersectPlane(this.plane, this.intersects);
        this.intersects.multiplyScalar(0.2)

        if (this.intersects.x < -5) { this.intersects.x = -5 }
        if (this.intersects.x > 5) { this.intersects.x = 5 }
        if (this.intersects.y < -5) { this.intersects.y = -5 }
        if (this.intersects.y > 5) { this.intersects.y = 5 }
        if (this.intersects.z < -5) { this.intersects.z = -5 }
        if (this.intersects.z > 5) { this.intersects.z = 5 }



        this.object.position.set(
            this.intersects.x,
            this.intersects.y,
            this.intersects.z
        );

        console.log(this.object.position)

        renderer.render(scene, camera);
    }
    rotateObject(deltaX, deltaY) {
        //https://stackoverflow.com/questions/49780786/rotate-an-object-like-orbitcontrols-but-only-the-object-itself

        deltaX = Math.sign(deltaX)
        deltaY = Math.sign(deltaY)
        let w = this.element.width;
        var PI_2 = Math.PI * 2;
        var speed = 3;
        var theta = (PI_2 * speed * deltaX) / w;
        var phi = (PI_2 * speed * deltaY) / w;
        this.object.rotation.x += phi;
        this.object.rotation.y += theta;
        renderer.render(scene, camera);
    }
    scaleObject(scale) {

        scale = Math.sign(scale)
        let speed = 0.04;

        if (scale < 0) {
            scale = -scale * speed
            console.log(scale);
            this.object.scale.set(
                this.object.scale.x += scale,
                this.object.scale.y += scale,
                this.object.scale.z += scale,
            )
        } else {
            scale = scale * speed
            this.object.scale.set(
                this.object.scale.x -= scale,
                this.object.scale.y -= scale,
                this.object.scale.z -= scale,
            )
        }
        renderer.render(scene, camera);

    }
    enable() {
        this.enabled = true;
        console.log(this.enabled)
    }
    disable() {
        this.enabled = false;
        console.log(this.enabled)
    }
}

export { ObjectTransform };