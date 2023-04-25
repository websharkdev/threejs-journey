import * as THREE from "three";
import * as dat from "lil-gui";
import { gsap } from "gsap";

/**
 * Debug
 */
const gui = new dat.GUI();

const parameters = {
  materialColor: "#ffeded",
};

gui
  .addColor(parameters, "materialColor")
  .onChange(() => material.color.set(parameters.materialColor));

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();


// Textures
const textureLoader = new THREE.TextureLoader()
const gradientTexture = textureLoader.load('textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter
/**
 * Test cube
 */
const material = new THREE.MeshToonMaterial({
  color: parameters.materialColor,
  gradientMap: gradientTexture,
});

const objectsDistance = 4
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);

const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material);

const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);


const sectionsMeshes = [mesh1, mesh2, mesh3]

scene.add(mesh1, mesh2, mesh3);

sectionsMeshes.map((mesh, index) => {
  mesh.position.y = -objectsDistance * index;
  mesh.position.x = index % 2 ? -2 : 2
})

// Particles
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() -.5) * 10
  positions[i * 3 + 1] =
    objectsDistance * 0.5 - Math.random() * objectsDistance * sectionsMeshes.length
  positions[i * 3 + 2] = (Math.random() -.5) * 10
  
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: .03
})

const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
// const particles = new THREE.

// light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
directionalLight.position.set(1, 1, 0);

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

// SCROLL
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;

  const newSection = Math.round(scrollY / sizes.height)

  if(newSection !== currentSection) {
    currentSection = newSection
    
    gsap.to(sectionsMeshes[currentSection].scale, {
      duration: 1.5,
      ease: "power2.inOut",
    });
  }
})


// cursor

const cursor = {
  x: 0,
  y: 0,
}


window.addEventListener('mousemove', (e) => {
  cursor.x = e.clientX / sizes.width - .5
  cursor.y = e.clientY / sizes.height - .5
})
/**
 * Camera
*/

// GROUP
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previesTime = 0
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previesTime
  previesTime = elapsedTime 
  // animate camera
  camera.position.y = - scrollY / sizes.height * objectsDistance;

  // parallax
  const parallaxX = -cursor.x
  const parallaxY = cursor.y

  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * .1 
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * .1 

  // animate meshes
  for(const mesh of sectionsMeshes) {
    mesh.rotation.x = elapsedTime * 0.2;
    mesh.rotation.y = elapsedTime * 0.12;
  }

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
