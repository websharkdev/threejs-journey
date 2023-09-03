import { Html, OrbitControls, Text, PivotControls, TransformControls, Text3D, Float, MeshReflectorMaterial } from "@react-three/drei"
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useRef } from "react";



export default function Experience()
{
    const circle = useRef()
    const cube = useRef();

    const {position, color, visible} = useControls('sphere', {
      position: {
        value: {x: -2, y: 0},
        step: 0.01,
        joystick: 'invertY'
      },
      color: 'orange',
    })
    const { perfVisible } = useControls("sphere", {
      perfVisible: true,
    });
    return (
      <>
        {perfVisible &&  <Perf position='top-left'/>}
        <OrbitControls makeDefault />

        <directionalLight position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <mesh
          position={[position.x, position.y, 0]}
          visible={visible}
          ref={circle}
        >
          <sphereGeometry />
          <meshStandardMaterial color={color} />
        </mesh>
        <TransformControls object={circle} />

        <PivotControls
          anchor={[0, 0, 0]}
          depthTest={false}
          lineWidth={2}
          scale={100}
          fixed
          axisColors={["#ff0", "#141414", "#9381ff"]}
        >
          <mesh ref={cube} scale={1.5} position-x={2}>
            <boxGeometry />
            <meshStandardMaterial color="mediumpurple" />
            <Html
              position={[1, 1, 0]}
              wrapperClass="taplink"
              center
              distanceFactor={6}
              occlude={[cube, circle]}
              // zIndexRange={[0, 0]}
            >
              <>🚧 This is box</>
            </Html>
          </mesh>
        </PivotControls>

        <mesh position-y={-1} rotation-x={-Math.PI * 0.5} scale={10}>
          <planeGeometry />
          <MeshReflectorMaterial
            resolution={512}
            blur={[1000, 1000]}
            mixBlur={1}
            mirror={0.5}
            color={"greenyellow"}
          />
        </mesh>

        <Text position={[0, 1, 4]} color={"blue"} maxWidth={5}>
          I LOVE
        </Text>
        <Float speed={2} floatIntensity={2}>
          <Text
            position={[0, 0, 4]}
            color={"yellow"}
            maxWidth={5}
            textAlign="center"
          >
            Ukraine
          </Text>
        </Float>
      </>
    );
}