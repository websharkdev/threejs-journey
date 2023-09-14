import { useFrame } from '@react-three/fiber'
import { OrbitControls, meshBounds, useGLTF } from '@react-three/drei'
import { useRef } from 'react'
import { Color } from 'three'

export default function Experience()
{
    const cube = useRef()
    
    const gamburgerM = useGLTF('./hamburger.glb')

    useFrame((state, delta) =>
    {
        cube.current.rotation.y += delta * 0.2
    })

    const eventHandler = (e) => { 
        e.object.material.color.set(
          `hsl(${Math.random() * 360}, 100%, 75%)`
        );

        
     }

    return (
      <>
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <primitive object={gamburgerM.scene} scale={.25} position-y={.5} onClick={(e) => {
            e.stopPropagation()
            console.log(e)
        }}/>

        <mesh
          position-x={-2}
          onClick={(e) => e.stopPropagation()}
          onPointerLeave={() => {
            document.body.style.cursor = "default";
          }}
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }}
        >
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh
          ref={cube}
          raycast={meshBounds}
          position-x={2}
          scale={1.5}
          onClick={eventHandler}
          onPointerLeave={() => {
            document.body.style.cursor = "default";
          }}
          onPointerEnter={() => {
            document.body.style.cursor = "pointer";
          }}
        >
          <boxGeometry />
          <meshStandardMaterial color="mediumpurple" />
        </mesh>

        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <meshStandardMaterial color="greenyellow" />
        </mesh>
      </>
    );
}