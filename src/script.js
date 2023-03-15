import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import gsap from "gsap";
import * as dat from "dat.gui";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";
import {TextureShapeImage} from './textures'

const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load(TextureShapeImage);

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

const fontLoader = new FontLoader()

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Bortnytskyi Oleksii", {
    font,
    size: .5,
    height: .2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: .02,
    bevelOffset: 0,
    bevelSegments: 4
  });

  // textGeometry.computeBoundingBox()

  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
  //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
  // );

  textGeometry.center()

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  const text = new THREE.Mesh(textGeometry, textMaterial)

  scene.add(text)

  const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45)
  const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
  
  console.time('donut')
  for(let i = 0; i < 100; i++) {
    // const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45)
    // const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
    
    const donut = new THREE.Mesh(donutGeometry, donutMaterial)

    donut.position.x = (Math.random() - .5 ) * 10
    donut.position.y = (Math.random() - .5 ) * 10
    donut.position.z = (Math.random() - .5 ) * 10

    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI


    const donutScale = Math.random()
    donut.scale.x = donutScale
    donut.scale.y = donutScale
    donut.scale.z = donutScale

    scene.add(donut)


  }
  console.timeEnd('donut')
});


// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

// Object
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 5, 5, 5);

const material = new THREE.MeshStandardMaterial();
// LIGHTS


const ambientLight = new THREE.AmbientLight("#fff", 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight("#fff", 0.5);

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;

scene.add(pointLight);

const mesh = new THREE.Mesh(geometry, material);


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
// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects

  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
