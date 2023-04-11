import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

import "./style.css";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader();

// Objects
const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object1.position.x = -2;

const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);

const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: "#ff0000" })
);
object3.position.x = 2;

scene.add(object1, object2, object3);

// Raycaster

// const raycasterOrigin = new THREE.Vector3(-10, 0 ,0)
// const raycasterDirection = new THREE.Vector3(15, 0, 0)

// raycasterDirection.normalize()


// raycaster.set(raycasterOrigin, raycasterDirection)


// const intersect = raycaster.intersectObject(object2)

// const objectContainer = [object1, object2, object3]
// const intersects = raycaster.intersectObject(objectContainer);

const raycaster = new THREE.Raycaster(); 
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
*/

const mouse = new THREE.Vector2()
let currentIntersect = null;

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / sizes.width * 2 - 1
  mouse.y = -(e.clientY / sizes.height )* 2 + 1

})

window.addEventListener('click', (e) => {
  if(currentIntersect) { 
    console.log('click on a sphere');

    if(currentIntersect.object === object1) {
      console.log('sphere1');
    }
    if(currentIntersect.object === object2) {
      console.log('sphere2');
    }
    if(currentIntersect.object === object3) {
      console.log('sphere3');
    }
  }
})

const clock = new THREE.Clock();


const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.9) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.5) * 1.5;

  // cast ray

  raycaster.setFromCamera(mouse, camera);
  const objectContainer = [object1, object2, object3];
  const intersects = raycaster.intersectObjects(objectContainer);

  for (const item of objectContainer) {
    item.material.color.set("#ff0000");
    // currentIntersect = item 
  }
  for (const intersect of intersects) {
    intersect.object.material.color.set("#0000ff");
    // currentIntersect = object
  }

  if(intersects.length) {
    if(currentIntersect === null) {
      console.log('mouse enter');
    }
    currentIntersect = intersects[0]
  } else { 
    if (currentIntersect) {
      console.log("mouse leave");
    }
    currentIntersect = null
  }

  // const raycasterOrigin = new THREE.Vector3(-3, 0 ,0)
  // const raycasterDirection = new THREE.Vector3(1, 0, 0).normalize();

  // raycaster.set(raycasterOrigin, raycasterDirection)

  // const objectContainer = [object1, object2, object3]
  // const intersects = raycaster.intersectObjects(objectContainer);

  // for (const item of objectContainer) {
  //   item.material.color.set("#ff0000");
  // }
  // for (const intersect of intersects) {
  //   intersect.object.material.color.set("#0000ff");

  //   // console.log(intersect.object);
  // }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
