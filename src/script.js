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

// GALAXY

const params = {
  count: 1000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  radnomness: 1,
  radnomnessPower: 3,
  colors: {
    inside: '#ff6030',
    outside: '#1b39b4',
  }
}


let geometry = null
let material = null
let points = null

const generateGalaxy = () => { 
  if(points !== null) {
    geometry.dispose()
    material.dispose() 
    scene.remove(points);
  }


  geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)

  const colorInside = new THREE.Color(params.colors.inside)
  const colorOutside = new THREE.Color(params.colors.outside)

  for (let i = 0; i < params.count; i++) { 

    
    
    const i3 = i * 3
    const radius = Math.random() * params.radius 
    const spinAngle =  radius * params.spin
    const branchAngle = (i % params.branches) / params.branches * Math.PI * 2
    
    const randomX = Math.pow(Math.random(), params.radnomnessPower) * (Math.random() < 0.5 ? 1.5 : -1.5) 
    const randomY = Math.pow(Math.random(), params.radnomnessPower) * (Math.random() < 0.5 ? 1.5 : -1.5) 
    const randomZ = Math.pow(Math.random(), params.radnomnessPower) * (Math.random() < 0.5 ? 1.5 : -1.5) 
    
    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;  
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    
    // color
    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / params.radius)

    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  // material

  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })

  // points
  points = new THREE.Points(geometry, material)

  scene.add(points)
 }


 gui.add(params, 'count', 100, 100000, 100).onFinishChange(generateGalaxy)
 gui.add(params, 'size', 0.01, 0.5, 0.01).onFinishChange(generateGalaxy)
 gui.add(params, 'radius', 0.001, 20, 1).onFinishChange(generateGalaxy)
 gui.add(params, "branches", 2, 20, 1).onFinishChange(generateGalaxy);
 gui.add(params, "spin", -5, 5, .1).onFinishChange(generateGalaxy);
 gui.add(params, "radnomness", 0, 5, 0.1).onFinishChange(generateGalaxy);
 gui.add(params, "radnomnessPower", 1, 10, 0.1).onFinishChange(generateGalaxy);
 gui.addColor(params.colors, "inside").onFinishChange(generateGalaxy);
 gui.addColor(params.colors, "outside").onFinishChange(generateGalaxy);

 generateGalaxy()
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
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
