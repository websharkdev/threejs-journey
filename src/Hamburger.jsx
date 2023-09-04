// import { Clone, useGLTF } from "@react-three/drei";

// export default function Hamburger() {

    
//   const model = useGLTF("./hamburger.glb");

//   return (
//     <>
//       <Clone
//         object={model.scene}
//         scale={0.35}
//         position-y={-1}
//         position-x={-4}
//       />
//       <Clone
//         object={model.scene}
//         scale={0.35}
//         position-y={-1}
//         position-x={-0}
//       />
//       <Clone
//         object={model.scene}
//         scale={0.35}
//         position-y={-1}
//         position-x={4}
//       />
//     </>
//   );
// }

// useGLTF.preload("./hamburger.glb");


import { useGLTF } from "@react-three/drei";

export default function Hamburger(props) {
  const { nodes, materials } = useGLTF("/hamburger-draco.glb");
  return (
    <group {...props} dispose={null} scale={.35}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.bottomBun.geometry}
        material={materials.BunMaterial}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.meat.geometry}
        material={materials.SteakMaterial}
        position={[0, 2.8, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.cheese.geometry}
        material={materials.CheeseMaterial}
        position={[0, 3, 0]}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.topBun.geometry}
        material={materials.BunMaterial}
        position={[0, 1.8, 0]}
      />
    </group>
  );
}

useGLTF.preload("/hamburger-draco.glb");
