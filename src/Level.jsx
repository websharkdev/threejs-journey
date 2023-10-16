import { Float, Text, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { useMemo, useRef, useState } from "react";
import { BoxGeometry, Euler, MeshStandardMaterial, Quaternion } from "three";

const boxGeometry = new BoxGeometry(1, 1, 1);
const startMaterial = new MeshStandardMaterial({
  color: "limegreen",
  metalness: 0,
  roughness: 0,
});
const floorMaterial = new MeshStandardMaterial({
  color: "greenyellow",
  metalness: 0,
  roughness: 0,
});
const obstacleMaterial = new MeshStandardMaterial({
  color: "orangered",
  metalness: 0,
  roughness: 1,
});
const wallMaterial = new MeshStandardMaterial({
  color: "slategrey",
  metalness: 0,
  roughness: 0,
});

const BlockStart = ({ position = [0, 0, 0] }) => {
  return (
    <group position={position}>
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        material={startMaterial}
      />

      <Float floatIntensity={.25} rotationIntensity={.25}>
        <Text font="./bebas-neue-v9-latin-regular.woff" maxWidth={.25} lineHeight={.75} textAlign="right" position={[0.75, .65, 0]} rotation-y={-0.25} fontSize={.35}>
          Marble Race
          <meshBasicMaterial toneMapped={false}/>
        </Text>
      </Float>
    </group>
  );
};

export const BlockSpiner = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();
  const [speed] = useState(
    () => (Math.random() + 0.2) * (Math.random() < 0.5 ? -1 : 1)
  );

  useFrame((state, _) => {
    const time = state.clock.elapsedTime;

    const rotation = new Quaternion();
    rotation.setFromEuler(new Euler(0, speed * time, 0));
    obstacle.current.setNextKinematicRotation(rotation);
  });
  return (
    <group position={position}>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          castShadow
          position={[0, 0, 0]}
          geometry={boxGeometry}
          scale={[3, 0.25, 0.25]}
          material={obstacleMaterial}
        />
      </RigidBody>

      {/* <RigidBody type="fixed"> */}
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        material={floorMaterial}
      />
      {/* </RigidBody> */}
    </group>
  );
};

export const BlockLimbo = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state, _) => {
    const time = state.clock.elapsedTime;
    const y = Math.sin(time + timeOffset) + 1.15;

    obstacle.current.setNextKinematicTranslation({
      x: position[0],
      y: position[1] + y,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          castShadow
          position={[0, 0, 0]}
          geometry={boxGeometry}
          scale={[3, 0.25, 0.25]}
          material={obstacleMaterial}
        />
      </RigidBody>

      {/* <RigidBody type="fixed"> */}
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        material={floorMaterial}
      />
      {/* </RigidBody> */}
    </group>
  );
};

export const BlockAxe = ({ position = [0, 0, 0] }) => {
  const obstacle = useRef();
  const [timeOffset] = useState(() => Math.random() * Math.PI * 2);

  useFrame((state, _) => {
    const time = state.clock.elapsedTime;
    const x = Math.sin(time + timeOffset) * 1.25;

    obstacle.current.setNextKinematicTranslation({
      x: position[0] + x,
      y: position[1] + 1,
      z: position[2],
    });
  });
  return (
    <group position={position}>
      <RigidBody
        type="kinematicPosition"
        position={[0, 0.3, 0]}
        restitution={0.2}
        friction={0}
        ref={obstacle}
      >
        <mesh
          castShadow
          position={[0, 0, 0]}
          geometry={boxGeometry}
          scale={[1.5, 1.5, 0.3]}
          material={obstacleMaterial}
        />
      </RigidBody>

      {/* <RigidBody type="fixed"> */}
      <mesh
        receiveShadow
        position={[0, -0.1, 0]}
        geometry={boxGeometry}
        scale={[4, 0.2, 4]}
        material={floorMaterial}
      />
      {/* </RigidBody> */}
    </group>
  );
};

const BlockEnd = ({ position = [0, 0, 0] }) => {
  const model = useGLTF("./hamburger.glb");

  model.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  return (
    <group position={position}>
      <Float floatIntensity={0.25} rotationIntensity={0.25}>
        <Text
          font="./bebas-neue-v9-latin-regular.woff"
          maxWidth={0.25}
          lineHeight={0.75}
          textAlign="right"
          position={[0, 2.65, 0]}
          rotation-y={-0.25}
          fontSize={1}
          scale={2}
        >
          Finish!
          <meshBasicMaterial toneMapped={false} />
        </Text>
      </Float>
      <mesh
        receiveShadow
        position={[0, -0.05, 0]}
        geometry={boxGeometry}
        scale={[4, 0.3, 4]}
        material={startMaterial}
      />
      <RigidBody
        type="fixed"
        colliders="hull"
        restitution={0.2}
        friction={0}
        position={[0, 0.25, 0]}
      >
        <primitive object={model.scene} scale={0.25} />
      </RigidBody>
    </group>
  );
};

const Bounds = ({length = 1}) => {
  return (
    <group>
      <RigidBody
        type="fixed"
        restitution={0.2}
        friction={0}
        position={[0, 0, 0]}
      >
        <mesh
          castShadow
          receiveShadow
          position={[-2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          scale={[0.3, 1.5, 4 * length]}
          material={wallMaterial}
        />
        <mesh
          castShadow
          position={[2.15, 0.75, -(length * 2) + 2]}
          geometry={boxGeometry}
          scale={[0.3, 1.5, 4 * length]}
          material={wallMaterial}
        />
        <mesh
          castShadow
          receiveShadow
          position={[0, 0.75, -(length * 4) + 2 + 0.15]}
          geometry={boxGeometry}
          scale={[4, 1.5, 0.3]}
          material={wallMaterial}
        />
        <CuboidCollider args={[2, .1, 2 * length]} position={[0, - .1, - (length * 2) + 2]} restitution={.2} friction={1}/>
      </RigidBody>
    </group>
  );
 }

export const Level = ({
  count = 5,
  types = [BlockSpiner, BlockAxe, BlockLimbo],
  seed = 0
}) => {
  const blocks = useMemo(() => {
    const blocks = []
    
    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];

      blocks.push(type)
    }

    return blocks
  }, [count, types, seed])

  return (
    <>
      <BlockStart position={[0, 0, 0]} />


      {blocks.map((Block, id) => (
        <Block key={id} position={[0, 0, -(id + 1) * 4]} />
      ))}
      <BlockEnd position={[0, 0, -(count + 1) * 4]} />
      <Bounds length={count + 2} />
    </>
  );
};
