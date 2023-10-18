import { FaceControls, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import useGame from "./store/useGame";

export const Player = () => {
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const rapierWorld = world.raw();

  const [smoothCameraPosition] = useState(() => new Vector3(10, 10, 10));
  const [smoothCameraTarget] = useState(() => new Vector3());

  const traps = useGame((state) => state.traps);
  const start = useGame((state) => state.start);
  const restart = useGame((state) => state.restart);
  const end = useGame((state) => state.end);


  const body = useRef();

  
  const reset = () => {
    body.current.setTranslation({ x: 0, y: 1, z: 0 });
    body.current.setLinvel({ x: 0, y: 0, z: 0 });
    body.current.setAngvel({ x: 0, y: 0, z: 0 });
  };

  useFrame((state, delta) => {
    // CONTROLS

    const { forward, backward, leftward, rightward } = getKeys();

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const impulsStrength = 0.6 * delta;
    const torqueStrength = 0.2 * delta;

    if (forward) {
      impulse.z -= impulsStrength;
      torque.x -= torqueStrength;
    }
    if (backward) {
      impulse.z += impulsStrength;
      torque.x += torqueStrength;
    }

    if (leftward) {
      impulse.x -= impulsStrength;
      torque.z += torqueStrength;
    }

    if (rightward) {
      impulse.x += impulsStrength;
      torque.z -= torqueStrength;
    }

    body.current.applyImpulse(impulse);
    body.current.applyTorqueImpulse(torque);

    /**
     * Camera
     */
    const bodyPosition = body.current.translation();

    const cameraPosition = new Vector3();
    cameraPosition.copy(bodyPosition);
    cameraPosition.z += 2.25;
    cameraPosition.y += 0.65;

    const cameraTarget = new Vector3();
    cameraTarget.copy(bodyPosition);
    cameraTarget.y += 0.25;

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);

    // PHASES

    bodyPosition.z < -(traps * 4 + 2) ? end() : null;
    bodyPosition.y < -4 ? restart() : null;
  });

  const jump = () => {
    const origin = body.current.translation();
    origin.y -= 0.31;

    const direction = {
      x: 0,
      y: -1,
      z: 0,
    };

    const ray = new rapier.Ray(origin, direction);
    const hit = rapierWorld.castRay(ray, 10, true);

    hit.toi <= 0.15 ? body.current.applyImpulse({ x: 0, y: 0.5, z: 0 }) : null;
  };

  useEffect(() => {
    const unsubscribeReset = useGame.subscribe(
      (state) => state.phase,
      (value) => {
        value === "ready" ? reset() : null;
      }
    );
    // SELECTOR and VALUE
    const unsubscribeJunp = subscribeKeys(
      (state) => state.jump,
      (value) => {
        value ? jump() : null;
      }
    );

    const unsubscribeAny = subscribeKeys(
      (state) => state,
      (value) => {
        value ? start() : null;
      }
    );

  
    return () => {
      unsubscribeJunp();
      unsubscribeAny();
      unsubscribeReset();
    };
  }, []);



  return (
    <RigidBody
      colliders="ball"
      restitution={0.2}
      friction={1}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 1, 0]}
      ref={body}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshStandardMaterial flatShading color="mediumpurple" />
      </mesh>
    </RigidBody>
  );
};
