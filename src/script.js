import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import CANNON from "cannon";
/**
 * Debug
 */
const gui = new dat.GUI();
const debugObj = {}

debugObj.createSphere = () => {
    // createSphere(0.5, {
    //     x: 0,
    //     y: 3,
    //     z: 0,
    // })
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
}

gui.add(debugObj, 'createSphere')

debugObj.createBox = () => {
    createBoxes(
      {
        width: Math.random() * 0.5,
        height: Math.random() * 0.5,
        depth: Math.random() * 0.5,
      },
      {
        x: (Math.random() - 0.5) * 3,
        y: 3,
        z: (Math.random() - 0.5) * 3,
      }
    );
}

gui.add(debugObj, "createBox");

debugObj.reset = () => {
    objects2Update.forEach((obj) => {
        obj.body.removeEventListener("collide", (e) => playHitSound(e));
        world.remove(obj.body)

        scene.remove(obj.mesh)
    })
}

gui.add(debugObj, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) => {
    const impactStregth = collision.contact.getImpactVelocityAlongNormal();
    if (impactStregth > 1.5) {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0;
        hitSound.play()
    } 
}
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

// Physics
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world) // for PERFOMANCE TIMECODE 1.26
world.allowSleep = true // for PERFOMANCE TIMECODE 1.30
world.gravity.set(0, -9.82, 0);

// MATRIALS
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic");

const defaultMaterial = new CANNON.Material("default");

// const contcretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

// world.addContactMaterial(contcretePlasticContactMaterial);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// // Sphere

// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   //   material: plasticMaterial,
// //   material: defaultContactMaterial, // OR
// });

// sphereBody.applyLocalForce(new CANNON.Vec3(150, 0, 0), new CANNON.Vec3(0, 0, 0))

// world.addBody(sphereBody);

// /**
//  * Test sphere
//  */
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//     envMapIntensity: 0.5,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

// Floor CANNON

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
  mass: 0,
  shape: floorShape,
  //   material: concreteMaterial,
  //   material: defaultContactMaterial, // OR
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// UTILS
const objects2Update = [];

const SphereGeometry = new THREE.SphereGeometry(1, 20, 20) // if will be rad > we get an error, so we will change it to 1 and SCALE on rad
const SphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});


const createSphere = (rad, pos) => {
  // THREE mesh
  const mesh = new THREE.Mesh(
    SphereGeometry,
    // new THREE.SphereGeometry(rad, 20, 20),
    SphereMaterial
  );
  mesh.scale.set(rad, rad, rad)
  mesh.castShadow = true;

  mesh.position.copy(pos);
  scene.add(mesh);

  // CANNON body
  const shape = new CANNON.Sphere(rad);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });

  body.position.copy(pos);
  world.addBody(body);

  // Save in objects2Update
  objects2Update.push({
    mesh,
    body,
  });
};

createSphere(0.5, { x: 0, y: 3, z: 0 });


const createBoxes = (size, position) => {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(size.width, size.height, size.depth),
    SphereMaterial
  );
  mesh.castShadow = true;

  mesh.position.copy(position);
  scene.add(mesh);

  // CANNON body
  const shape = new CANNON.Box(
    new CANNON.Vec3(size.width * 0.5, size.height * 0.5, size.depth * 0.5)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });

  body.position.copy(position);

  body.addEventListener("collide", (e) => playHitSound(e));
  world.addBody(body);

  // Save in objects2Update
  objects2Update.push({
    mesh,
    body,
  });
}

createBoxes({
    width: 1,
    height: 1,
    depth: 1,
}, { x: 0, y: 3, z: 0 });

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  //   sphereBody.applyForce(new CANNON.Vec3(-.5, 0, 0), sphereBody.position)

  objects2Update.forEach((obj) => {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion)
  });
  world.step(1 / 60, deltaTime, 3); // 1s / 60 FPS

  // Update sphere

  // sphere.position.copy(sphereBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
