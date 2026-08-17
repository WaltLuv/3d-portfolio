import { Html, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { Room } from "../hero_models/Room";

const operations = [
  { label: "WORK ORDERS", position: [-5.1, 0.45, 2.1] },
  { label: "MAINTENANCE", position: [-4.25, 0.45, -2.7] },
  { label: "INSPECTIONS", position: [-1.65, 0.45, -4.55] },
  { label: "PROJECTS", position: [2.15, 0.45, -4.45] },
  { label: "FOLLOW-UPS", position: [5.1, 0.45, -2.15] },
  { label: "VENDORS", position: [5.35, 0.45, 2.05] },
  { label: "OWNER APPROVALS", position: [2.1, 0.45, 4.35] },
];

const networkNodes = [
  [-4.6, 4.7, -3.7],
  [-2.8, 6.2, -4.5],
  [0, 5.5, -5.1],
  [2.9, 6.15, -4.45],
  [4.8, 4.65, -3.7],
  [-1.8, 3.85, -4.2],
  [1.9, 3.8, -4.2],
];

const cameraTargets = {
  hero: [8.6, 5.2, 10.8],
  1: [7.1, 4.3, 9.2],
  2: [-7.2, 3.7, 8.8],
  3: [6.1, 3.3, 7.8],
  4: [0.3, 7.4, 13.2],
};

const Tree = ({ position, scale = 1 }) => (
  <group position={position} scale={scale}>
    <mesh castShadow position={[0, 0.55, 0]}>
      <cylinderGeometry args={[0.12, 0.18, 1.1, 8]} />
      <meshStandardMaterial color="#294238" roughness={0.9} />
    </mesh>
    <mesh castShadow position={[0, 1.35, 0]}>
      <coneGeometry args={[0.72, 1.55, 9]} />
      <meshStandardMaterial color="#123e3e" roughness={0.86} />
    </mesh>
    <mesh castShadow position={[0, 2.05, 0]}>
      <coneGeometry args={[0.52, 1.15, 9]} />
      <meshStandardMaterial color="#176066" roughness={0.82} />
    </mesh>
  </group>
);

const Window = ({ position, size = [0.62, 0.55, 0.06] }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color="#9df6ff" emissive="#36dff4" emissiveIntensity={2.3} roughness={0.22} />
  </mesh>
);

const MainProperty = ({ hovered, onHover, reducedMotion }) => {
  const property = useRef();

  useFrame(({ clock }, delta) => {
    if (!property.current) return;
    const target = hovered ? 1.035 : 1;
    const nextScale = reducedMotion ? target : THREE.MathUtils.damp(property.current.scale.x, target, 5, delta);
    property.current.scale.setScalar(nextScale);
    property.current.position.y = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.6) * 0.025;
  });

  return (
    <group
      ref={property}
      onPointerEnter={(event) => { event.stopPropagation(); onHover(true); }}
      onPointerLeave={() => onHover(false)}
    >
      <mesh castShadow receiveShadow position={[0, 1.05, 0]}>
        <boxGeometry args={[4.2, 2.1, 3.45]} />
        <meshStandardMaterial color="#102b3a" metalness={0.1} roughness={0.62} />
      </mesh>
      <mesh castShadow position={[-0.55, 2.55, -0.05]}>
        <boxGeometry args={[2.8, 1.25, 3.15]} />
        <meshStandardMaterial color="#16384a" roughness={0.57} />
      </mesh>
      <mesh castShadow position={[-0.55, 3.48, -0.05]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.55, 0.82]}>
        <coneGeometry args={[2.48, 1.45, 4]} />
        <meshStandardMaterial color="#07131c" metalness={0.34} roughness={0.47} />
      </mesh>
      <mesh castShadow position={[2.68, 0.72, 0.2]}>
        <boxGeometry args={[1.55, 1.44, 2.8]} />
        <meshStandardMaterial color="#0c2534" roughness={0.64} />
      </mesh>
      <mesh castShadow position={[2.68, 1.63, 0.2]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.46, 1.18]}>
        <coneGeometry args={[1.35, 0.9, 4]} />
        <meshStandardMaterial color="#07131c" roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 0.86, 1.74]}>
        <boxGeometry args={[0.75, 1.55, 0.08]} />
        <meshStandardMaterial color="#071117" metalness={0.45} roughness={0.35} />
      </mesh>
      <mesh position={[2.68, 0.72, 1.62]}>
        <boxGeometry args={[1.18, 0.92, 0.07]} />
        <meshStandardMaterial color="#0a1720" metalness={0.55} roughness={0.34} />
      </mesh>
      <Window position={[-1.3, 2.5, 1.56]} />
      <Window position={[0.25, 2.5, 1.56]} />
      <Window position={[-1.25, 1.05, 1.74]} size={[0.78, 0.72, 0.06]} />
      <Window position={[1.22, 1.05, 1.74]} size={[0.72, 0.72, 0.06]} />
      <mesh receiveShadow position={[0.36, 0.07, 2.25]}>
        <boxGeometry args={[1.25, 0.13, 1.25]} />
        <meshStandardMaterial color="#173541" roughness={0.85} />
      </mesh>
      {[[-0.28, 0.85, 2.05], [0.98, 0.85, 2.05]].map((position) => (
        <mesh key={position.join("-")} castShadow position={position}>
          <cylinderGeometry args={[0.08, 0.08, 1.7, 8]} />
          <meshStandardMaterial color="#80a8b4" metalness={0.3} roughness={0.5} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <ringGeometry args={[3.15, 3.19, 64]} />
        <meshBasicMaterial color={hovered ? "#78f4ff" : "#237b8d"} transparent opacity={hovered ? 0.9 : 0.35} />
      </mesh>
    </group>
  );
};

const BackgroundBuilding = ({ position, rotation = 0, scale = 1 }) => (
  <group position={position} rotation={[0, rotation, 0]} scale={scale}>
    <mesh castShadow position={[0, 0.75, 0]}>
      <boxGeometry args={[2.4, 1.5, 2]} />
      <meshStandardMaterial color="#0b202d" roughness={0.72} />
    </mesh>
    <mesh castShadow position={[0, 1.76, 0]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.46, 0.84]}>
      <coneGeometry args={[1.65, 1.05, 4]} />
      <meshStandardMaterial color="#06121a" roughness={0.56} />
    </mesh>
    <Window position={[-0.55, 0.82, 1.02]} size={[0.45, 0.42, 0.04]} />
    <Window position={[0.55, 0.82, 1.02]} size={[0.45, 0.42, 0.04]} />
  </group>
);

const OperationLayer = ({ active }) => (
  <group visible={active}>
    {operations.map((operation, index) => (
      <group key={operation.label} position={operation.position}>
        <Line
          points={[[0, 0, 0], [-operation.position[0], 0.48, -operation.position[2]]]}
          color={index % 2 ? "#60f0d5" : "#63eaff"}
          lineWidth={1.1}
          transparent
          opacity={0.58}
        />
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial color="#b9fbff" emissive="#44e9ff" emissiveIntensity={3} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.25, 0.29, 28]} />
          <meshBasicMaterial color="#54eafa" transparent opacity={0.8} />
        </mesh>
        <Html center position={[0, 0.62, 0]} distanceFactor={10} transform={false}>
          <span className="world-label">{operation.label}</span>
        </Html>
      </group>
    ))}
  </group>
);

const VoiceLayer = ({ active, reducedMotion }) => {
  const waveform = useRef();
  const pulse = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const count = 34;

  useFrame(({ clock }) => {
    if (!active || !waveform.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    for (let index = 0; index < count; index += 1) {
      const x = -6.5 + index * 0.19;
      const envelope = Math.sin((index / (count - 1)) * Math.PI);
      const y = 1.35 + Math.sin(index * 0.85 + time * 5.2) * 0.42 * envelope;
      dummy.position.set(x, y, 2.15);
      dummy.scale.setScalar(0.055 + envelope * 0.035);
      dummy.updateMatrix();
      waveform.current.setMatrixAt(index, dummy.matrix);
    }
    waveform.current.instanceMatrix.needsUpdate = true;
    if (pulse.current) pulse.current.position.x = -6.4 + ((time * 2.35) % 6.5);
  });

  return (
    <group visible={active}>
      <instancedMesh ref={waveform} args={[null, null, count]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#c9b6ff" emissive="#8e72ff" emissiveIntensity={3.4} />
      </instancedMesh>
      <mesh ref={pulse} position={[-6.4, 1.35, 2.15]}>
        <sphereGeometry args={[0.17, 18, 18]} />
        <meshStandardMaterial color="#ffffff" emissive="#b396ff" emissiveIntensity={5} />
      </mesh>
      {[0, 1, 2].map((ring) => (
        <mesh key={ring} position={[-0.05, 1.35, 2.12]} scale={1 + ring * 0.42}>
          <ringGeometry args={[0.36, 0.39, 32]} />
          <meshBasicMaterial color="#a78fff" transparent opacity={0.72 - ring * 0.19} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <Html center position={[-5.25, 2.18, 2.15]} distanceFactor={10}>
        <span className="world-label world-label-violet">CALL INCOMING → VOICE AI → ACTION</span>
      </Html>
    </group>
  );
};

const VisionLayer = ({ active, reducedMotion }) => {
  const scan = useRef();
  const marker = useRef();

  useFrame(({ clock }) => {
    if (!active) return;
    const time = reducedMotion ? 0.45 : clock.elapsedTime;
    if (scan.current) scan.current.position.x = -2.35 + ((time * 1.05) % 4.7);
    if (marker.current) {
      const scale = 1 + Math.sin(time * 3.2) * 0.12;
      marker.current.scale.setScalar(scale);
    }
  });

  return (
    <group visible={active}>
      <mesh ref={scan} position={[-2.25, 1.75, 0]}>
        <boxGeometry args={[0.055, 4.25, 4.7]} />
        <meshBasicMaterial color="#5dffe2" transparent opacity={0.21} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh ref={marker} position={[-0.62, 3.56, 1.4]}>
        <ringGeometry args={[0.34, 0.4, 32]} />
        <meshBasicMaterial color="#69ffe1" transparent opacity={0.95} side={THREE.DoubleSide} />
      </mesh>
      <Line points={[[-0.62, 3.56, 1.4], [2.65, 3.05, 2.2]]} color="#64f8dc" lineWidth={1.1} transparent opacity={0.82} />
      <Html position={[2.65, 3.05, 2.2]} distanceFactor={9} center>
        <div className="world-quote">
          <span>ILLUSTRATIVE SYSTEM VIEW</span>
          <strong>ROOF FINDING DETECTED</strong>
          <small>Repair Cost Guide → estimate ready</small>
        </div>
      </Html>
    </group>
  );
};

const BaselineLayer = ({ active }) => {
  const center = [0, 5.1, -4.2];
  return (
    <group visible={active}>
      {networkNodes.map((node, index) => (
        <group key={node.join("-")}>
          <Line points={[center, node]} color={index % 2 ? "#7b8cff" : "#54e8ff"} lineWidth={1.15} transparent opacity={0.62} />
          <mesh position={node}>
            <icosahedronGeometry args={[index === 2 ? 0.24 : 0.14, 1]} />
            <meshStandardMaterial color="#b9c5ff" emissive={index % 2 ? "#6d63ff" : "#24d5f0"} emissiveIntensity={3.2} />
          </mesh>
        </group>
      ))}
      <mesh position={center}>
        <icosahedronGeometry args={[0.36, 1]} />
        <meshStandardMaterial color="#e4e8ff" emissive="#7669ff" emissiveIntensity={4} />
      </mesh>
      <Line points={[[0, 5.1, -4.2], [0, 2.2, -1.5]]} color="#64eeff" lineWidth={1.5} transparent opacity={0.76} />
      <Html center position={[0, 6.85, -4.5]} distanceFactor={10}>
        <span className="world-label world-label-baseline">BUSINESS PROBLEM → SPEC KIT → AGENT → TOOLS → DEPLOY</span>
      </Html>
    </group>
  );
};

const PropertyWorld = ({ stage = 0, mode = "story", isMobile = false, reducedMotion = false }) => {
  const world = useRef();
  const reveal = useRef(reducedMotion ? 1 : 0.02);
  const pointerLight = useRef();
  const [hovered, setHovered] = useState(false);
  const { camera, pointer } = useThree();

  useFrame(({ clock }, delta) => {
    if (!world.current) return;
    reveal.current = THREE.MathUtils.damp(reveal.current, 1, reducedMotion ? 20 : 2.4, delta);
    world.current.scale.setScalar(reveal.current * (isMobile ? 0.76 : 1));
    const parallaxX = reducedMotion ? 0 : pointer.x * 0.055;
    const parallaxY = reducedMotion ? 0 : pointer.y * 0.035;
    world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, parallaxX, 3.5, delta);
    world.current.rotation.x = THREE.MathUtils.damp(world.current.rotation.x, -parallaxY, 3.5, delta);
    world.current.position.y = -0.12 + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.42) * 0.025);

    if (pointerLight.current) {
      const pointerX = reducedMotion ? 0 : pointer.x * 5;
      const pointerZ = reducedMotion ? 4 : 4 + pointer.y * 2;
      pointerLight.current.position.x = reducedMotion ? pointerX : THREE.MathUtils.damp(pointerLight.current.position.x, pointerX, 4, delta);
      pointerLight.current.position.z = reducedMotion ? pointerZ : THREE.MathUtils.damp(pointerLight.current.position.z, pointerZ, 4, delta);
    }

    if (mode === "story") {
      const target = cameraTargets[stage] || cameraTargets[1];
      camera.position.x = reducedMotion ? target[0] : THREE.MathUtils.damp(camera.position.x, target[0], 2.6, delta);
      camera.position.y = reducedMotion ? target[1] : THREE.MathUtils.damp(camera.position.y, target[1], 2.6, delta);
      camera.position.z = reducedMotion ? target[2] : THREE.MathUtils.damp(camera.position.z, target[2], 2.6, delta);
      camera.lookAt(0, 1.25, 0);
    }
  });

  return (
    <>
      <pointLight ref={pointerLight} position={[0, 4, 4]} color="#80f4ff" intensity={isMobile ? 9 : 14} distance={11} />
      <group ref={world} position={[0, -0.12, 0]}>
        <mesh receiveShadow position={[0, -0.4, 0]}>
          <cylinderGeometry args={[7.1, 7.6, 0.72, isMobile ? 32 : 64]} />
          <meshStandardMaterial color="#06131b" metalness={0.18} roughness={0.76} />
        </mesh>
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.025, 0]}>
          <circleGeometry args={[7.05, isMobile ? 32 : 64]} />
          <meshStandardMaterial color="#0a2630" metalness={0.1} roughness={0.91} />
        </mesh>
        <mesh receiveShadow position={[0.4, 0.015, 4.45]} rotation={[0, -0.06, 0]}>
          <boxGeometry args={[1.2, 0.06, 4.8]} />
          <meshStandardMaterial color="#1a333c" roughness={0.88} />
        </mesh>
        <MainProperty hovered={hovered} onHover={setHovered} reducedMotion={reducedMotion} />
        {!isMobile && (
          <>
            <BackgroundBuilding position={[-4.35, 0, -2.45]} rotation={0.52} scale={0.72} />
            <BackgroundBuilding position={[4.45, 0, -2.75]} rotation={-0.5} scale={0.66} />
            <Tree position={[-5.4, 0, 0.15]} scale={0.9} />
            <Tree position={[5.25, 0, 0.4]} scale={0.78} />
            <Tree position={[-3.6, 0, 3.85]} scale={0.68} />
            <Tree position={[4.35, 0, 3.55]} scale={0.72} />
            <group position={[4.2, 0.02, -1.05]} rotation={[0, -1.05, 0]} scale={0.3}>
              <Room enableEffects={false} />
            </group>
          </>
        )}
        {isMobile && <Tree position={[-4.1, 0, 2.65]} scale={0.72} />}
        <OperationLayer active={stage === 1} />
        <VoiceLayer active={stage === 2} reducedMotion={reducedMotion} />
        <VisionLayer active={stage === 3} reducedMotion={reducedMotion} />
        <BaselineLayer active={stage === 4} />
      </group>
    </>
  );
};

export default PropertyWorld;
