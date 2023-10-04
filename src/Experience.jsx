import { OrbitControls, meshBounds, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Bloom, DepthOfField, EffectComposer, Glitch, Noise, SSR, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'
import { BlendFunction, GlitchMode } from 'postprocessing'
import { Perf } from 'r3f-perf'
import { useRef } from 'react'

export default function Experience()
{
    // const cube = useRef()
    
    const gamburgerM = useGLTF('./hamburger.glb')

    // useFrame((state, delta) =>
    // {
    //     cube.current.rotation.y += delta * 0.2
    // })

    // const eventHandler = (e) => { 
    //     e.object.material.color.set(
    //       `hsl(${Math.random() * 360}, 100%, 75%)`
    //     );

        
    //  }

    // const effects = useControls({
    //   temporalResolve: true,
    //   STRETCH_MISSED_RAYS: true,
    //   USE_MRT: true,
    //   USE_NORMALMAP: true,
    //   USE_ROUGHNESSMAP: true,
    //   ENABLE_JITTERING: true,
    //   ENABLE_BLUR: true,
    //   temporalResolveMix: { value: 0.9, min: 0, max: 1 },
    //   temporalResolveCorrectionMix: { value: 0.25, min: 0, max: 1 },
    //   maxSamples: { value: 0, min: 0, max: 1 },
    //   resolutionScale: { value: 1, min: 0, max: 1 },
    //   blurMix: { value: 0.5, min: 0, max: 1 },
    //   blurKernelSize: { value: 8, min: 0, max: 8 },
    //   blurSharpness: { value: 0.5, min: 0, max: 1 },
    //   rayStep: { value: 0.3, min: 0, max: 1 },
    //   intensity: { value: 1, min: 0, max: 5 },
    //   maxRoughness: { value: 0.1, min: 0, max: 1 },
    //   jitter: { value: 0.7, min: 0, max: 5 },
    //   jitterSpread: { value: 0.45, min: 0, max: 1 },
    //   jitterRough: { value: 0.1, min: 0, max: 1 },
    //   roughnessFadeOut: { value: 1, min: 0, max: 1 },
    //   rayFadeOut: { value: 0, min: 0, max: 1 },
    //   MAX_STEPS: { value: 20, min: 0, max: 20 },
    //   NUM_BINARY_SEARCH_STEPS: { value: 5, min: 0, max: 10 },
    //   maxDepthDifference: { value: 3, min: 0, max: 10 },
    //   maxDepth: { value: 1, min: 0, max: 1 },
    //   thickness: { value: 10, min: 0, max: 10 },
    //   ior: { value: 1.45, min: 0, max: 2 },
    // });
  
    return (
      <>
        <OrbitControls makeDefault />

        <color args={["#fff"]} attach="background" />

        <Perf position="top-left" />
        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight castShadow intensity={0.5} />
        {/* 
        <primitive
          object={gamburgerM.scene}
          scale={0.25}
          position-y={0.5}
          onClick={(e) => {
            e.stopPropagation();
            console.log(e);
          }}
          castShadow
        /> */}

        <EffectComposer>
          {/* <EffectComposer multisampling={0}> */}
          {/* <Vignette offset={.3} darkness={.9}/>
          <Glitch
            delay={[0.5, 1]}
            duration={[0.1, 0.3]}
            strength={[0.2, 0.4]}
            mode={GlitchMode.SPORADIC}
          />
          <Noise blendFunction={BlendFunction.SOFT_LIGHT} premultiply />
          <Bloom mipmapBlur />
          <DepthOfField focusDistance={.025} focalLength={.025}  bokehScale={6} /> */}
          {/* <SSR {...effects} /> */}
        </EffectComposer>
        <mesh
          castShadow
          position-x={-2}
          // onClick={(e) => e.stopPropagation()}
          // onPointerLeave={() => {
          //   document.body.style.cursor = "default";
          // }}
          // onPointerEnter={() => {
          //   document.body.style.cursor = "pointer";
          // }}
        >
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>

        <mesh
          // ref={cube}
          // raycast={meshBounds}
          castShadow
          position-x={2}
          scale={1.5}
          // onClick={eventHandler}
          // onPointerLeave={() => {
          //   document.body.style.cursor = "default";
          // }}
          // onPointerEnter={() => {
          //   document.body.style.cursor = "pointer";
          // }}
        >
          <boxGeometry />
          <meshStandardMaterial color="orange" />
          {/* <meshStandardMaterial
            color={[2.5, 1, 4]}
            toneMapped={false}
          /> */}
          {/* <meshStandardMaterial
            color="#ffffff"
            emissive="orange"
            emissiveIntensity={10}
            // color={[2.5, 1, 4]}
            toneMapped={false}
          /> */}
        </mesh>

        <mesh
          receiveShadow
          position-y={-1}
          rotation-x={-Math.PI * 0.5}
          scale={10}
        >
          <planeGeometry />
          <meshStandardMaterial color="black" metalness={0} roughness={0}/>
        </mesh>
      </>
    );
}