import { OrbitControls, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, CylinderCollider, InstancedRigidBodies, Physics, RigidBody, Debug } from "@react-three/rapier";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useMemo, useRef, useState } from "react";
import { Euler, Quaternion } from "three";

export default function Experience() {
  const cubes = useRef();
  const cubeREF = useRef();
  const twisterREF = useRef();

  const model = useGLTF("./hamburger.glb");

  const [hitSound] = useState(() => new Audio("./hit.mp3"));

  const handleJump = () => {
    const mass = cubeREF.current.mass();

    cubeREF.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 });
    cubeREF.current.addTorque({
      x: Math.random() - 0.5,
      y: Math.random() - 0.5,
      z: Math.random() - 0.5,
    });
  };

  const { speedOfRotation, radius } = useControls("blender", {
    speedOfRotation: { value: 1, min: 1, max: 10 },
    radius: { value: 2, min: 1, max: 10 },
  });

  const cubeCount = 300

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const angle = time * 0.5;

    const eulerRotation = new Euler(0, time * speedOfRotation, 0);
    const quaternionRotation = new Quaternion();

    quaternionRotation.setFromEuler(eulerRotation);

    twisterREF.current.setNextKinematicRotation(quaternionRotation);

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;

    twisterREF.current.setNextKinematicTranslation({ x: x, y: -0.8, z: z });
  });

  const collisionEnter = () => {
    // COLLISION
  };


  const cubesTransforms = useMemo(() => {
    
    const positions = [];
    const rotations = [];
    const scales = [];


    for (let i = 0; i < cubeCount; i++) {
      positions.push([
        (Math.random() - 0.5) * 8,
        6 + i * 0.2,
        (Math.random() - 0.5) * 8,
      ]);
      rotations.push([Math.random(), Math.random(), Math.random()]); 

      const scale = .2 + Math.random() * .8
      scales.push([scale, scale, scale])
      
    }

    return { positions, rotations, scales };

  }, [])
  

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
      <ambientLight intensity={0.5} />

      <Physics gravity={[0, -9.81, 0]}>
        {/* <Debug /> */}
        <RigidBody colliders="ball" gravityScale={1} restitution={1}>
          <mesh castShadow position={[-1.5, 2, 0]}>
            <sphereGeometry />
            <meshStandardMaterial color="orange" />
          </mesh>
        </RigidBody>

        <RigidBody
          position={[0, -0.8, 0]}
          ref={twisterREF}
          friction={0}
          type="kinematicPosition"
        >
          <mesh castShadow scale={[0.4, 0.4, 3]}>
            <boxGeometry />
            <meshStandardMaterial color="red" />
          </mesh>
        </RigidBody>
        {/* <RigidBody colliders='trimesh'>
          <mesh castShadow position={[0, 1, 0]} rotation-x={Math.PI * .5}>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody> */}

        {/* <RigidBody
          colliders={false}
          position={[0, 1, 0]}
          rotation-x={Math.PI * 0.5}
        >
          <CuboidCollider args={[1.5, 1.5, 0.5]} />
          <CuboidCollider args={[.25, 1, 0.25]} position={[0, 0, 1]} rotation={[-Math.PI * .35, 0, 0]} />

          <BallCollider args={[ 1.5]}/>
          <mesh castShadow>
            <torusGeometry args={[1, 0.5, 16, 32]} />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
        </RigidBody> */}

        <RigidBody
          position={[1.5, 2, 0]}
          ref={cubeREF}
          // friction={0}
          onCollisionEnter={collisionEnter}
          //   onCollisionExit={() => {
          //     console.log('exit!')
          //   }}

          // onSleep={() => {
          //   console.log("sleep!");
          // }}
          // onWake={() => {
          //   console.log("WAKE!!");
          // }}
        >
          <mesh castShadow onClick={handleJump}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
          </mesh>
          <CuboidCollider args={[0.5, 0.5, 0.5]} mass={0.5} />
        </RigidBody>

        <RigidBody position={[0, 4, 0]} colliders={false}>
          <CylinderCollider args={[0.5, 1.25]} />
          <primitive object={model.scene} scale={0.25} />
        </RigidBody>

        <RigidBody type="fixed">
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, 5.25]} />
          <CuboidCollider args={[5, 2, 0.5]} position={[0, 1, -5.25]} />

          <CuboidCollider args={[0.5, 2, 5]} position={[5.25, 1, 0]} />
          <CuboidCollider args={[0.5, 2, 5]} position={[-5.25, 1, 0]} />
        </RigidBody>

        <RigidBody
          type="fixed"
          // restitution={1}
          //   friction={0}
          //   mass={1}
        >
          <mesh receiveShadow position-y={-1.25}>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="greenyellow" />
          </mesh>
        </RigidBody>

        {/* <InstancedRigidBodies>
          <instancedMesh
            ref={cubesREF}
            castShadow
            args={[null, null, cubeCount]}
          >
            <boxGeometry/>
            <meshStandardMaterial color='tomato'/>

          </instancedMesh>
        </InstancedRigidBodies> */}
        <InstancedRigidBodies
          positions={cubesTransforms.positions}
          rotations={cubesTransforms.rotations}
          scales={cubesTransforms.scales}
        >
          <instancedMesh ref={cubes} castShadow args={[null, null, cubeCount]}>
            <boxGeometry />
            <meshStandardMaterial color="tomato" />
            {/* <CuboidCollider args={[0.5, 0.5, 0.5]} mass={0.5} /> */}
          </instancedMesh>
        </InstancedRigidBodies>
      </Physics>
    </>
  );
}
