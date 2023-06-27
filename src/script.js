import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import * as dat from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */

const cubeTextureLoader = new THREE.CubeTextureLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

debugObject.envMapIntensity = .5;


const environmentMap = cubeTextureLoader.load(
  [
    "/textures/environmentMaps/0/px.jpg",
    "/textures/environmentMaps/0/nx.jpg",
    "/textures/environmentMaps/0/py.jpg",
    "/textures/environmentMaps/0/ny.jpg",
    "/textures/environmentMaps/0/pz.jpg",
    "/textures/environmentMaps/0/nz.jpg",
  ],
  (load) => {
    console.log("load", load);
  },
  (progress) => {
    console.log("progress", progress);
  },
  (error) => {
    console.log("error", error);
  }
);

environmentMap.encoding = THREE.sRGBEncoding

scene.background = environmentMap;
scene.environment = environmentMap;

// updateAllMaterials

const updateAllMaterials = () => { 
  scene.traverse((child) => {
    if(child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = debugObject.envMapIntensity
        child.material.needsUpdate = true
        child.castShadow = true
        child.receiveShadow = true
    }
  })  
 }
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

 gltfLoader.load("/models/burger.gltf", (gltf) => {
   gltf.scene.scale.set(2, 2, 2);
   gltf.scene.position.set(0, -2, 0);
   gltf.scene.rotationюн = Math.PI * 0.5;
   scene.add(gltf.scene);
   updateAllMaterials()
 });


// /**
//  * Floor
//  */
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(50, 50),
//   new THREE.MeshStandardMaterial({
//     color: "#444444",
//     metalness: 0,
//     roughness: 0.5,
//   })
// );
// floor.receiveShadow = true;
// floor.rotation.x = -Math.PI * 0.5;
// scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6)
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
// const directionalLightCH = new THREE.CameraHelper(directionalLight.shadow.camera)

directionalLight.position.set(5, 5, -5);
directionalLight.castShadow = true
directionalLight.shadow.camera.far = 10

directionalLight.shadow.normalBias = .05
directionalLight.shadow.mapSize.set(1024, 1024)

scene.add(directionalLight);

gui
  .add(directionalLight, "intensity")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("intensity");
gui
  .add(directionalLight.position, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("LightX");
gui
  .add(directionalLight.position, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("LightY");
gui
  .add(directionalLight.position, "z")
  .min(0)
  .max(10)
  .step(0.001)
  .name("LightZ");

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
camera.position.set(-8, 4, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderer.outputEncoding = THREE.sRGBEncoding
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);

renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


gui.add(renderer, "toneMapping", {
  No: THREE.NoToneMapping,
  Lineear: THREE.LinearToneMapping,
  Reinhard: THREE.ReinhardToneMapping,
  Cineon: THREE.CineonToneMapping,
  ACESFilmic: THREE.ACESFilmicToneMapping,
}).onFinishChange(() => {
    updateAllMaterials()
})

gui
  .add(renderer, "toneMappingExposure")
  .min(0)
  .max(20)
  .step(0.001)
  .name("toneMappingExposure");

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
