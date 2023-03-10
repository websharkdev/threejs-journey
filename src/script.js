import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import './style.css'
import gsap from "gsap";
import * as dat from 'dat.gui'

import TextureImage from './color.jpg'


// Textures 

// const image = new Image()
// let texture = new THREE.Texture(image)
// image.onload = () => {
//   texture.needsUpdate = true
// }

// image.src = TextureImage

const loadingManager = new THREE.LoadingManager()

loadingManager.onStart = () => {
  console.log('Start loading');
}
loadingManager.onProgress = () => {
  console.log('Loading...');
}
loadingManager.onError = () => {
  console.log('Error!');
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load(TextureImage)


// texture.repeat.x = 2
// texture.repeat.y = 2

// texture.wrapS = THREE.MirroredRepeatWrapping
// texture.wrapT = THREE.RepeatWrapping

// texture.offset.x = 0.5
// texture.offset.y = 0.5

// texture.rotation = Math.PI * .25
// texture.center.x = 0.5
// texture.center.y = 0.5

texture.generateMipmaps = false
texture.minFilter = THREE.NearestFilter
texture.magFilter = THREE.NearestFilter



// DebugUI
const gui = new dat.GUI()
const debugParameters = {
  color: "#f00",
  spin: () => {
    gsap.to(mesh.rotation, {duration: 1, y: mesh.rotation.y + Math.PI * 4})
  }
}

/**
 * Cursor
 */

// Sizes

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};



window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


window.addEventListener('dblclick', () => {

  const fullscreenElement = document.fullscreenElement || document.webkitfullscreenElement

  fullscreenElement ? document.exitFullscreen() : canvas.requestFullscreen();
})


const cursor = {
  x: 0,
  y: 0
}
window.addEventListener("mousemove", (e) =>  {cursor.x = e.clientX / sizes.width - .5; cursor.y = -(e.clientY / sizes.height - 0.5); } );


/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");


// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 5, 5, 5)

// const geometry = new THREE.BufferGeometry();

// const count = 50

// const positionsArray = new Float32Array(count * 3 * 3)

// for(let i = 0; i < count * 3 * 3; i++) {
//   positionsArray[i] = (Math.random() - .5) * 4
// }
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// geometry.setAttribute('position', positionsAttribute)

// const positionsArray = new Float32Array([
//   0, 0, 0,
//   0, 1, 0,
//   1, 0, 0
// ])

// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)


// geometry.setAttribute("position", positionsAttribute);
// geometry.setAttribute("position", positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  // color: debugParameters.color,
  map: texture,
  wireframe: false,
});

const mesh = new THREE.Mesh(geometry,material);
scene.add(mesh);


gui.add(mesh.position, 'y',  -3, 3, 1).name('mesh-position y')
gui.add(mesh.position, 'x',  -3, 3, 1).name('mesh-position x')
gui.add(mesh.position, 'z',  -3, 3, 1).name('mesh-position z')

gui.add(material, 'wireframe')
gui.addColor(debugParameters, "color").onChange(() => {
  material.color.set(debugParameters.color)
})

gui.add(debugParameters, 'spin')

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

// const camera = new THREE.OrthographicCamera(
//   -1 * aspectRatio,
//   1 * aspectRatio,
//   1,
//   -1,
//   0.1,
//   100
// ); 
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);


const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Animate
const clock = new THREE.Clock();

const tick = () => {
  // const elapsedTime = clock.getElapsedTime();

  // Update objects
  // mesh.rotation.y = elapsedTime;
  // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
  // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
  // camera.position.y = cursor.y * Math.PI * 2

  // camera.lookAt(mesh.position)





  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
