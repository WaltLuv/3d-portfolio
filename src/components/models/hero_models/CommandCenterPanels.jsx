import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const panelMaterial = new THREE.MeshStandardMaterial({
  color: "#071c2d",
  emissive: "#0a8fab",
  emissiveIntensity: 0.45,
  transparent: true,
  opacity: 0.78,
  side: THREE.DoubleSide,
});

const labels = ["PROPCONTROL", "VOICEOPS", "VISIONOPS", "BASELINE STUDIOS"];

const CommandCenterPanels = ({ simplified = false }) => {
  const waveform = useRef();
  const points = useMemo(
    () => Array.from({ length: 20 }, (_, i) => [i * 0.08 - 0.75, Math.sin(i * 1.3) * 0.12, 0]),
    []
  );

  useFrame(({ clock }) => {
    if (waveform.current) waveform.current.rotation.z = Math.sin(clock.elapsedTime * 0.8) * 0.03;
  });

  return (
    <group position={[0.1, 0.7, 1.1]} rotation={[0, -0.05, 0]}>
      {labels.slice(0, simplified ? 2 : 4).map((label, index) => (
        <group key={label} position={[(index % 2) * 2.05 - 1, index > 1 ? -1.25 : 0.45, 0]}>
          <mesh material={panelMaterial}>
            <planeGeometry args={[1.75, 0.95]} />
          </mesh>
          <mesh position={[0, 0.32, 0.012]}>
            <planeGeometry args={[1.35, 0.025]} />
            <meshBasicMaterial color={index === 1 ? "#9b7cff" : "#54efff"} />
          </mesh>
          <Line points={[[-0.62, -0.1, 0.015], [0.62, -0.1, 0.015]]} color="#48dbea" lineWidth={0.6} transparent opacity={0.45} />
          <Line points={[[-0.62, -0.28, 0.015], [index % 2 ? 0.25 : 0.52, -0.28, 0.015]]} color={index === 1 ? "#a889ff" : "#39f1c7"} lineWidth={1.2} />
        </group>
      ))}
      <group ref={waveform} position={[0.04, 0.45, 0.03]}>
        <Line points={points} color="#b49aff" lineWidth={1.5} />
      </group>
      {!simplified && (
        <group position={[0, -0.82, 0.04]}>
          <mesh><ringGeometry args={[0.24, 0.28, 32]} /><meshBasicMaterial color="#46f0d0" transparent opacity={0.8} /></mesh>
          {[0, 1, 2, 3].map((i) => <mesh key={i} position={[Math.cos(i * Math.PI / 2) * 0.52, Math.sin(i * Math.PI / 2) * 0.34, 0]}><circleGeometry args={[0.055, 16]} /><meshBasicMaterial color="#63eaff" /></mesh>)}
        </group>
      )}
    </group>
  );
};

export default CommandCenterPanels;
