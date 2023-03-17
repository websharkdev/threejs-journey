import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import gsap from "gsap";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import BakedShadowImage from "./textures/bakedShadow.jpg";
import SimpleShadowImage from "./textures/simpleShadow.jpg";
import typefaceFont from "./fonts/helvetiker_regular.typeface.json";

const textureLoader = new THREE.TextureLoader();
// const bakedShadow = textureLoader.load(BakedShadowImage);
const simpleShadow = textureLoader.load(SimpleShadowImage);

// DebugUI
const gui = new dat.GUI();
const debugParameters = {
  color: "#f00",
  spin: () => {
    gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 4 });
  },
};

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

window.addEventListener("dblclick", () => {
  const fullscreenElement =
    document.fullscreenElement || document.webkitfullscreenElement;

  fullscreenElement ? document.exitFullscreen() : canvas.requestFullscreen();
});

const cursor = {
  x: 0,
  y: 0,
};

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);
});

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// Font loader

// const fontLoader = new FontLoader()

// fontLoader.load("./fonts/helvetiker_regular.typeface.json", (font) => {
//   const textGeometry = new TextGeometry("Bortnytskyi Oleksii", {
//     font,
//     size: 0.5,
//     height: 0.2,
//     curveSegments: 5,
//     bevelEnabled: true,
//     bevelThickness: 0.03,
//     bevelSize: 0.02,
//     bevelOffset: 0,
//     bevelSegments: 4,
//   });

//   // textGeometry.computeBoundingBox()

//   // textGeometry.translate(
//   //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
//   //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
//   //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
//   // );

//   textGeometry.center();

//   const textMaterial = new THREE.MeshMatcapMaterial({
//     // matcap: matcapTexture,
//     color: "#fff"
//   });

//   const text = new THREE.Mesh(textGeometry, textMaterial);

//   scene.add(text);

//   const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
//   const donutMaterial = new THREE.MeshMatcapMaterial({
//     matcap: matcapTexture,
//   });

//   console.time("donut");
//   for (let i = 0; i < 100; i++) {
//     const donut = new THREE.Mesh(donutGeometry, donutMaterial);

//     donut.position.x = (Math.random() - 0.5) * 10;
//     donut.position.y = (Math.random() - 0.5) * 10;
//     donut.position.z = (Math.random() - 0.5) * 10;

//     donut.rotation.x = Math.random() * Math.PI;
//     donut.rotation.y = Math.random() * Math.PI;

//     const donutScale = Math.random();
//     donut.scale.x = donutScale;
//     donut.scale.y = donutScale;
//     donut.scale.z = donutScale;

//     scene.add(donut);
//   }
//   console.timeEnd("donut");
// });

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// Object
// const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 5, 5, 5);
const square = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

const material = new THREE.MeshStandardMaterial({
  color: "#fff",
});
// LIGHTS

// Floor

const plane = new THREE.PlaneGeometry(5, 5);
const floorMaterial = new THREE.MeshStandardMaterial({
  color: "#f2f2f2",
  // map: simpleShadow,
});

const floor = new THREE.Mesh(plane, floorMaterial);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.5;
const mesh = new THREE.Mesh(square, material);

mesh.position.y = 0.3;
mesh.castShadow = true;
floor.receiveShadow = true;

const meshShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.MeshBasicMaterial({
    color: "#ccc",
    transparent: true,
    alphaMap: simpleShadow
  })
);

meshShadow.rotation.x = -Math.PI * 0.5
meshShadow.position.y = floor.position.y + 0.01

scene.add(floor, mesh, meshShadow);
const ambientLight = new THREE.AmbientLight("#fff", 0.5);

ambientLight.castShadow = true;
const directionalLight = new THREE.DirectionalLight("#fff", 0.8);

directionalLight.position.set(2, 2, 2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// position
directionalLight.shadow.camera.top = 2;
directionalLight.shadow.camera.bottom = -2;
directionalLight.shadow.camera.left = 2;
directionalLight.shadow.camera.right = -2;
// blur
// directionalLight.shadow.radius = 10

scene.add(directionalLight, ambientLight);

const directionalLightCH = new THREE.CameraHelper(
  directionalLight.shadow.camera
);

scene.add(directionalLightCH);

const pointLight = new THREE.PointLight("green", 0.3);
const pointLightCH = new THREE.CameraHelper(pointLight.shadow.camera);

pointLight.position.set(-1, 1, 0);
// size
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
// near \ far
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;

pointLight.castShadow = true;

scene.add(pointLight, pointLightCH);

const spotLight = new THREE.SpotLight("pink", 0.4, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
// size
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
// flow
spotLight.shadow.camera.fov = 30;
// near \ far
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

const spotLightHelper = new THREE.CameraHelper(spotLight.shadow.camera);
// scene.add(spotLight, spotLightHelper, spotLight.target);

// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;

// scene.add(pointLight);

gui.addColor(debugParameters, "color").onChange(() => {
  material.color.set(debugParameters.color);
});

gui.add(debugParameters, "spin");

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// renderer.shadowMap.enabled = true
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFShadowMap;
// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  mesh.position.x = Math.cos(elapsedTime) * 1.5;
  mesh.position.z = Math.sin(elapsedTime) * 1.5
  mesh.position.y = Math.abs(Math.sin(elapsedTime * 3)) 
  
  // shadow update
  meshShadow.position.x = mesh.position.x
  meshShadow.position.z = mesh.position.z
  mesh.material.opacity = 1 - mesh.position.y

  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
