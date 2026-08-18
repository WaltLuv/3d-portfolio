import { Grid, Html, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { lazy, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { baselineNodes, cameraRoute, operationNodes } from "./worldData";

const BuilderStudio = lazy(() => import("./BuilderStudio"));

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
  const pathStart = useMemo(() => new THREE.Vector3(0, 1.35, 0), []);
  const pathEnd = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const weight = stageWeight(worldState.current.currentStep, 1, 0.92);
    group.current.visible = weight > 0.035;
    group.current.scale.setScalar(0.94 + weight * 0.06);
    if (issue.current) issue.current.scale.setScalar(0.82 + Math.sin((reducedMotion ? 0 : clock.elapsedTime) * 4) * 0.14);
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
      <mesh ref={issue} position={[-1.25, 1.05, 1.9]}><octahedronGeometry args={[0.18, 0]} /><meshStandardMaterial color="#ffca7a" emissive="#ff7438" emissiveIntensity={4.2} /></mesh>
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
    const weight = stageWeight(worldState.current.currentStep, 2, 0.92);
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
        <Html center position={[0, 0.48, 0]} distanceFactor={10}><span className="world-object-label">WORK ORDER CREATED</span></Html>
      </group>
      <Html center position={[-5.5, 2.55, 3.6]} distanceFactor={10}><span className="world-object-label world-object-label-violet">CALL → UNDERSTAND → PROPERTY CONTEXT → ROUTE → ACTION</span></Html>
      <Html center position={[-0.1, 4.55, 0]} distanceFactor={10}><div className="world-title-label"><span>VOICEOPS</span><strong>CONVERSATION BECOMES OPERATION</strong></div></Html>
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
    const phase = clamp01((step - 2.26) / 0.94);
    group.current.visible = step > 2.22 && step < 3.88;
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
            <strong>ROOF FINDING DETECTED</strong>
            <b>REPAIR COST GUIDE</b>
            <small>Estimate assembled → quote ready → PropControl action</small>
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

const BaselineLayer = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const core = useRef();
  const productNodes = [
    { label: "PROPCONTROL", position: [-4.4, 2.5, 3.4] },
    { label: "VOICEOPS", position: [0, 2.9, 4.2] },
    { label: "VISIONOPS", position: [4.4, 2.5, 3.4] },
  ];

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const weight = Math.max(stageWeight(worldState.current.currentStep, 4, 1.05), stageWeight(worldState.current.currentStep, 4.55, 0.8));
    group.current.visible = weight > 0.025;
    group.current.position.y = reducedMotion ? THREE.MathUtils.lerp(-5.2, -2.65, weight) : THREE.MathUtils.damp(group.current.position.y, THREE.MathUtils.lerp(-5.2, -2.65, weight), 3, delta);
    if (core.current && !reducedMotion) core.current.rotation.y = clock.elapsedTime * 0.18;
  });

  return (
    <group ref={group} position={[0, -5.2, -1.2]}>
      <Grid args={[16, 12]} cellSize={0.75} cellThickness={0.35} cellColor="#1d7886" sectionSize={3} sectionThickness={0.7} sectionColor="#5f70e8" fadeDistance={18} fadeStrength={1.2} infiniteGrid />
      {baselineNodes.map((node, index) => {
        const next = baselineNodes[Math.min(index + 1, baselineNodes.length - 1)];
        return (
          <group key={node.label}>
            {index < baselineNodes.length - 1 && <Line points={[node.position, next.position]} color={index % 2 ? "#8175ff" : "#52e7f5"} lineWidth={1.35} transparent opacity={0.72} />}
            <mesh position={node.position}><icosahedronGeometry args={[node.label === "AGENT" ? 0.28 : 0.18, 1]} /><meshStandardMaterial color="#dffcff" emissive={index % 2 ? "#7568ff" : "#37d8ee"} emissiveIntensity={3.6} /></mesh>
            <Html center position={[node.position[0], node.position[1] + 0.5, node.position[2]]} distanceFactor={10}><span className="world-object-label">{node.label}</span></Html>
          </group>
        );
      })}
      <mesh ref={core} position={[0, 0.25, 0]}><icosahedronGeometry args={[0.54, 2]} /><meshStandardMaterial color="#eafcff" emissive="#7068ff" emissiveIntensity={4.6} metalness={0.22} roughness={0.28} /></mesh>
      {productNodes.map((node, index) => (
        <group key={node.label}>
          <Line points={[[0, 0.25, 0], node.position]} color={index === 0 ? "#60edff" : index === 1 ? "#927eff" : "#60f2d7"} lineWidth={1.25} transparent opacity={0.72} />
          <mesh position={node.position}><octahedronGeometry args={[0.25, 0]} /><meshStandardMaterial color="#fff" emissive={index === 1 ? "#826dff" : "#42e1ee"} emissiveIntensity={4} /></mesh>
          <Html center position={[node.position[0], node.position[1] + 0.55, node.position[2]]} distanceFactor={10}><span className="world-object-label world-object-label-violet">{node.label}</span></Html>
        </group>
      ))}
      <Html center position={[0, 4.25, 0]} distanceFactor={10}><div className="world-title-label"><span>BASELINE STUDIOS</span><strong>THE INTELLIGENCE BENEATH THE OPERATION</strong></div></Html>
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
    <OperationsLayer worldState={worldState} reducedMotion={reducedMotion} />
    <VoiceLayer worldState={worldState} reducedMotion={reducedMotion} />
    <VisionLayer worldState={worldState} reducedMotion={reducedMotion} />
    <BaselineLayer worldState={worldState} reducedMotion={reducedMotion} />
  </group>
);

const PersistentWorldScene = ({ worldState, isMobile, reducedMotion }) => {
  const world = useRef();
  const terrainMaterial = useRef();
  const moon = useRef();
  const ambient = useRef();
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
    const baselineWeight = Math.max(stageWeight(step, 4, 1.05), stageWeight(step, 4.55, 0.75));
    if (terrainMaterial.current) terrainMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.28, baselineWeight);
    if (moon.current) moon.current.intensity = THREE.MathUtils.lerp(0.4, 3.1, reveal.current);
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(0.03, 0.34, reveal.current);
    if (!builderLoaded && step > 3.35) setBuilderLoaded(true);
  });

  return (
    <>
      <color attach="background" args={["#07090c"]} />
      <fog attach="fog" args={["#090d12", isMobile ? 19 : 23, isMobile ? 48 : 62]} />
      <ambientLight ref={ambient} intensity={0.03} color="#9bb8cb" />
      <hemisphereLight color="#8aa6bc" groundColor="#1a211b" intensity={0.42} />
      <directionalLight ref={moon} castShadow={!isMobile} position={[11, 15, 10]} intensity={0.4} color="#9dbbd6" shadow-mapSize-width={isMobile ? 512 : 1024} shadow-mapSize-height={isMobile ? 512 : 1024} />
      <pointLight position={[0, 6.5, 1]} color="#ffb667" intensity={7.5} distance={14} />
      <pointLight position={[4.7, 5.4, -4.2]} color="#ffbc76" intensity={5.8} distance={11} />
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
