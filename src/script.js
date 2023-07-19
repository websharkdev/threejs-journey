import galaxyVertexShader from "./shaders/galaxy/vertex.glsl";
import galaxyFragmentShader from "./shaders/galaxy/fragment.glsl";
import * as dat from "lil-gui";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./style.css";

THREE.ColorManagement.enabled = false;
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

// GALAXY

const params = {
  count: 250000,
  size: 0.005,
  radius: 5,
  spin: 1,
  branches: 6,
  randomness: 0.5,
  randomnessPower: 3,
  colors: {
    inside: "#ff6030",
    outside: "#1b39b4",
  },
};

let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(params.count * 3);
  const colors = new Float32Array(params.count * 3);
  const randomness = new Float32Array(params.count * 3);
  const scales = new Float32Array(params.count * 1);

  const colorInside = new THREE.Color(params.colors.inside);
  const colorOutside = new THREE.Color(params.colors.outside);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2;

   const randomX =
     Math.pow(Math.random(), params.randomnessPower) *
     (Math.random() < 0.5 ? 1 : -1) *
     params.randomness *
     radius;
   const randomY =
     Math.pow(Math.random(), params.randomnessPower) *
     (Math.random() < 0.5 ? 1 : -1) *
     params.randomness *
     radius;
   const randomZ =
     Math.pow(Math.random(), params.randomnessPower) *
     (Math.random() < 0.5 ? 1 : -1) *
     params.randomness *
     radius;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    randomness[i3] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    // color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / params.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // scale

    scales[i] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aRandomness", new THREE.BufferAttribute(randomness, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));

  // material

  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: galaxyVertexShader,
    fragmentShader: galaxyFragmentShader,
    uniforms: {
      uTime: {value: 0},
      uSize: { value: 30 * renderer.getPixelRatio() },
    },
  });

  // points
  points = new THREE.Points(geometry, material);

  scene.add(points);
};

gui.add(params, "count", 100, 1000000, 100).onFinishChange(generateGalaxy);
gui.add(params, "radius", 0.01, 20, 0.01).onFinishChange(generateGalaxy);
gui.add(params, "branches", 2, 20, 1).onFinishChange(generateGalaxy);
gui.add(params, "randomness", 0, 2, 0.001).onFinishChange(generateGalaxy);
gui.add(params, "randomnessPower", 1, 10, 0.001).onFinishChange(generateGalaxy);
gui.addColor(params.colors, "inside").onFinishChange(generateGalaxy);
gui.addColor(params.colors, "outside").onFinishChange(generateGalaxy);

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
camera.position.x = 3;
camera.position.y = 3;
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

generateGalaxy();
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // UPDATE MATEIRAL

  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
