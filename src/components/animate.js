import { scene, renderer, camera } from "../App.vue";

let loop = false;

let animate = function () {
    if (loop) {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
};

let startAnimating = function () {
    loop = true;
    animate();
}

let stopAnimating = function () {
    loop = false;
}

export { startAnimating, stopAnimating, loop } 