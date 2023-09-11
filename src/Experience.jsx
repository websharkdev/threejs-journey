import {
  Center,
  OrbitControls,
  Text3D,
  useMatcapTexture,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Perf } from "r3f-perf";
import { useEffect, useRef, useState } from "react";

// import { TorusGeometry } from "three";

// const torusGeometry = new TorusGeometry(1, 0.6, 16, 32);

export default function Experience() {

  const [ matcapTexture ] = useMatcapTexture("4C4C4C_D2D2D2_8F8F8F_ACACAC", 256);
    const [donutMT] = useMatcapTexture("4F439F_A28BE5_8570D6_7765C9", 256);
    // const donutGRef = useRef()
    const donutsRef = useRef([])
    const [torusGeometry, setTorusGeometry] = useState()
    const [torusMaterial, setTorusMaterial] = useState()
    
    // useEffect(() => {
    //   torusMaterial.matcap = donutMT
    //   torusMaterial.needsUpdate = true
    // }, [])

    // useFrame((state, delta) => {
    //   for(const donut of donutGRef.current.children) {
    //     donut.rotation.y += delta * .2
    //   }
    // })

    useFrame((state, delta) => {
      for (const donut of donutsRef.current) {
        donut.rotation.y += delta * 0.2;
      }
    })

  return (
    <>
      <Perf position="top-left" />

      <OrbitControls makeDefault />

      <torusGeometry args={[1, 0.6, 16, 32]} ref={setTorusGeometry} />
      <meshMatcapMaterial matcap={donutMT} ref={setTorusMaterial} />
      <Center>
        <Text3D
          size={0.7}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.02}
          bevelSize={0.025}
          bevelOffset={0}
          bevelSegments={5}
          font={"./fonts/helvetiker_regular.typeface.json"}
        >
          Oleksii Bortnytskyi
          <meshMatcapMaterial matcap={matcapTexture} />
        </Text3D>
      </Center>

      {/* <group ref={donutGRef}>
        {[
          [...Array(100)].map((item, id) => (
            <mesh
              position={[
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
              ]}
              rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
              scale={0.2 + Math.random() * 0.2}
              key={id}
              geometry={torusGeometry}
              material={torusMaterial}
            />
          )),
        ]}
      </group> */}

      {[
        [...Array(100)].map((item, id) => (
          <mesh
            ref={(element) => donutsRef.current[id] = element}
            position={[
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
              (Math.random() - 0.5) * 10,
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
            scale={0.2 + Math.random() * 0.2}
            key={id}
            geometry={torusGeometry}
            material={torusMaterial}
          />
        )),
      ]}
    </>
  );
}
