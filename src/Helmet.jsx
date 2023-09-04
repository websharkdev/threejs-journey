import { useLoader } from "@react-three/fiber";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Helmet() {
  const model = useLoader(
    GLTFLoader,
    "./FlightHelmet/glTF/FlightHelmet.gltf",
    (loader) => {
      const dracoLoader = new DRACOLoader();

      dracoLoader.setDecoderPath("./draco/");
      loader.dracoLoader = dracoLoader;
    },
  );

  return <primitive
        object={model.scene}
        scale={5}
        position-y={-1}
        //   rotate-y={90}
      />
}
