import { OrbitControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { Suspense, lazy } from "react";

const Hamburger = lazy(() => import("./Hamburger"));
const Helmet = lazy(() => import("./Helmet"));
const Placeholder = lazy(() => import("./Placeholder"));
const Fox = lazy(() => import("./Fox"));

export default function Experience() {
  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <directionalLight
        castShadow
        position={[1, 2, 3]}
        intensity={1.5}
        shadow-normalBias={0.05}
      />
      <ambientLight intensity={0.5} />

      <mesh
        receiveShadow
        position-y={-1}
        rotation-x={-Math.PI * 0.5}
        scale={10}
      >
        <planeGeometry />
        <meshStandardMaterial color="greenyellow" />
      </mesh>

      <Suspense fallback={<Placeholder scale={[2, 2, 1]} />}>
        {/* <Helmet /> */}
        {/* <Hamburger /> */}
        <Fox />
      </Suspense>
    </>
  );
}
