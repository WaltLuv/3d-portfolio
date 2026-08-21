import { Grid, Html, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { lazy, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { baselineNodes, cameraRoute, operationNodes, workforceNodes } from "./worldData";
import WalterTwin from "./WalterTwin";

const BuilderStudio = lazy(() => import("./BuilderStudio"));
const walterTwinEnabled = import.meta.env.VITE_ENABLE_WALTER_TWIN === "true";

const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1);
const stageWeight = (step, center, radius = 0.86) => clamp01(1 - Math.abs(step - center) / radius);

const CameraRig = ({ worldState, reducedMotion, isMobile }) => {
  const { camera, pointer } = useThree();
  const currentTarget = useRef(new THREE.Vector3(0, 1, 0));
  const exploreOffset = useRef(new THREE.Vector3());
  const route = useMemo(() => cameraRoute.map((entry) => ({
    position: new THREE.Vector3(...entry.position),
    target: new THREE.Vector3(...entry.target),
    fov: entry.fov,
  })), []);
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const desiredTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (worldState.current.paused) return;
    const maxStep = route.length - 1;
    const targetStep = THREE.MathUtils.clamp(worldState.current.targetStep, 0, maxStep);
    const currentStep = reducedMotion
      ? targetStep
      : THREE.MathUtils.damp(worldState.current.currentStep, targetStep, 2.15, delta);
    worldState.current.currentStep = currentStep;

    const startIndex = Math.min(maxStep - 1, Math.floor(currentStep));
    const endIndex = Math.min(maxStep, startIndex + 1);
    const routeProgress = THREE.MathUtils.smoothstep(currentStep - startIndex, 0, 1);
    desiredPosition.copy(route[startIndex].position).lerp(route[endIndex].position, routeProgress);
    desiredTarget.copy(route[startIndex].target).lerp(route[endIndex].target, routeProgress);
    const desiredFov = THREE.MathUtils.lerp(route[startIndex].fov, route[endIndex].fov, routeProgress);

    const keys = worldState.current.keys;
    const exploreTargetX = worldState.current.exploreEnabled ? ((keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0)) * 1.25 : 0;
    const exploreTargetZ = worldState.current.exploreEnabled ? ((keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0)) * 1.25 : 0;
    exploreOffset.current.x = THREE.MathUtils.damp(exploreOffset.current.x, exploreTargetX, 4, delta);
    exploreOffset.current.z = THREE.MathUtils.damp(exploreOffset.current.z, exploreTargetZ, 4, delta);

    const pointerScale = reducedMotion || isMobile ? 0 : 0.5;
    desiredPosition.x += pointer.x * pointerScale + exploreOffset.current.x;
    desiredPosition.y += pointer.y * pointerScale * 0.4;
    desiredPosition.z += exploreOffset.current.z;
    desiredTarget.x += pointer.x * pointerScale * 0.2;
    desiredTarget.y += pointer.y * pointerScale * 0.12;

    const cameraDamping = reducedMotion ? 100 : 3.1;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosition.x, cameraDamping, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosition.y, cameraDamping, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosition.z, cameraDamping, delta);
    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, desiredTarget.x, cameraDamping, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, desiredTarget.y, cameraDamping, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, desiredTarget.z, cameraDamping, delta);
    camera.fov = THREE.MathUtils.damp(camera.fov, desiredFov, cameraDamping, delta);
    camera.updateProjectionMatrix();
    camera.lookAt(currentTarget.current);
  });

  return null;
};

const NightAtmosphere = ({ isMobile, reducedMotion }) => {
  const points = useRef();
  const positions = useMemo(() => {
    const count = isMobile ? 80 : 180;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 55;
      values[index * 3 + 1] = 3 + Math.random() * 18;
      values[index * 3 + 2] = (Math.random() - 0.5) * 55;
    }
    return values;
  }, [isMobile]);

  useFrame((_, delta) => {
    if (points.current && !reducedMotion) points.current.rotation.y += delta * 0.0035;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#b7d7e8" size={0.035} transparent opacity={0.42} depthWrite={false} />
    </points>
  );
};

const Window = ({ position, size = [0.68, 0.58, 0.06], intensity = 2.2 }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color="#ffd7a0" emissive="#ff9b45" emissiveIntensity={intensity} roughness={0.34} />
  </mesh>
);

const House = ({ position, scale = 1, wallColor = "#877360", roofColor = "#302a26", vision = false, worldState, reducedMotion }) => {
  const group = useRef();
  const wallMaterial = useRef();
  const roofMaterial = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const visionWeight = vision ? stageWeight(step, 3, 0.95) : 0;
    const hoverScale = hovered ? 1.025 : 1;
    const nextScale = reducedMotion ? hoverScale : THREE.MathUtils.damp(group.current.scale.x / scale, hoverScale, 5, delta);
    group.current.scale.setScalar(nextScale * scale);
    if (wallMaterial.current) {
      wallMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.58, visionWeight);
      wallMaterial.current.emissiveIntensity = hovered ? 0.14 : 0.03;
    }
    if (roofMaterial.current) roofMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.72, visionWeight);
  });

  return (
    <group
      ref={group}
      position={position}
      scale={scale}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[4.35, 2.2, 3.5]} />
        <meshStandardMaterial ref={wallMaterial} color={wallColor} emissive="#ffb261" transparent roughness={0.72} metalness={0.04} />
      </mesh>
      <mesh castShadow position={[-0.55, 2.62, -0.08]}>
        <boxGeometry args={[2.85, 1.22, 3.15]} />
        <meshStandardMaterial color={wallColor} roughness={0.68} />
      </mesh>
      <mesh castShadow position={[-0.55, 3.53, -0.08]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.54, 0.82]}>
        <coneGeometry args={[2.48, 1.42, 4]} />
        <meshStandardMaterial ref={roofMaterial} color={roofColor} transparent roughness={0.7} metalness={0.08} />
      </mesh>
      <mesh castShadow position={[2.72, 0.75, 0.15]}>
        <boxGeometry args={[1.6, 1.5, 2.85]} />
        <meshStandardMaterial color="#6c6359" roughness={0.75} />
      </mesh>
      <mesh castShadow position={[2.72, 1.66, 0.15]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.46, 1.18]}>
        <coneGeometry args={[1.38, 0.9, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.72} />
      </mesh>
      <mesh position={[0.35, 0.88, 1.78]}>
        <boxGeometry args={[0.78, 1.6, 0.08]} />
        <meshStandardMaterial color="#3a241a" roughness={0.65} />
      </mesh>
      <mesh position={[2.72, 0.72, 1.6]}>
        <boxGeometry args={[1.22, 0.95, 0.07]} />
        <meshStandardMaterial color="#4a4239" metalness={0.14} roughness={0.7} />
      </mesh>
      <Window position={[-1.32, 2.58, 1.51]} />
      <Window position={[0.25, 2.58, 1.51]} />
      <Window position={[-1.28, 1.06, 1.77]} size={[0.82, 0.72, 0.06]} intensity={1.9} />
      <Window position={[1.24, 1.06, 1.77]} size={[0.74, 0.72, 0.06]} intensity={1.9} />
      <mesh receiveShadow position={[0.36, 0.06, 2.28]}>
        <boxGeometry args={[1.3, 0.12, 1.35]} />
        <meshStandardMaterial color="#a59b8b" roughness={0.9} />
      </mesh>
      {[[-0.3, 0.86, 2.08], [1.02, 0.86, 2.08]].map((columnPosition) => (
        <mesh key={columnPosition.join("-")} castShadow position={columnPosition}>
          <cylinderGeometry args={[0.085, 0.085, 1.72, 10]} />
          <meshStandardMaterial color="#d0c4b2" roughness={0.72} />
        </mesh>
      ))}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <ringGeometry args={[3.1, 3.15, 64]} />
        <meshBasicMaterial color={hovered ? "#63eaff" : "#6e7c68"} transparent opacity={hovered ? 0.72 : 0.16} />
      </mesh>
    </group>
  );
};

const Tree = ({ position, scale = 1, reducedMotion }) => {
  const crown = useRef();
  useFrame(({ clock }) => {
    if (crown.current && !reducedMotion) crown.current.rotation.z = Math.sin(clock.elapsedTime * 0.55 + position[0]) * 0.018;
  });
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.12, 0.19, 1.25, 8]} />
        <meshStandardMaterial color="#4a3828" roughness={0.95} />
      </mesh>
      <group ref={crown} position={[0, 1.15, 0]}>
        <mesh castShadow position={[0, 0.5, 0]}><coneGeometry args={[0.76, 1.6, 9]} /><meshStandardMaterial color="#203d2a" roughness={0.94} /></mesh>
        <mesh castShadow position={[0, 1.25, 0]}><coneGeometry args={[0.56, 1.25, 9]} /><meshStandardMaterial color="#2f5940" roughness={0.91} /></mesh>
      </group>
    </group>
  );
};

const StreetLight = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 1.35, 0]}><cylinderGeometry args={[0.045, 0.065, 2.7, 8]} /><meshStandardMaterial color="#25282b" metalness={0.68} roughness={0.42} /></mesh>
    <mesh position={[0, 2.74, 0]}><sphereGeometry args={[0.13, 14, 14]} /><meshStandardMaterial color="#ffe5b2" emissive="#ffad4d" emissiveIntensity={4.6} /></mesh>
    <pointLight position={[0, 2.68, 0]} color="#ffbf6a" intensity={4.5} distance={5} decay={2} />
  </group>
);

const MovingVehicle = ({ reducedMotion }) => {
  const vehicle = useRef();
  useFrame(({ clock }) => {
    if (!vehicle.current) return;
    vehicle.current.position.x = reducedMotion ? -3 : -13 + ((clock.elapsedTime * 0.72) % 26);
  });
  return (
    <group ref={vehicle} position={[-13, 0.25, 6.1]}>
      <mesh castShadow><boxGeometry args={[1.35, 0.48, 0.72]} /><meshStandardMaterial color="#7b3028" metalness={0.2} roughness={0.55} /></mesh>
      <mesh castShadow position={[-0.18, 0.37, 0]}><boxGeometry args={[0.72, 0.35, 0.65]} /><meshStandardMaterial color="#3c4a52" metalness={0.35} roughness={0.38} /></mesh>
      {[[-0.42, -0.25, 0.38], [0.42, -0.25, 0.38], [-0.42, -0.25, -0.38], [0.42, -0.25, -0.38]].map((wheel) => (
        <mesh key={wheel.join("-")} position={wheel} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.16, 0.16, 0.1, 12]} /><meshStandardMaterial color="#111" roughness={0.9} /></mesh>
      ))}
    </group>
  );
};

const ArrivalSign = ({ worldState }) => {
  const group = useRef();

  useFrame(() => {
    if (group.current) group.current.visible = worldState.current.currentStep < 0.78;
  });

  return (
    <group ref={group} position={[0, 0, 3.35]}>
      <mesh castShadow position={[0, 1.15, 0]}>
        <boxGeometry args={[5.4, 1.58, 0.18]} />
        <meshStandardMaterial color="#242523" metalness={0.42} roughness={0.5} />
      </mesh>
      {[-2.25, 2.25].map((x) => (
        <mesh castShadow key={x} position={[x, 0.45, 0]}>
          <boxGeometry args={[0.1, 1.2, 0.1]} />
          <meshStandardMaterial color="#3b342b" metalness={0.28} roughness={0.62} />
        </mesh>
      ))}
      <mesh position={[0, 1.18, 0.1]}>
        <planeGeometry args={[5.1, 1.3]} />
        <meshStandardMaterial color="#15191a" emissive="#18353a" emissiveIntensity={0.4} roughness={0.48} />
      </mesh>
      <Html center position={[0, 1.18, 0.2]} distanceFactor={9}>
        <div className="world-arrival-sign">
          <strong>WALTER THORNTON</strong>
          <span>REAL ESTATE OPERATIONS × AI PRODUCT BUILDER</span>
        </div>
      </Html>
      <pointLight position={[0, 1.7, 1]} color="#ffb862" intensity={2.4} distance={4} />
    </group>
  );
};

const OperationsLayer = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const pulse = useRef();
  const issue = useRef();
  const issueMaterial = useRef();
  const resolvedLabel = useRef();
  const pathStart = useMemo(() => new THREE.Vector3(0, 1.35, 0), []);
  const pathEnd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const weight = Math.max(stageWeight(step, 2, 0.92), stageWeight(step, 11, 0.72));
    group.current.visible = weight > 0.035;
    group.current.scale.setScalar(0.94 + weight * 0.06);
    if (issue.current) issue.current.scale.setScalar(0.82 + Math.sin((reducedMotion ? 0 : clock.elapsedTime) * 4) * 0.14);
    if (issueMaterial.current) {
      issueMaterial.current.color.set(step > 6.7 ? "#c7ffe5" : "#ffca7a");
      issueMaterial.current.emissive.set(step > 6.7 ? "#36e0aa" : "#ff7438");
    }
    if (resolvedLabel.current) resolvedLabel.current.visible = step > 10.2;
    if (pulse.current) {
      const time = reducedMotion ? 0.42 : clock.elapsedTime * 0.44;
      const index = Math.floor(time) % operationNodes.length;
      const progress = time - Math.floor(time);
      pathEnd.set(...operationNodes[index].position);
      pulse.current.position.copy(pathStart).lerp(pathEnd, progress);
    }
  });

  return (
    <group ref={group}>
      {operationNodes.map((node, index) => (
        <group key={node.label} position={node.position}>
          <Line points={[[0, 0, 0], [-node.position[0], 0.8, -node.position[2]]]} color={index % 2 ? "#65f0d5" : "#64e7ff"} lineWidth={1.05} transparent opacity={0.56} />
          <mesh><sphereGeometry args={[0.12, 14, 14]} /><meshStandardMaterial color="#e2ffff" emissive="#45def2" emissiveIntensity={3.8} /></mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.25, 0.3, 28]} /><meshBasicMaterial color="#63eaff" transparent opacity={0.78} /></mesh>
          <Html center position={[0, 0.52, 0]} distanceFactor={10}><span className="world-object-label">{node.label}</span></Html>
        </group>
      ))}
      <mesh ref={pulse}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#71f3ff" emissiveIntensity={5} /></mesh>
      <mesh ref={issue} position={[-1.25, 1.05, 1.9]}><octahedronGeometry args={[0.18, 0]} /><meshStandardMaterial ref={issueMaterial} color="#ffca7a" emissive="#ff7438" emissiveIntensity={4.2} /></mesh>
      <Html center position={[-1.25, 1.72, 1.9]} distanceFactor={10}><span className="world-object-label world-object-label-alert">UNIT 204 · ACTIVE WATER LEAK</span></Html>
      <group ref={resolvedLabel}><Html center position={[0, 3.65, 0]} distanceFactor={10}><span className="world-object-label world-object-label-resolved">MISSION RESOLVED · AUDIT RETAINED</span></Html></group>
      <Html center position={[0, 4.65, 0]} distanceFactor={10}>
        <div className="world-title-label"><span>PROPCONTROL</span><strong>THE OPERATING SYSTEM FOR THE PROPERTY</strong></div>
      </Html>
    </group>
  );
};

const VoiceLayer = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const waveform = useRef();
  const signal = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const start = useMemo(() => new THREE.Vector3(-8.6, 1.75, 4.8), []);
  const end = useMemo(() => new THREE.Vector3(-0.15, 1.35, 1.25), []);
  const count = 42;

  useFrame(({ clock }) => {
    if (!group.current) return;
    const weight = stageWeight(worldState.current.currentStep, 1, 0.92);
    group.current.visible = weight > 0.035;
    if (!group.current.visible || !waveform.current) return;
    const time = reducedMotion ? 0.4 : clock.elapsedTime;
    for (let index = 0; index < count; index += 1) {
      const progress = index / (count - 1);
      const x = THREE.MathUtils.lerp(start.x, end.x, progress);
      const z = THREE.MathUtils.lerp(start.z, end.z, progress);
      const envelope = Math.sin(progress * Math.PI);
      const y = 1.55 + Math.sin(index * 0.78 + time * 5.4) * 0.38 * envelope;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(0.045 + envelope * 0.035);
      dummy.updateMatrix();
      waveform.current.setMatrixAt(index, dummy.matrix);
    }
    waveform.current.instanceMatrix.needsUpdate = true;
    if (signal.current) signal.current.position.copy(start).lerp(end, reducedMotion ? 0.62 : (time * 0.32) % 1);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={waveform} args={[null, null, count]} frustumCulled={false}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial color="#d2c5ff" emissive="#8c72ff" emissiveIntensity={3.8} />
      </instancedMesh>
      <mesh ref={signal}><sphereGeometry args={[0.16, 16, 16]} /><meshStandardMaterial color="#fff" emissive="#aa8cff" emissiveIntensity={5} /></mesh>
      {[0, 1, 2].map((ring) => (
        <mesh key={ring} position={start} scale={1 + ring * 0.48}>
          <ringGeometry args={[0.32, 0.36, 32]} />
          <meshBasicMaterial color="#b89cff" transparent opacity={0.72 - ring * 0.17} side={THREE.DoubleSide} />
        </mesh>
      ))}
      <group position={end}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.28, 0.34, 32]} /><meshBasicMaterial color="#70f1ff" transparent opacity={0.82} /></mesh>
        <Html center position={[0, 0.48, 0]} distanceFactor={10}><span className="world-object-label">UNIT 204 IDENTIFIED</span></Html>
      </group>
      <Html center position={[-5.1, 2.55, 3.6]} distanceFactor={10}><span className="world-object-label world-object-label-violet">CALL → UNDERSTAND → CONTEXT → UNIT → PRIORITY → ROUTE → ACTION</span></Html>
      <Html center position={[-0.1, 4.55, 0]} distanceFactor={10}><div className="world-title-label"><span>VOICEOPS</span><strong>THE WORLD CAN HEAR</strong></div></Html>
    </group>
  );
};

const VisionLayer = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const scan = useRef();
  const marker = useRef();
  const repairPiece = useRef();
  const repairConnection = useRef();
  const repairArtifact = useRef();
  const sequence = useRef();

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const phase = clamp01((step - 2.55) / 1.75);
    group.current.visible = step > 2.5 && step < 4.9;
    if (!group.current.visible) return;
    const time = reducedMotion ? 0.56 : clock.elapsedTime;
    const scanProgress = THREE.MathUtils.smoothstep(phase, 0.04, 0.48);
    const repairProgress = THREE.MathUtils.smoothstep(phase, 0.5, 0.92);
    if (scan.current) {
      scan.current.visible = phase > 0.02;
      scan.current.position.x = THREE.MathUtils.lerp(-2.45, 2.45, scanProgress);
    }
    if (marker.current) {
      marker.current.visible = phase > 0.33;
      marker.current.scale.setScalar(0.92 + Math.sin(time * 3.5) * 0.13);
    }
    if (repairPiece.current) {
      repairPiece.current.visible = phase > 0.44;
      repairPiece.current.position.x = THREE.MathUtils.damp(repairPiece.current.position.x, THREE.MathUtils.lerp(-0.58, 1.35, repairProgress), 5, delta);
      repairPiece.current.position.y = THREE.MathUtils.damp(repairPiece.current.position.y, THREE.MathUtils.lerp(3.58, 4.15, repairProgress), 5, delta);
      repairPiece.current.position.z = THREE.MathUtils.damp(repairPiece.current.position.z, THREE.MathUtils.lerp(1.35, 2.2, repairProgress), 5, delta);
      repairPiece.current.rotation.y = Math.PI / 4 + (reducedMotion ? 0 : time * 0.08);
    }
    if (repairConnection.current) repairConnection.current.visible = phase > 0.58;
    if (repairArtifact.current) repairArtifact.current.visible = phase > 0.64;
    if (sequence.current) sequence.current.visible = phase > 0.04;
  });

  return (
    <group ref={group} position={[4.7, 0, -4.2]}>
      <mesh ref={scan} position={[-2.35, 1.8, 0]}>
        <boxGeometry args={[0.06, 4.6, 4.9]} />
        <meshBasicMaterial color="#5dffe2" transparent opacity={0.23} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={marker} position={[-0.58, 3.58, 1.35]}>
        <ringGeometry args={[0.34, 0.42, 32]} />
        <meshBasicMaterial color="#6dffe5" transparent opacity={0.98} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={repairPiece} position={[-0.58, 3.58, 1.35]} rotation={[0, Math.PI / 4, 0]} scale={[0.58, 0.22, 0.5]}>
        <coneGeometry args={[1.4, 0.72, 4]} />
        <meshStandardMaterial color="#9b7d63" emissive="#47e6cd" emissiveIntensity={0.7} roughness={0.68} />
      </mesh>
      <group ref={repairConnection}>
        <Line points={[[-0.58, 3.58, 1.35], [2.9, 3.5, 2.6]]} color="#65f7dc" lineWidth={1.2} transparent opacity={0.88} />
      </group>
      <group ref={repairArtifact}>
        <Html center position={[2.9, 3.5, 2.6]} distanceFactor={8.5}>
          <div className="world-repair-artifact">
            <span>ILLUSTRATIVE SYSTEM SEQUENCE</span>
            <strong>WATER-AFFECTED AREA DETECTED</strong>
            <b>REPAIR COST GUIDE</b>
            <small>Scope assembled → QUOTE GENERATED → governed action</small>
          </div>
        </Html>
      </group>
      <group ref={sequence}>
        <Html center position={[0, 5.3, 0]} distanceFactor={9}>
          <div className="world-vision-sequence"><span>CAPTURE</span><i>→</i><span>ANALYZE</span><i>→</i><span>FINDINGS</span><i>→</i><strong>REPAIR COST</strong><i>→</i><span>ACTION</span></div>
        </Html>
      </group>
    </group>
  );
};

const MissionArtifact = ({ worldState, reducedMotion }) => {
  const artifact = useRef();
  const material = useRef();
  const route = useMemo(() => [
    { step: 0.7, position: new THREE.Vector3(-8.6, 1.75, 4.8) },
    { step: 1.35, position: new THREE.Vector3(-0.15, 1.35, 1.25) },
    { step: 2.25, position: new THREE.Vector3(0, 1.4, 0) },
    { step: 3.35, position: new THREE.Vector3(4.7, 3.55, -2.85) },
    { step: 4.15, position: new THREE.Vector3(7.55, 3.5, -1.6) },
    { step: 5.05, position: new THREE.Vector3(0, -3.4, -1.2) },
    { step: 6.05, position: new THREE.Vector3(0, -6.4, -1.2) },
    { step: 6.78, position: new THREE.Vector3(3.8, -3.25, -1.1) },
    { step: 7.45, position: new THREE.Vector3(0, 1.2, 0) },
    { step: 11, position: new THREE.Vector3(-1.25, 1.08, 1.9) },
  ], []);
  const nextPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!artifact.current) return;
    const step = worldState.current.currentStep;
    artifact.current.visible = step > 0.62;
    let start = route[0];
    let end = route[1];
    for (let index = 0; index < route.length - 1; index += 1) {
      if (step >= route[index].step && step <= route[index + 1].step) {
        start = route[index];
        end = route[index + 1];
        break;
      }
      if (step > route[index + 1].step) {
        start = route[index + 1];
        end = route[Math.min(route.length - 1, index + 2)];
      }
    }
    const progress = THREE.MathUtils.clamp((step - start.step) / Math.max(0.001, end.step - start.step), 0, 1);
    nextPosition.copy(start.position).lerp(end.position, THREE.MathUtils.smoothstep(progress, 0, 1));
    artifact.current.position.copy(nextPosition);
    const pulse = reducedMotion ? 1 : 1 + Math.sin(clock.elapsedTime * 4.2) * 0.12;
    artifact.current.scale.setScalar(pulse);
    if (material.current) {
      material.current.emissive.set(step < 3 ? "#8a72ff" : step < 5 ? "#36e0c4" : step < 6.7 ? "#4edcf2" : "#42e59f");
    }
  });

  return (
    <group ref={artifact}>
      <mesh><dodecahedronGeometry args={[0.2, 0]} /><meshStandardMaterial ref={material} color="#f1feff" emissive="#8a72ff" emissiveIntensity={5} metalness={0.18} roughness={0.2} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.32, 0.38, 32]} /><meshBasicMaterial color="#8ff6ff" transparent opacity={0.7} /></mesh>
      <pointLight color="#63eaff" intensity={2.8} distance={3.2} />
      <Html center position={[0, 0.48, 0]} distanceFactor={11}><span className="world-object-label">UNIT 204 · MISSION ARTIFACT</span></Html>
    </group>
  );
};

const workforceColor = (type) => ({ approval: "#ffb15b", artifact: "#61f0d3", memory: "#9a85ff", tool: "#68dfff", output: "#72f5ae" }[type] || "#71e7f5");

const WorkforceLayer = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const core = useRef();
  const pulse = useRef();
  const gate = useRef();
  const pulseTarget = useMemo(() => new THREE.Vector3(), []);
  const pulseEnd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const weight = Math.max(stageWeight(step, 5, 1.08), stageWeight(step, 6.72, 0.72));
    group.current.visible = weight > 0.025;
    const targetY = THREE.MathUtils.lerp(-7.1, -3.55, weight);
    group.current.position.y = reducedMotion ? targetY : THREE.MathUtils.damp(group.current.position.y, targetY, 3.2, delta);
    if (core.current && !reducedMotion) core.current.rotation.y = clock.elapsedTime * 0.24;
    if (gate.current && !reducedMotion) gate.current.rotation.z = Math.sin(clock.elapsedTime * 1.7) * 0.18;
    if (pulse.current) {
      const time = reducedMotion ? 4.6 : clock.elapsedTime * 0.62;
      const index = Math.floor(time) % workforceNodes.length;
      const next = Math.min(workforceNodes.length - 1, index + 1);
      pulseTarget.set(...workforceNodes[index].position).lerp(pulseEnd.set(...workforceNodes[next].position), time - Math.floor(time));
      pulse.current.position.copy(pulseTarget);
    }
  });

  return (
    <group ref={group} position={[0, -7.1, -1.2]}>
      <Grid args={[17, 11]} cellSize={0.8} cellThickness={0.28} cellColor="#245b64" sectionSize={3.2} sectionThickness={0.7} sectionColor="#55d5e5" fadeDistance={18} fadeStrength={1.1} infiniteGrid />
      {workforceNodes.map((node, index) => {
        const next = workforceNodes[Math.min(index + 1, workforceNodes.length - 1)];
        const color = workforceColor(node.type);
        return (
          <group key={node.label}>
            {index < workforceNodes.length - 1 && <Line points={[node.position, next.position]} color={node.type === "approval" ? "#ffb15b" : "#56dce8"} lineWidth={1.45} transparent opacity={0.72} />}
            <mesh position={[node.position[0], node.position[1] - 0.16, node.position[2]]}><cylinderGeometry args={[0.44, 0.56, 0.16, 8]} /><meshStandardMaterial color="#182328" metalness={0.54} roughness={0.42} /></mesh>
            <mesh position={node.position}>{node.type === "approval" ? <boxGeometry args={[0.32, 0.32, 0.32]} /> : <octahedronGeometry args={[node.type === "artifact" ? 0.25 : 0.19, 0]} />}<meshStandardMaterial color="#eaffff" emissive={color} emissiveIntensity={3.8} /></mesh>
            <Html center position={[node.position[0], node.position[1] + 0.48, node.position[2]]} distanceFactor={10}><span className={`world-object-label ${node.type === "approval" ? "world-object-label-approval" : ""}`}>{node.label}</span></Html>
          </group>
        );
      })}
      <mesh ref={pulse}><sphereGeometry args={[0.12, 12, 12]} /><meshStandardMaterial color="#fff" emissive="#58e7f4" emissiveIntensity={5} /></mesh>
      <mesh ref={core} position={[0, 0.25, 2.15]}><torusKnotGeometry args={[0.38, 0.1, 84, 10]} /><meshStandardMaterial color="#e9feff" emissive="#54ddeb" emissiveIntensity={3.8} metalness={0.3} roughness={0.22} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0.15]}><ringGeometry args={[6.75, 6.82, 96]} /><meshBasicMaterial color="#4cd9e9" transparent opacity={0.2} /></mesh>
      <Html center position={[0, 1.05, 2.15]} distanceFactor={10}><span className="world-object-label">ORCHESTRATION CORE</span></Html>
      <Html center position={[0, 0.34, -2.48]} distanceFactor={10}><span className="world-object-label">POLICY · OWNERSHIP · MEMORY · GOVERNANCE BOUNDARY</span></Html>
      <group ref={gate} position={[0.2, 0.75, 0.4]}>{[0, 1].map((ring) => <mesh key={ring} scale={1 + ring * 0.42}><torusGeometry args={[0.5, 0.022, 8, 48]} /><meshBasicMaterial color="#ffb15b" transparent opacity={0.78 - ring * 0.24} /></mesh>)}</group>
      <Line points={[workforceNodes.at(-1).position, [3.8, 2.2, 1.1], [0, 4.9, 1.2]]} color="#72f5ae" lineWidth={1.25} transparent opacity={0.65} />
      <Html center position={[0, 3.85, 0]} distanceFactor={10}><div className="world-title-label"><span>WORKFORCE OS</span><strong>THE PROPERTY IS WHAT YOU SEE · THE WORKFORCE MAKES IT MOVE</strong></div></Html>
      <Html center position={[0, 2.85, -1.7]} distanceFactor={10}><span className="world-object-label world-object-label-approval">AUTOMATE → APPROVAL REQUIRED → EXECUTE → AUDIT</span></Html>
    </group>
  );
};

const BaselineLayer = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const core = useRef();
  const capability = useRef();
  const deployTarget = useMemo(() => new THREE.Vector3(7.8, 2.45, 2.2), []);
  const capabilityEnd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const weight = stageWeight(worldState.current.currentStep, 6, 1.02);
    group.current.visible = weight > 0.025;
    const targetY = THREE.MathUtils.lerp(-10.2, -6.55, weight);
    group.current.position.y = reducedMotion ? targetY : THREE.MathUtils.damp(group.current.position.y, targetY, 3, delta);
    if (core.current && !reducedMotion) core.current.rotation.y = clock.elapsedTime * 0.18;
    if (capability.current) {
      const travel = reducedMotion ? 0.78 : (clock.elapsedTime * 0.24) % 1;
      const nodeIndex = Math.min(baselineNodes.length - 2, Math.floor(travel * (baselineNodes.length - 1)));
      const localProgress = travel * (baselineNodes.length - 1) - nodeIndex;
      const start = baselineNodes[nodeIndex].position;
      const end = baselineNodes[nodeIndex + 1].position;
      capability.current.position.set(...start).lerp(capabilityEnd.set(...end), localProgress);
      if (travel > 0.88) capability.current.position.lerp(deployTarget, (travel - 0.88) / 0.12);
      capability.current.rotation.y = reducedMotion ? 0 : clock.elapsedTime * 1.2;
    }
  });

  return (
    <group ref={group} position={[0, -10.2, -1.2]}>
      <Grid args={[19, 12]} cellSize={0.78} cellThickness={0.3} cellColor="#233f63" sectionSize={3.1} sectionThickness={0.72} sectionColor="#756ee6" fadeDistance={20} fadeStrength={1.2} infiniteGrid />
      {baselineNodes.map((node, index) => {
        const next = baselineNodes[Math.min(index + 1, baselineNodes.length - 1)];
        return (
          <group key={node.label}>
            {index < baselineNodes.length - 1 && <Line points={[node.position, next.position]} color={index % 2 ? "#8377ff" : "#52dce8"} lineWidth={1.4} transparent opacity={0.72} />}
            <mesh position={[node.position[0], node.position[1] - 0.17, node.position[2]]}><cylinderGeometry args={[0.35, 0.46, 0.14, 6]} /><meshStandardMaterial color="#1a1c2b" metalness={0.6} roughness={0.4} /></mesh>
            <mesh position={node.position}><icosahedronGeometry args={[node.label === "CAPABILITY" || node.label === "AGENT" ? 0.26 : 0.17, 1]} /><meshStandardMaterial color="#e9faff" emissive={index % 2 ? "#7568ff" : "#37d8ee"} emissiveIntensity={3.6} /></mesh>
            <mesh position={node.position} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.32, 0.36, 28]} /><meshBasicMaterial color={index % 2 ? "#9487ff" : "#61e6f2"} transparent opacity={0.42} /></mesh>
            <Html center position={[node.position[0], node.position[1] + 0.47, node.position[2]]} distanceFactor={10}><span className="world-object-label">{node.label}</span></Html>
          </group>
        );
      })}
      <mesh ref={core} position={[0, 0.25, 2.15]}><icosahedronGeometry args={[0.62, 2]} /><meshStandardMaterial color="#f0f4ff" emissive="#7068ff" emissiveIntensity={4.6} metalness={0.22} roughness={0.25} /></mesh>
      <mesh ref={capability}><dodecahedronGeometry args={[0.22, 0]} /><meshStandardMaterial color="#fff" emissive="#6cecff" emissiveIntensity={5} /></mesh>
      <Line points={[baselineNodes.at(-1).position, [7.8, 2.45, 2.2]]} color="#69f0bd" lineWidth={1.55} transparent opacity={0.78} />
      <group position={[7.8, 2.45, 2.2]}>
        <mesh><octahedronGeometry args={[0.34, 0]} /><meshStandardMaterial color="#fff" emissive="#47e3aa" emissiveIntensity={4.4} /></mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.52, 0.58, 36]} /><meshBasicMaterial color="#6bf0bc" transparent opacity={0.75} /></mesh>
        <Html center position={[0, 0.62, 0]} distanceFactor={10}><span className="world-object-label world-object-label-resolved">DEPLOY TO WORKFORCE OS</span></Html>
      </group>
      <Html center position={[0, 4.15, 0]} distanceFactor={10}><div className="world-title-label"><span>BASELINE STUDIOS / ARKITECH</span><strong>PROBLEM → SPEC KIT → ASSEMBLE → TEST → PUBLISH → DEPLOY</strong></div></Html>
    </group>
  );
};

const ResolutionBeacon = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const ring = useRef();
  useFrame(({ clock }) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    group.current.visible = (step > 6.65 && step < 8.15) || step > 10.35;
    if (ring.current && !reducedMotion) ring.current.rotation.z = clock.elapsedTime * 0.35;
  });
  return (
    <group ref={group} position={[0, 0.08, 0]}>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[3.2, 3.28, 64]} /><meshBasicMaterial color="#68f1b5" transparent opacity={0.82} /></mesh>
      <mesh position={[0, 4.3, 0]}><sphereGeometry args={[0.12, 16, 16]} /><meshStandardMaterial color="#effff8" emissive="#4ee5a5" emissiveIntensity={5} /></mesh>
      <Line points={[[0, 4.3, 0], [0, 0.15, 0]]} color="#68f1b5" lineWidth={1.1} transparent opacity={0.58} />
      <Html center position={[0, 4.75, 0]} distanceFactor={10}><span className="world-object-label world-object-label-resolved">CAPABILITY DEPLOYED · PROPERTY UPDATED</span></Html>
    </group>
  );
};

const Neighborhood = ({ worldState, terrainMaterial, reducedMotion, isMobile }) => (
  <group>
    <mesh receiveShadow position={[0, -0.48, -2]}><boxGeometry args={[30, 0.9, 22]} /><meshStandardMaterial ref={terrainMaterial} color="#1e3527" transparent roughness={0.98} /></mesh>
    <mesh receiveShadow position={[0, 0.015, 5.9]}><boxGeometry args={[30, 0.08, 3.6]} /><meshStandardMaterial color="#222528" roughness={0.94} /></mesh>
    <mesh receiveShadow position={[0, 0.07, 4.05]}><boxGeometry args={[30, 0.06, 0.42]} /><meshStandardMaterial color="#8d8b82" roughness={0.95} /></mesh>
    <mesh receiveShadow position={[0, 0.07, 7.75]}><boxGeometry args={[30, 0.06, 0.42]} /><meshStandardMaterial color="#8d8b82" roughness={0.95} /></mesh>
    <mesh position={[0, 0.065, 5.9]}><boxGeometry args={[30, 0.012, 0.055]} /><meshBasicMaterial color="#cbbd8f" transparent opacity={0.48} /></mesh>
    <House position={[0, 0, 0]} worldState={worldState} reducedMotion={reducedMotion} />
    <ArrivalSign worldState={worldState} />
    <House position={[4.7, 0, -4.2]} scale={0.86} wallColor="#9a826a" roofColor="#3d322b" vision worldState={worldState} reducedMotion={reducedMotion} />
    {!isMobile && <>
      <House position={[-6.6, 0, -5.1]} scale={0.64} wallColor="#6d766b" worldState={worldState} reducedMotion={reducedMotion} />
      <House position={[9.2, 0, 0.3]} scale={0.58} wallColor="#766758" worldState={worldState} reducedMotion={reducedMotion} />
      <House position={[-10.4, 0, 0.2]} scale={0.54} wallColor="#827463" worldState={worldState} reducedMotion={reducedMotion} />
    </>}
    {[[-6.1, 0, 1.2], [6.5, 0, 1.4], [-3.6, 0, -6.9], [8.1, 0, -6.3], [-11.2, 0, -6.2]].slice(0, isMobile ? 3 : 5).map((position, index) => <Tree key={position.join("-")} position={position} scale={0.72 + index * 0.05} reducedMotion={reducedMotion} />)}
    {[[-10, 0, 4.2], [-5, 0, 7.65], [0, 0, 4.2], [5, 0, 7.65], [10, 0, 4.2]].slice(0, isMobile ? 3 : 5).map((position) => <StreetLight key={position.join("-")} position={position} />)}
    <MovingVehicle reducedMotion={reducedMotion} />
    <MissionArtifact worldState={worldState} reducedMotion={reducedMotion} />
    <OperationsLayer worldState={worldState} reducedMotion={reducedMotion} />
    <VoiceLayer worldState={worldState} reducedMotion={reducedMotion} />
    <VisionLayer worldState={worldState} reducedMotion={reducedMotion} />
    <WorkforceLayer worldState={worldState} reducedMotion={reducedMotion} />
    <BaselineLayer worldState={worldState} reducedMotion={reducedMotion} />
    <ResolutionBeacon worldState={worldState} reducedMotion={reducedMotion} />
    <WalterTwin enabled={walterTwinEnabled} state="Welcome" position={[-2.8, 0, 2.6]} rotation={[0, 0.55, 0]} scale={1} />
  </group>
);

const PersistentWorldScene = ({ worldState, isMobile, reducedMotion }) => {
  const world = useRef();
  const terrainMaterial = useRef();
  const moon = useRef();
  const ambient = useRef();
  const warmKey = useRef();
  const aiKey = useRef();
  const reveal = useRef(reducedMotion ? 1 : 0.02);
  const [builderLoaded, setBuilderLoaded] = useState(false);

  useFrame((_, delta) => {
    if (worldState.current.paused) return;
    reveal.current = reducedMotion ? 1 : THREE.MathUtils.damp(reveal.current, 1, 1.35, delta);
    if (world.current) {
      world.current.scale.setScalar(0.92 + reveal.current * 0.08);
      world.current.position.y = -0.35 + reveal.current * 0.35;
    }
    const step = worldState.current.currentStep;
    const workforceWeight = Math.max(stageWeight(step, 5, 1.08), stageWeight(step, 6.72, 0.7));
    const baselineWeight = stageWeight(step, 6, 1.02);
    const undergroundWeight = Math.max(workforceWeight, baselineWeight);
    if (terrainMaterial.current) terrainMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.24, undergroundWeight);
    if (moon.current) moon.current.intensity = THREE.MathUtils.lerp(0.4, 3.1, reveal.current);
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(0.03, 0.34, reveal.current);
    if (warmKey.current) warmKey.current.intensity = THREE.MathUtils.lerp(7.8, 4.1, undergroundWeight);
    if (aiKey.current) aiKey.current.intensity = THREE.MathUtils.lerp(2.2, 8.4, Math.max(stageWeight(step, 3.5, 2.7), undergroundWeight));
    if (!builderLoaded && step > 5.35) setBuilderLoaded(true);
  });

  return (
    <>
      <color attach="background" args={["#07090c"]} />
      <fog attach="fog" args={["#090d12", isMobile ? 19 : 23, isMobile ? 48 : 62]} />
      <ambientLight ref={ambient} intensity={0.03} color="#9bb8cb" />
      <hemisphereLight color="#8aa6bc" groundColor="#1a211b" intensity={0.42} />
      <directionalLight ref={moon} castShadow={!isMobile} position={[11, 15, 10]} intensity={0.4} color="#9dbbd6" shadow-mapSize-width={isMobile ? 512 : 1024} shadow-mapSize-height={isMobile ? 512 : 1024} />
      <pointLight ref={warmKey} position={[0, 6.5, 1]} color="#ffb667" intensity={7.5} distance={14} />
      <pointLight position={[4.7, 5.4, -4.2]} color="#ffbc76" intensity={5.8} distance={11} />
      <pointLight ref={aiKey} position={[0, 3.8, -1.5]} color="#55dff0" intensity={2.2} distance={19} />
      <CameraRig worldState={worldState} reducedMotion={reducedMotion} isMobile={isMobile} />
      <NightAtmosphere isMobile={isMobile} reducedMotion={reducedMotion} />
      <group ref={world} scale={0.92} position={[0, -0.35, 0]}>
        <Neighborhood worldState={worldState} terrainMaterial={terrainMaterial} reducedMotion={reducedMotion} isMobile={isMobile} />
        {builderLoaded && <BuilderStudio worldState={worldState} reducedMotion={reducedMotion} isMobile={isMobile} />}
      </group>
    </>
  );
};

export default PersistentWorldScene;
