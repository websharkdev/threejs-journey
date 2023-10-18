import { DepthOfField, EffectComposer } from '@react-three/postprocessing';

export default function Effects() {
  return (
    <EffectComposer>
      <DepthOfField focusDistance={0.1} focalLength={0.2} bokehScale={3} />
    </EffectComposer>
  );
}
