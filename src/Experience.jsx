import { Environment, Float, OrbitControls, Sky, Text, useAnimations, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Suspense, useEffect } from "react";
import Effects from "./Effects.jsx";
import { Level } from "./Level.jsx";
import Lights from "./Lights.jsx";
import { Player } from "./Player.jsx";
import useGame from "./store/useGame.js";

export default function Experience() {
  const traps = useGame((state) => state.traps);
  const blockSeed = useGame((state) => state.blockSeed);

  const isMobile = window.innerWidth < 660 && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const gltfModel = useGLTF("./elf-model.gltf");
  const animations = useAnimations(gltfModel.animations, gltfModel.scene);

  useEffect(() => {
    const action = animations.actions['pose_jeune'];
    action.reset().fadeIn(0.5).play();

    return () => {
      action.fadeOut(0.5).stop();
    };
  }, []);
  return (
    <>
      {isMobile ? (
        <>
          <Suspense
            fallback={<color args={["#bdedfc"]} attach={"background"} />}
          >
            <Sky />
            <OrbitControls />

            <Environment preset="city" />

            <Float>
              <Text maxWidth={1.5} fontSize={0.4} color={"#000"}>
                Hey! This game is not supported on your device, sorry :(
              </Text>
            </Float>

            <primitive object={gltfModel.scene} scale={1.7} />
          </Suspense>
        </>
      ) : (
        <>
          <Suspense
            fallback={<color args={["#bdedfc"]} attach={"background"} />}
          >
            <Sky />
          </Suspense>
          <Physics>
            <Effects />
            <Lights />
            <Level count={traps} seed={blockSeed} />
            <Player />
          </Physics>
        </>
      )}
    </>
  );
}

useGLTF.preload("./elf-model.gltf");