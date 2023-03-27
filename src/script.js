import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import * as dat from "dat.gui";
import {
  DoorColorImage,
  DoorAlphaImage,
  DoorNormalImage,
  DoorHeightImage,
  DoorMetalnessImage,
  DoorRoughnessImage,
  DoorAmbientOcclusionImage} from './textures/door'
import {
  BricksColorImage,
  BricksNormalImage,
  BricksRoughnessImage,
  BricksAmbientOcclusionImage,
} from "./textures/bricks";
import {
  GrassColorImage,
  GrassNormalImage,
  GrassRoughnessImage,
  GrassAmbientOcclusionImage,
} from "./textures/grass";

const textureLoader = new THREE.TextureLoader();

// TEXTURES
const doorTexture = textureLoader.load(DoorColorImage);
const doorAlphaTexture = textureLoader.load(DoorAlphaImage);
const doorAmbientOcclusionTexture = textureLoader.load(DoorAmbientOcclusionImage);
const doorHeightTexture = textureLoader.load(DoorHeightImage);
const doorNormalTexture = textureLoader.load(DoorNormalImage);
const doorMetalnessTexture = textureLoader.load(DoorMetalnessImage);
const doorRoughnessTexture = textureLoader.load(DoorRoughnessImage);
// BRICKS Textures
const bricksTexture = textureLoader.load(BricksColorImage);
const bricksAmbientOcclusionTexture = textureLoader.load(
  BricksAmbientOcclusionImage
);
const bricksNormalTexture = textureLoader.load(BricksNormalImage);
const bricksRoughnessTexture = textureLoader.load(BricksRoughnessImage);
// GRASS Textures
const grassTexture = textureLoader.load(GrassColorImage);
const grassAmbientOcclusionTexture = textureLoader.load(
  GrassAmbientOcclusionImage
);
const grassNormalTexture = textureLoader.load(GrassNormalImage);
const grassRoughnessTexture = textureLoader.load(GrassRoughnessImage);

grassTexture.repeat.set(8, 8)
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassTexture.wrapS = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
grassNormalTexture.wrapS = THREE.RepeatWrapping
grassRoughnessTexture.wrapS = THREE.RepeatWrapping

grassTexture.wrapT = THREE.RepeatWrapping
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
grassNormalTexture.wrapT = THREE.RepeatWrapping
grassRoughnessTexture.wrapT = THREE.RepeatWrapping


// DebugUI
const gui = new dat.GUI();
const debugParameters = {
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
// Fog
const fog = new THREE.Fog('#262837', 1, 15)

// Home

const home = new THREE.Group()
 
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(2, 1, 2, 1, 1, 1),
  new THREE.MeshStandardMaterial({
    map: bricksTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);

walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);

const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(2, 1, 4),
  new THREE.MeshStandardMaterial({
    color: "#b35f4f",
  })
);
roof.position.y = 1
roof.rotation.y = Math.PI * .25



const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(0.8, 0.8, 10, 10),
  new THREE.MeshStandardMaterial({
    map: doorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    displacementMap: doorHeightTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementScale: .01,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.z = 1 + 0.001
door.position.y = -.139




// Bushes 
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#89c854'
})

// Bush
const bush = new THREE.Mesh(bushGeometry, bushMaterial)
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)

bush.scale.set(.2, .2, .2)
bush.position.set(.5,-.5, 1.5)

bush1.scale.set(.1, .1, .1)
bush1.position.set(0.4, -0.5, 1.3);

bush2.scale.set(.18, .18, .18)
bush2.position.set(-0.6, -0.4, 1.7);

bush3.scale.set(.25, .25, .25)
bush3.position.set(.8, -0.3, 1.3);

bush4.scale.set(.1, .1, .1)
bush4.position.set(-.8, -0.5, 1.8);

const bushes = new THREE.Group();

bushes.add(bush, bush1, bush2, bush3, bush4);
home.add(walls, roof, door, bushes);



// Graves
const graves = new THREE.Group()

const graveGeometry = new THREE.BoxBufferGeometry(.05, .2, .2)
const graveMaterial = new THREE.MeshStandardMaterial({
  color: '#b2b6b1'
})

for (let i = 0; i < 50; i++) {
  // formula 2 * Math.PI

  const angle = Math.random() * Math.PI * 2
  const radius = 2.5 + Math.random() * 2
  const x = Math.sin(angle) * radius
  const verticle = Math.cos(angle) * radius
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  
  grave.position.set(x,-.45, verticle)
  grave.rotation.y = (Math.random() - .5) * .4
  grave.rotation.x = (Math.random() - .5) * .4
  grave.rotation.z = (Math.random() - .5) * .4

  graves.add(grave)
  
}

scene.add(home, graves);
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(15, 15),
  new THREE.MeshStandardMaterial({
    map: grassTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);


floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.5;
floor.receiveShadow = true;

scene.add(floor);



const ambientLight = new THREE.AmbientLight("#f1f1f1", 0.5);
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);

moonLight.position.set(4, 5, -2);

const doorLight = new THREE.PointLight("#ff7d46", 1, 7);

doorLight.position.set(0, .2, 1.3)


scene.add(moonLight, ambientLight, doorLight);



const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
const ghost3 = new THREE.PointLight('#ff0000', 2, 3)

scene.add(ghost1, ghost2, ghost3);
// pointLight.position.set(-1, 1, 0);
// // size
// pointLight.shadow.mapSize.width = 1024;
// pointLight.shadow.mapSize.height = 1024;
// // near \ far
// pointLight.shadow.camera.near = 0.1;
// pointLight.shadow.camera.far = 5;

// pointLight.castShadow = true;

// scene.add(moonLight);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.z = 2;
camera.lookAt(home);
scene.add(camera);
scene.fog = fog

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.setClearColor("#262837");
// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // update ghost
  const ghost1Angle = elapsedTime * .5
  ghost1.position.x = Math.cos(ghost1Angle) * Math.PI 
  ghost1.position.z = Math.sin(ghost1Angle) * Math.PI 
  ghost1.position.y = Math.sin(ghost1Angle * 3 )
  
  const ghost2Angle = -elapsedTime * .32
  ghost2.position.x = Math.cos(ghost2Angle) * 5; 
  ghost2.position.z = Math.sin(ghost2Angle) * 5; 
  ghost2.position.y = Math.sin(ghost2Angle * 4) + Math.sin(ghost1Angle * 3);
  
  const ghost3Angle = -elapsedTime * .18
  ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * .32))
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * .32))
  ghost3.position.y = Math.sin(ghost3Angle * 3 )
  controls.update();
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
