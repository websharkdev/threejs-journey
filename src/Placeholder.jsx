export default function Placeholder({
  position = [0, .5, 0],
  scale = [2, 3, 2],
  color = "red",
  size = [1, 1, 1, 2, 2, 2],
  wireframe = true,
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxBufferGeometry args={size} />
      <meshBasicMaterial color={color} wireframe={wireframe} />
    </mesh>
  );
}
