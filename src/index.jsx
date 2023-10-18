import { FaceControls, FaceLandmarker, KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import Experience from "./Experience.jsx";
import Interface from "./Interface";
import "./style.css";



const root = ReactDOM.createRoot(document.querySelector("#root"));

root.render(
  <KeyboardControls
    map={[
      {
        name: "forward",
        keys: ["ArrowUp", "KeyW"],
      },
      {
        name: "backward",
        keys: ["ArrowDown", "KeyS"],
      },
      {
        name: "leftward",
        keys: ["ArrowLeft", "KeyA"],
      },
      {
        name: "rightward",
        keys: ["ArrowRight", "KeyD"],
      },
      {
        name: "nitro",
        keys: ["Shift"],
      },
      {
        name: "jump",
        keys: ["Space"],
      },
    ]}
  >
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [2.5, 4, 6],
      }}
    >
      <Suspense fallback={null}>
        <Experience />
      </Suspense>
    </Canvas>
    <Interface />
  </KeyboardControls>
);
