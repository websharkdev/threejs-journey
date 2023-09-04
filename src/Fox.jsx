import { useAnimations, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { useEffect } from "react";



export default function Fox() {
  const fox = useGLTF("./Fox/glTF/Fox.gltf");
  const animations = useAnimations(fox.animations, fox.scene);

   const { animationName } = useControls("animations", {
     animationName: {
       options: animations.names
     },
   });

  useEffect(() => {
    // const action = animations.actions.Walk;
    // action.play()

    // window.setTimeout(() => {
    //     animations.actions.Run.play()
    //     animations.actions.Run.crossFadeFrom(animations.actions.Walk, 1);
    // }, 3000)

    const action = animations.actions[animationName];
    action.reset().fadeIn(.5).play();


    return () => {
        action.fadeOut(0.5).stop()
    }

  }, [animationName]);
  return (
    <>
      <primitive
        // animations={animations}
        object={fox.scene}
        scale={0.035}
        position-y={-1}
      />
    </>
  );
}

useGLTF.preload("./Fox/Fox.gltf");
