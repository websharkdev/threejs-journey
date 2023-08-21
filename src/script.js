import * as dat from 'lil-gui'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

import firefliesVertexShader from './shaders/fireflies/vertex.glsl'
import firefliesVertexFragment from './shaders/fireflies/fragment.glsl'

import portalVertexShader from './shaders/portal/vertex.glsl'
import portalVertexFragment from './shaders/portal/fragment.glsl'

/**
 * Base
 */
// Debug
const debugOBJ = {}
const gui = new dat.GUI({
    width: 400
})


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)


const bakedTexture = textureLoader.load("./baked.jpg");

bakedTexture.flipY = false;

bakedTexture.encoding = THREE.sRGBEncoding



// baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture
})

// poly material
const polyLMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffe5
})

debugOBJ.portalCStart = '#141414'
debugOBJ.portalCEnd = '#fff'
// portal material
const portalLMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalVertexFragment,
  uniforms: {
    uTime: {
      value: 0,
    },
    uCStart: {
      value: new THREE.Color(debugOBJ.portalCStart),
    },
    uCEnd: {
      value: new THREE.Color(debugOBJ.portalCEnd),
    },
  },
});
gui
  .addColor(debugOBJ, "portalCEnd")
  .onChange(() =>
    portalLMaterial.uniforms.uCEnd.value.set(debugOBJ.portalCEnd)
  );
gui
  .addColor(debugOBJ, "portalCStart")
  .onChange(() =>
    portalLMaterial.uniforms.uCStart.value.set(debugOBJ.portalCStart)
  );


gltfLoader.load("./portal.glb", (gltf) => {
    console.log(gltf.scene.children);
    const bakedMESH = gltf.scene.children.find((child) => child.name === "baked");
    const portalLightMESH = gltf.scene.children.find((child) => child.name === "portalLight");
    const poleLightAMESH = gltf.scene.children.find(
        (child) => child.name === "poleLightA"
        );
        const poleLightBMESH = gltf.scene.children.find(
            (child) => child.name === "poleLightB"
            );
            
    bakedMESH.material = bakedMaterial;
    poleLightAMESH.material = polyLMaterial;
    poleLightBMESH.material = polyLMaterial;

    portalLightMESH.material = portalLMaterial;


    scene.add(gltf.scene);
});


// FIREFLIES
const firefliesGeometry = new THREE.BufferGeometry()
const firefliesCount = 30
const positionARR = new Float32Array(firefliesCount * 3)
const scaleArr = new Float32Array(firefliesCount * 1)


for (let i = 0; i < firefliesCount; i++) {
  positionARR[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionARR[i * 3 + 1] = Math.random() * 1.5;
  positionARR[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArr[i] = Math.random()
}


firefliesGeometry.setAttribute('position', new THREE.BufferAttribute(positionARR, 3))
firefliesGeometry.setAttribute(
  "aScale",
  new THREE.BufferAttribute(scaleArr, 1)
);


const firefliesMaterial = new THREE.ShaderMaterial({
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesVertexFragment,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  uniforms: {
    uPixelRatio: {
      value: Math.min(window.devicePixelRatio, 2),
    },
    uSize: {
        value: 100
    },
    uTime: {
        value: 0
    }
  },
});

gui.add(firefliesMaterial.uniforms.uSize, 'value').min(50).max(500).step(1)

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial)
scene.add(fireflies)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio,
      2
    );
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 4
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding



debugOBJ.clearColor = "#141414";

renderer.setClearColor(debugOBJ.clearColor);
gui.addColor(debugOBJ, "clearColor").onChange(() => renderer.setClearColor(debugOBJ.clearColor))
/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    firefliesMaterial.uniforms.uTime.value = elapsedTime
    portalLMaterial.uniforms.uTime.value = elapsedTime;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()