import { Physics } from "@react-three/rapier";
import Effects from "./Effects.jsx";
import { Level } from "./Level.jsx";
import Lights from "./Lights.jsx";
import { Player } from "./Player.jsx";
import useGame from "./store/useGame.js";

export default function Experience() {
  const traps = useGame((state) => state.traps);
  const blockSeed = useGame((state) => state.blockSeed);
  return (
    <>
      <color args={['#bdedfc']} attach={'background'}/>
      <Physics>
        <Effects />
        <Lights />
        <Level count={traps} seed={blockSeed}/>
        <Player />
      </Physics>
    </>
  );
}
