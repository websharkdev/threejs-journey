import './style.css'
import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

// Object
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
// const mesh = new THREE.Mesh(geometry, material)

// mesh.position.set(2, 1, 1)

// scene.add(mesh)

const axesHelper = new THREE.AxesHelper(1.5)
scene.add(axesHelper)

// Scale
// mesh.scale.x = 1
// mesh.scale.y = 2
// mesh.scale.z = 2

// Rotation

// mesh.rotation.y = Math.PI
// mesh.rotation.reorder('YXZ')
// mesh.rotation.set(Math.PI * 0.25, Math.PI * 0.25, 1);
// mesh.rotation.z = .5
// mesh.rotation.x = .5

// Objects

const group = new THREE.Group()

scene.add(group)


const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({color:'red'})
)
cube1.position.set(1, 2 , 1)

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({color:'white'})
)
cube2.position.set(3, 2 , 1)

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({color:'green'})
)
cube3.position.set(-1, 2 , 1)


group.add(cube1, cube2, cube3);

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
camera.position.y = 1
camera.position.x = 1
scene.add(camera)

// camera.lookAt(new THREE.Vector3(2, 1, 1))

// camera.lookAt(mesh.position)


// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('canvas.webgl'),
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)
