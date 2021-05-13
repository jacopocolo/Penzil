/*
TODO:
- introduce min and max distance for translate from starting position
- introduce min and max Polar angle, min and max AzimuthAngle
- introduce damping? Doubtful but okay
- rename zooming?
- screenSpacePanning? (I think it's == to verticalDragForward)
- keyTranslateSpeed?
- check if we need element?
*/

import {
    EventDispatcher,
    Vector2,
    Vector3,
    Quaternion,
    Euler,
} from 'three';

const MOUSE = {
    LEFT: "LEFT",
    MIDDLE: "MIDDLE",
    RIGHT: "RIGHT",
    ROTATE: "ROTATE",
    SCALE: "SCALE",
    TRANSLATE: "TRANSLATE",
}
Object.freeze(MOUSE);

const ACTION = {
    NONE: "NONE",
    ROTATE: "ROTATE",
    TRANSLATE: "TRANSLATE",
    SCALE_TRANSLATE: "SCALE_TRANSLATE",
    SCALE_ROTATE: "SCALE_ROTATE",
};
Object.freeze(ACTION);

const _changeEvent = { type: 'change' };
const _startEvent = { type: 'start' };
const _endEvent = { type: 'end' };

class ObjectControls extends EventDispatcher {

    constructor(object, camera, domElement) {

        super();

        if (domElement === undefined) console.warn('THREE.ObjectControls: The second parameter "domElement" is now mandatory.');
        if (domElement === document) console.error('THREE.ObjectControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');

        this.object = object;
        this.domElement = domElement;
        this.camera = camera;

        // Set to false to disable this control
        this.enabled = true;

        // How far you can translate the object
        this.minDistance = 0;
        this.maxDistance = Infinity;

        // How far you can zoom in and out ( OrthographicCamera only )
        this.minZoom = 0.5;
        this.maxZoom = 3;

        // How far you can orbit vertically, upper and lower limits.
        // Range is 0 to Math.PI radians.
        this.minPolarAngle = 0; // radians
        this.maxPolarAngle = Math.PI; // radians

        // How far you can orbit horizontally, upper and lower limits.
        // If set, the interval [ min, max ] must be a sub-interval of [ - 2 PI, 2 PI ], with ( max - min < 2 PI )
        this.minAzimuthAngle = - Infinity; // radians
        this.maxAzimuthAngle = Infinity; // radians

        // Set to true to enable damping (inertia)
        // If damping is enabled, you must call controls.update() in your animation loop
        this.enableDamping = false;
        this.dampingFactor = 0.05;

        // This option actually enables dollying in and out; left as "zoom" for backwards compatibility.
        // Set to false to disable zooming
        this.enableZoom = true;
        this.zoomSpeed = 0.5;

        // Set to false to disable rotating
        this.enableRotate = true;
        this.rotateSpeed = 0.5;

        // Set to false to disable translating
        this.enableTranslate = true;
        this.verticalDragToForward = true;
        this.translateSpeed = 1;
        this.screenSpacePanning = true; // if false, pan orthogonal to world-space direction camera.up
        this.keyTranslateSpeed = 7.0;	// pixels moved per arrow key push

        // The four arrow keys
        this.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown' };

        // Mouse buttons
        this.mouseButtons = { LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.ROTATE, RIGHT: MOUSE.TRANSLATE };

        // Touch fingers
        this.touches = { ONE: ACTION.NONE, TWO: ACTION.SCALE_ROTATE, THREE: ACTION.TRANSLATE };

        // for reset
        this.position0 = this.object.position.clone();
        this.rotation0 = this.object.rotation.clone()
        this.scale0 = this.object.scale.clone();

        // the target DOM element for key events
        this._domElementKeyEvents = null;
        this.showTouches = false;

        //
        // public methods
        //

        this.listenToKeyEvents = function (domElement) {

            domElement.addEventListener('keydown', onKeyDown);
            this._domElementKeyEvents = domElement;

        };

        this.saveState = function () {

            scope.position0.copy(scope.object.position);
            scope.rotation0.copy(scope.object.rotation)
            scope.scale0.copy(scope.object.scale);

        };

        this.reset = function () {

            scope.object.position.copy(scope.object.position0);
            scope.object.rotation.copy(scope.object.rotation0);
            scope.object.scale.copy(scope.scale0);

            scope.object.updateProjectionMatrix();
            scope.dispatchEvent(_changeEvent);

            scope.update();

            state = STATE.NONE;

        };

        // this method is exposed, but perhaps it would be better if we can make it private...
        this.update = function () {

            return function update() {

                if (rotationChanged) {
                    // var deltaRotationQuaternion = new Quaternion()
                    //     .setFromEuler(new Euler(
                    //         (rotateDelta.y * 1) * (Math.PI / 180),
                    //         (rotateDelta.x * 1) * (Math.PI / 180),
                    //         (rotateDelta.z * 1) * (Math.PI / 180),
                    //         'XYZ'
                    //     ));

                    // scope.object.quaternion.multiplyQuaternions(deltaRotationQuaternion, scope.object.quaternion);

                    console.log(Quaternion, Euler)

                    scope.object.rotation.set(
                        scope.object.rotation.x += rotateDelta.y / 100,
                        scope.object.rotation.y += rotateDelta.x / 100,
                        scope.object.rotation.z += rotateDelta.z / 100)

                    rotateDelta.x = 0;
                    rotateDelta.y = 0;
                    rotateDelta.z = 0;
                    rotationChanged = false;
                    scope.dispatchEvent(_changeEvent);
                }

                if (scaleChanged) {
                    scope.object.scale.set(scaleDelta.x, scaleDelta.y, scaleDelta.z)
                    scaleChanged = false;
                    scope.dispatchEvent(_changeEvent);
                }

                if (positionChanged) {
                    scope.object.position.set(position.x, position.y, position.z)
                    positionChanged = false;
                    scope.dispatchEvent(_changeEvent);
                }

                return false;

            };

        }();

        this.dispose = function () {

            scope.domElement.removeEventListener('contextmenu', onContextMenu);

            scope.domElement.removeEventListener('pointerdown', onPointerDown);
            scope.domElement.removeEventListener('wheel', onMouseWheel);

            scope.domElement.removeEventListener('touchstart', onTouchStart);
            scope.domElement.removeEventListener('touchend', onTouchEnd);
            scope.domElement.removeEventListener('touchmove', onTouchMove);

            scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
            scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);


            if (scope._domElementKeyEvents !== null) {

                scope._domElementKeyEvents.removeEventListener('keydown', onKeyDown);

            }

            //scope.dispatchEvent( { type: 'dispose' } ); // should this be added here?

        };

        //
        // internals
        //

        const scope = this;

        const STATE = {
            NONE: - 1,
            ROTATE: 0,
            SCALE: 1,
            TRANSLATE: 2,
            TOUCH_ROTATE: 3,
            TOUCH_TRANSLATE: 4,
            TOUCH_SCALE_TRANSLATE: 5,
            TOUCH_SCALE_ROTATE: 6
        };

        let state = STATE.NONE;

        // const EPS = 0.000001;

        // const panOffset = new Vector3();
        const position = new Vector3();
        position.copy(scope.position0);
        let positionChanged = false;

        // let scale = 1;
        let scaleChanged = false;

        const rotateStart = new Vector3();
        const rotateEnd = new Vector3();
        const rotateDelta = new Vector3();
        let rotationChanged = false;

        const translateStart = new Vector2();
        const translateEnd = new Vector2();
        const translateDelta = new Vector2();

        const scaleStart = new Vector2();
        const scaleEnd = new Vector2();
        const scaleDelta = new Vector3();
        let scaleAngle = 0;

        let touchOne, touchTwo, touchThree;
        let htmlTouches = [];
        // function getAutoRotationAngle() {

        //     return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

        // }

        function getScale(val) {

            return Math.pow(val, scope.zoomSpeed / 2);

        }

        // function rotateLeft(angle) {
        //     console.log("rotateLeft", angle)
        // }

        // function rotateUp(angle) {
        //     console.log("rotateUp", angle)
        // }

        const translateLeft = function () {

            return function translateLeft(d) {

                let cameraDirection = new Vector3();
                camera.getWorldDirection(cameraDirection);
                let right = cameraDirection.cross(new Vector3(0, 1, 0)).normalize();

                position.add(
                    right.multiplyScalar(d / 50)
                )
                positionChanged = true;

            }

        }();

        const translateUp = function () {

            return function translateDeep(d) {
                let cameraDirection = new Vector3();
                camera.getWorldDirection(cameraDirection);
                let right = cameraDirection.cross(new Vector3(1, 0, 0)).normalize();

                position.add(
                    right.multiplyScalar(d / 50)
                )
                positionChanged = true;
            }

        }();

        const translateDeep = function () {

            return function translateDeep(d) {
                let cameraDirection = new Vector3();
                camera.getWorldDirection(cameraDirection);
                cameraDirection.y = 0;

                position.add(
                    cameraDirection.multiplyScalar(-d / 10)
                )
                positionChanged = true;
            }

        }();

        // deltaX and deltaY are in pixels; right and down are positive
        const translate = function () {

            // const offset = new Vector3();

            return function translate(deltaX, deltaY) {

                translateLeft(deltaX);

                if (scope.verticalDragToForward) {
                    translateDeep(deltaY)
                } else {
                    translateUp(deltaY);
                }

            };

        }();

        function reduce(s) {
            let scale = Math.max(
                scope.minZoom,
                Math.min(scope.maxZoom, scope.object.scale.multiplyScalar(s).x
                )
            );
            scaleDelta.x = scale;
            scaleDelta.y = scale;
            scaleDelta.z = scale;
            scaleChanged = true;
        }

        function enlarge(s) {
            let scale = Math.max(
                scope.minZoom,
                Math.min(scope.maxZoom, scope.object.scale.multiplyScalar(s).x
                )
            );
            scaleDelta.x = scale;
            scaleDelta.y = scale;
            scaleDelta.z = scale;
            scaleChanged = true;
        }

        //
        // event callbacks - update the object state
        //

        function handleMouseDownRotate(event) {

            rotateStart.set(event.clientX, event.clientY);

        }

        function handleMouseDownScale(event) {
            scaleStart.set(event.clientX, event.clientY);
        }

        function handleMouseDownTranslate(event) {

            translateStart.set(event.clientX, event.clientY);

        }

        function handleMouseMoveRotate(event) {

            rotateEnd.set(event.clientX, event.clientY);

            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

            // const element = scope.domElement;

            // rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height

            // rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);

            rotateStart.copy(rotateEnd);

            rotationChanged = true;

            scope.update();

        }

        function handleMouseMoveScale(event) {

            scaleEnd.set(event.clientX, event.clientY);

            scaleDelta.subVectors(scaleEnd, scaleStart);
            scaleAngle = Math.atan2(scaleEnd.y - scaleStart.y, scaleEnd.x - scaleStart.x); //in radians;
            // console.warn(scaleAngle);

            //doesn't really work

            if (scaleDelta.y > 0) {

                reduce(scaleDelta.y);

            } else if (scaleDelta.y < 0) {

                enlarge(scaleDelta.y);

            }

            scaleStart.copy(scaleEnd);

            scope.update();

        }

        function handleMouseMoveTranslate(event) {

            translateEnd.set(event.clientX, event.clientY);

            translateDelta.subVectors(translateEnd, translateStart).multiplyScalar(scope.translateSpeed / 2);

            translate(translateDelta.x, translateDelta.y);

            translateStart.copy(translateEnd);

            scope.update();

        }

        function handleMouseUp( /*event*/) {

            // no-op

        }

        function handleMouseWheel(event) {

            if (event.deltaY > 0) {

                enlarge(getScale(1.05));

            } else if (event.deltaY < 0) {

                reduce(getScale(0.95));
            }

            scope.update();

        }

        function handleKeyDown(event) {

            let needsUpdate = false;

            switch (event.code) {

                case scope.keys.UP:
                    translate(0, scope.keyTranslateSpeed);
                    needsUpdate = true;
                    break;

                case scope.keys.BOTTOM:
                    translate(0, - scope.keyTranslateSpeed);
                    needsUpdate = true;
                    break;

                case scope.keys.LEFT:
                    translate(scope.keyTranslateSpeed, 0);
                    needsUpdate = true;
                    break;

                case scope.keys.RIGHT:
                    translate(- scope.keyTranslateSpeed, 0);
                    needsUpdate = true;
                    break;

            }

            if (needsUpdate) {

                // prevent the browser from scrolling on cursor keys
                event.preventDefault();

                scope.update();

            }


        }

        function handleTouchStartRotate(event) {

            if (event.touches.length == 1) {

                rotateStart.set(event.touches[0].pageX, event.touches[0].pageY);

            } else {

                const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
                const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

                rotateStart.set(x, y);

            }

        }

        function handleTouchStartTranslate(event) {

            if (event.touches.length == 1) {

                translateStart.set(event.touches[0].pageX, event.touches[0].pageY);

            } else {

                const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
                const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

                translateStart.set(x, y);

            }

        }

        function handleTouchStartScale(event) {

            const dx = event.touches[0].pageX - event.touches[1].pageX;
            const dy = event.touches[0].pageY - event.touches[1].pageY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            scaleStart.set(0, distance);

        }

        function handleTouchStartScaleTranslate(event) {

            if (scope.enableZoom) handleTouchStartScale(event);

            if (scope.enableTranslate) handleTouchStartTranslate(event);

        }

        function handleTouchStartScaleRotate(event) {

            if (scope.enableZoom) handleTouchStartScale(event);

            if (scope.enableRotate) handleTouchStartRotate(event);

        }

        function handleTouchMoveRotate(event) {

            if (event.touches.length == 1) {

                rotateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

            } else {

                const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
                const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

                rotateEnd.set(x, y);

                const z = Math.atan2(rotateEnd.y - rotateStart.y, rotateEnd.x - rotateStart.x); //in radians;

                rotateEnd.set(x, y, z)

            }

            rotateDelta.subVectors(rotateEnd, rotateStart).multiplyScalar(scope.rotateSpeed);

            // const element = scope.domElement;
            // rotateLeft(2 * Math.PI * rotateDelta.x / element.clientHeight); // yes, height
            // rotateUp(2 * Math.PI * rotateDelta.y / element.clientHeight);

            rotateStart.copy(rotateEnd);

            rotationChanged = true;

        }

        function handleTouchMoveTranslate(event) {

            if (event.touches.length == 1) {

                translateEnd.set(event.touches[0].pageX, event.touches[0].pageY);

            } else {

                const x = 0.5 * (event.touches[0].pageX + event.touches[1].pageX);
                const y = 0.5 * (event.touches[0].pageY + event.touches[1].pageY);

                translateEnd.set(x, y);

            }

            translateDelta.subVectors(translateEnd, translateStart).multiplyScalar(scope.translateSpeed / 2);

            translate(translateDelta.x, translateDelta.y);

            translateStart.copy(translateEnd);

        }

        function handleTouchMoveScale(event) {

            const dx = event.touches[0].pageX - event.touches[1].pageX;
            const dy = event.touches[0].pageY - event.touches[1].pageY;

            const distance = Math.sqrt(dx * dx + dy * dy);

            scaleEnd.set(0, distance);

            scaleDelta.set(0, Math.pow(scaleEnd.y / scaleStart.y, scope.zoomSpeed / 2));
            scaleAngle = Math.atan2(scaleEnd.y - scaleStart.y, scaleEnd.x - scaleStart.x); //in radians;
            console.log(scaleAngle);

            //only enlarge?!
            enlarge(scaleDelta.y);

            scaleStart.copy(scaleEnd);

        }

        function handleTouchMoveScaleTranslate(event) {

            if (scope.enableZoom) handleTouchMoveScale(event);

            if (scope.enableTranslate) handleTouchMoveTranslate(event);

        }

        function handleTouchMoveScaleRotate(event) {

            if (scope.enableZoom) handleTouchMoveScale(event);

            if (scope.enableRotate) handleTouchMoveRotate(event);

        }

        function handleTouchEnd( /*event*/) {

            // no-op

        }

        //
        // event handlers - FSM: listen for events and reset state
        //

        function onPointerDown(event) {

            if (scope.enabled === false) return;

            switch (event.pointerType) {

                case 'mouse':
                case 'pen':
                    onMouseDown(event);
                    break;

                // TODO touch

            }

        }

        function onPointerMove(event) {

            if (scope.enabled === false) return;

            switch (event.pointerType) {

                case 'mouse':
                case 'pen':
                    onMouseMove(event);
                    break;

                // TODO touch

            }

        }

        function onPointerUp(event) {

            switch (event.pointerType) {

                case 'mouse':
                case 'pen':
                    onMouseUp(event);
                    break;

                // TODO touch

            }

        }

        function onMouseDown(event) {

            // Prevent the browser from scrolling.
            event.preventDefault();

            // Manually set the focus since calling preventDefault above
            // prevents the browser from setting it automatically.

            scope.domElement.focus ? scope.domElement.focus() : window.focus();

            let mouseAction;

            switch (event.button) {

                case 0:

                    mouseAction = scope.mouseButtons.LEFT;
                    break;

                case 1:

                    mouseAction = scope.mouseButtons.MIDDLE;
                    break;

                case 2:

                    mouseAction = scope.mouseButtons.RIGHT;
                    break;

                default:

                    mouseAction = - 1;

            }

            switch (mouseAction) {

                case MOUSE.SCALE:

                    if (scope.enableZoom === false) return;

                    handleMouseDownScale(event);

                    state = STATE.SCALE;

                    break;

                case MOUSE.ROTATE:

                    if (event.ctrlKey || event.metaKey || event.shiftKey) {

                        if (scope.enableTranslate === false) return;

                        handleMouseDownTranslate(event);

                        state = STATE.TRANSLATE;

                    } else {

                        if (scope.enableRotate === false) return;

                        handleMouseDownRotate(event);

                        state = STATE.ROTATE;

                    }

                    break;

                case MOUSE.TRANSLATE:

                    if (event.ctrlKey || event.metaKey || event.shiftKey) {

                        if (scope.enableRotate === false) return;

                        handleMouseDownRotate(event);

                        state = STATE.ROTATE;

                    } else {

                        if (scope.enableTranslate === false) return;

                        handleMouseDownTranslate(event);

                        state = STATE.TRANSLATE;

                    }

                    break;

                default:

                    state = STATE.NONE;

            }

            if (state !== STATE.NONE) {

                scope.domElement.ownerDocument.addEventListener('pointermove', onPointerMove);
                scope.domElement.ownerDocument.addEventListener('pointerup', onPointerUp);

                scope.dispatchEvent(_startEvent);

            }

        }

        function onMouseMove(event) {

            if (scope.enabled === false) return;

            event.preventDefault();

            switch (state) {

                case STATE.ROTATE:

                    if (scope.enableRotate === false) return;

                    handleMouseMoveRotate(event);

                    break;

                case STATE.SCALE:

                    if (scope.enableZoom === false) return;

                    handleMouseMoveScale(event);

                    break;

                case STATE.TRANSLATE:

                    if (scope.enableTranslate === false) return;

                    handleMouseMoveTranslate(event);

                    break;

            }

        }

        function onMouseUp(event) {

            scope.domElement.ownerDocument.removeEventListener('pointermove', onPointerMove);
            scope.domElement.ownerDocument.removeEventListener('pointerup', onPointerUp);

            if (scope.enabled === false) return;

            handleMouseUp(event);

            scope.dispatchEvent(_endEvent);

            state = STATE.NONE;

        }

        function onMouseWheel(event) {

            if (scope.enabled === false || scope.enableZoom === false || (state !== STATE.NONE && state !== STATE.ROTATE)) return;

            event.preventDefault();

            scope.dispatchEvent(_startEvent);

            handleMouseWheel(event);

            scope.dispatchEvent(_endEvent);

        }

        function onKeyDown(event) {

            if (scope.enabled === false || scope.enableTranslate === false) return;

            handleKeyDown(event);

        }

        function onTouchStart(event) {

            if (scope.enabled === false) return;

            event.preventDefault(); // prevent scrolling

            switch (event.touches.length) {

                case 1:

                    switch (scope.touches.ONE) {

                        case ACTION.ROTATE:

                            if (scope.enableRotate === false) return;

                            handleTouchStartRotate(event);

                            state = STATE.TOUCH_ROTATE;

                            break;

                        case ACTION.TRANSLATE:

                            if (scope.enableTranslate === false) return;

                            handleTouchStartTranslate(event);

                            state = STATE.TOUCH_TRANSLATE;

                            break;

                        default:

                            state = STATE.NONE;

                    }
                    if (scope.showTouches) {
                        console.log("showTouches")
                        touchOne = document.createElement("div");
                        touchOne.style.position = "absolute";
                        touchOne.style.top = event.touches[0].pageY + "px";
                        touchOne.style.left = event.touches[0].pageX + "px";
                        touchOne.style.backgroundColor = "rgba(255,0,0,0.3)";
                        touchOne.style.width = "50px"
                        touchOne.style.height = "50px";
                        touchOne.style.borderRadius = "30px";
                        document.body.appendChild(touchOne);
                        htmlTouches.push(touchOne)
                    }

                    break;

                case 2:

                    switch (scope.touches.TWO) {
                        case ACTION.SCALE_TRANSLATE:
                            if (scope.enableZoom === false && scope.enableTranslate === false) return;

                            handleTouchStartScaleTranslate(event);

                            state = STATE.TOUCH_SCALE_TRANSLATE;

                            break;

                        case ACTION.SCALE_ROTATE:

                            if (scope.enableZoom === false && scope.enableRotate === false) return;

                            handleTouchStartScaleRotate(event);

                            state = STATE.TOUCH_SCALE_ROTATE;

                            break;

                        default:
                            state = STATE.NONE;

                    }
                    if (scope.showTouches) {
                        touchTwo = document.createElement("div");
                        touchTwo.style.position = "absolute";
                        touchTwo.style.top = event.touches[1].pageY + "px";
                        touchTwo.style.left = event.touches[1].pageX + "px";
                        touchTwo.style.backgroundColor = "rgba(255,0,0,0.3)";
                        touchTwo.style.width = "50px"
                        touchTwo.style.height = "50px";
                        touchTwo.style.borderRadius = "30px";
                        document.body.appendChild(touchTwo);
                        htmlTouches.push(touchTwo)
                    }

                    break;

                case 3:
                    switch (scope.touches.THREE) {
                        case ACTION.TRANSLATE:
                            if (scope.enableZoom === false && scope.enableTranslate === false) return;

                            handleTouchStartTranslate(event);

                            state = STATE.TOUCH_TRANSLATE;

                            break;

                        default:
                            state = STATE.NONE;

                    }
                    if (scope.showTouches) {
                        touchThree = document.createElement("div");
                        touchThree.style.position = "absolute";
                        touchThree.style.top = event.touches[2].pageY + "px";
                        touchThree.style.left = event.touches[2].pageX + "px";
                        touchThree.style.backgroundColor = "rgba(255,0,0,0.3)";
                        touchThree.style.width = "50px"
                        touchThree.style.height = "50px";
                        touchThree.style.borderRadius = "30px";
                        document.body.appendChild(touchThree);
                        htmlTouches.push(touchThree)
                    }
                    break;

                default:

                    state = STATE.NONE;

            }

            if (state !== STATE.NONE) {

                scope.dispatchEvent(_startEvent);

            }

        }

        function onTouchMove(event) {

            if (scope.enabled === false) return;

            event.preventDefault(); // prevent scrolling

            switch (state) {

                case STATE.TOUCH_ROTATE:

                    if (scope.enableRotate === false) return;

                    handleTouchMoveRotate(event);

                    scope.update();

                    break;

                case STATE.TOUCH_TRANSLATE:

                    if (scope.enableTranslate === false) return;

                    handleTouchMoveTranslate(event);

                    scope.update();

                    break;

                case STATE.TOUCH_SCALE_TRANSLATE:

                    if (scope.enableZoom === false && scope.enableTranslate === false) return;

                    handleTouchMoveScaleTranslate(event);

                    scope.update();

                    break;

                case STATE.TOUCH_SCALE_ROTATE:

                    if (scope.enableZoom === false && scope.enableRotate === false) return;

                    handleTouchMoveScaleRotate(event);

                    scope.update();

                    break;

                default:

                    state = STATE.NONE;

            }

            if (scope.showTouches) {
                for (let i = 0; i <= event.touches.length; i++) {
                    htmlTouches[i].style.top = event.touches[i].pageY + "px";
                    htmlTouches[i].style.left = event.touches[i].pageX + "px";
                }
            }

        }

        function onTouchEnd(event) {

            if (scope.enabled === false) return;

            handleTouchEnd(event);

            scope.dispatchEvent(_endEvent);

            state = STATE.NONE;

            if (scope.showTouches) {
                for (let i = 0; i <= htmlTouches.length; i++) {
                    htmlTouches[i]?.remove()
                }
                htmlTouches = [];
            }

        }

        function onContextMenu(event) {

            if (scope.enabled === false) return;

            event.preventDefault();

        }

        //

        scope.domElement.addEventListener('contextmenu', onContextMenu);

        scope.domElement.addEventListener('pointerdown', onPointerDown);
        scope.domElement.addEventListener('wheel', onMouseWheel, { passive: false });

        scope.domElement.addEventListener('touchstart', onTouchStart, { passive: false });
        scope.domElement.addEventListener('touchend', onTouchEnd);
        scope.domElement.addEventListener('touchmove', onTouchMove, { passive: false });

        // force an update at start

        this.update();

    }

}

export { ObjectControls };