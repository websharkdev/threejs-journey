import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

import waterVertexShader from "./shaders/water/vertex.glsl";
import waterFragmentShader from "./shaders/water/fragment.glsl";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();
const debugOBJ = {}

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(2, 2, 512, 512);

debugOBJ.depthColor = '#186691'
debugOBJ.surfaceColor = '#9db8ff'

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uBigWavesElevation: { value: 0.2 },
    uSmallWavesElevation: { value: 0.15 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uSmallWavesFrequency: { value: 3 },
    uBigWavesSpeed: { value: 0.75 },
    uSmallWavesSpeed: { value: 0.2 },
    // COLORS
    uDepthColor: { value: new THREE.Color(debugOBJ.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugOBJ.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5.0 },
  },
});

gui.add(waterMaterial.uniforms.uBigWavesElevation, 'value').min(0).max(1).step(.001).name('waves-elevation');
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "x")
  .min(0)
  .max(10)
  .step(0.001)
  .name("waves-frequency--x");
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, "y")
  .min(0)
  .max(10)
  .step(0.001)
  .name("waves-frequency--y");
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("waves-frequency--speed");
gui
  .add(waterMaterial.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("Color Offset");
gui
  .add(waterMaterial.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Color Multiplier");

  gui
    .add(waterMaterial.uniforms.uSmallWavesFrequency, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Small Waves Frequency");
  gui
    .add(waterMaterial.uniforms.uSmallWavesElevation, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Small Waves Elevation");
  gui
    .add(waterMaterial.uniforms.uSmallWavesSpeed, "value")
    .min(0)
    .max(10)
    .step(0.001)
    .name("Small Waves Speed");

gui.addColor(debugOBJ, "depthColor").name("depth Color").onChange(() => {
  waterMaterial.uniforms.uDepthColor.value.set(debugOBJ.depthColor)
})
gui.addColor(debugOBJ, "surfaceColor").name("surface Color").onChange(() => {
  waterMaterial.uniforms.uSurfaceColor.value.set(debugOBJ.surfaceColor);
})

// Mesh
const mesh = new THREE.Mesh(geometry, waterMaterial);
mesh.rotation.x = - Math.PI * .5;
mesh.rotation.z = - Math.PI;

scene.add(mesh);

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
camera.position.set(0.25, -0.25, 1);
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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  waterMaterial.uniforms.uTime.value = elapsedTime;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
