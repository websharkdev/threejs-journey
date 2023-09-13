import { Center, OrbitControls, Sparkles, shaderMaterial, useGLTF, useTexture } from '@react-three/drei'
import portalVertexShader from './shaders/portal/vertex.glsl'
import portalFragmentShader from './shaders/portal/fragment.glsl'
import { Color } from 'three';
import { useRef } from 'react';
import { extend, useFrame } from '@react-three/fiber';



const PortalMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorStart:  new Color("#fff"),
    uColorEnd: new Color("#141414"),
  },
  portalVertexShader,
  portalFragmentShader
);

export default function Experience() {

    const refSM = useRef()
    const {nodes} = useGLTF('./model/portal.glb')
    const texture = useTexture('./model/baked.jpg')

    extend({PortalMaterial})

    useFrame((state, delta) => {
      // refSM.current.uniforms.uTime.value = state.clock.elapsedTime
      refSM.current.uTime += delta;
    })

    return (
      <>
        <color args={["#201919"]} attach="background" />

        <OrbitControls makeDefault />

        <Center>
          <mesh geometry={nodes.baked.geometry}>
            <meshBasicMaterial map={texture} map-flipY={false} />
          </mesh>

          <mesh
            geometry={nodes.poleLightA.geometry}
            position={nodes.poleLightA.position}
          >
            <meshBasicMaterial color="#ffffe5" />
          </mesh>

          <mesh
            geometry={nodes.poleLightB.geometry}
            position={nodes.poleLightB.position}
          >
            <meshBasicMaterial color="#ffffe5" />
          </mesh>

          <mesh
            geometry={nodes.portalLight.geometry}
            position={nodes.portalLight.position}
            rotation={nodes.portalLight.rotation}
          >
            {/* <shaderMaterial vertexShader={portalVertexShader} side='doubleside' fragmentShader={portalFragmentShader} ref={refSM} uniforms={{
              uTime: {value: 0},
              uColorStart: {value: new Color('#fff')},
              uColorEnd: {value: new Color('#141414')},
            }}/> */}
            <portalMaterial ref={refSM} />
          </mesh>

          <Sparkles
            size={4}
            scale={[4, 2, 4]}
            position={[0, 1, 0]}
            speed={0.2}
            count={40}
          />
        </Center>
      </>
    );
}