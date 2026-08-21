import { Html, Line } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { lazy, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { cameraRoute } from "./worldData";

const BuilderStudio = lazy(() => import("./BuilderStudio"));

const clamp01 = (value) => THREE.MathUtils.clamp(value, 0, 1);
const stageWeight = (step, center, radius = 0.85) => clamp01(1 - Math.abs(step - center) / radius);

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
    const progress = THREE.MathUtils.smoothstep(currentStep - startIndex, 0, 1);

    desiredPosition.copy(route[startIndex].position).lerp(route[endIndex].position, progress);
    desiredTarget.copy(route[startIndex].target).lerp(route[endIndex].target, progress);
    const desiredFov = THREE.MathUtils.lerp(route[startIndex].fov, route[endIndex].fov, progress);

    const keys = worldState.current.keys;
    const exploreX = worldState.current.exploreEnabled ? ((keys.has("d") ? 1 : 0) - (keys.has("a") ? 1 : 0)) * 1.15 : 0;
    const exploreZ = worldState.current.exploreEnabled ? ((keys.has("s") ? 1 : 0) - (keys.has("w") ? 1 : 0)) * 1.15 : 0;
    exploreOffset.current.x = THREE.MathUtils.damp(exploreOffset.current.x, exploreX, 4, delta);
    exploreOffset.current.z = THREE.MathUtils.damp(exploreOffset.current.z, exploreZ, 4, delta);

    const pointerScale = reducedMotion || isMobile ? 0 : 0.35;
    desiredPosition.x += pointer.x * pointerScale + exploreOffset.current.x;
    desiredPosition.y += pointer.y * pointerScale * 0.28;
    desiredPosition.z += exploreOffset.current.z;
    desiredTarget.x += pointer.x * pointerScale * 0.12;
    desiredTarget.y += pointer.y * pointerScale * 0.08;

    const damping = reducedMotion ? 100 : 3.15;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, desiredPosition.x, damping, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, desiredPosition.y, damping, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredPosition.z, damping, delta);
    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, desiredTarget.x, damping, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, desiredTarget.y, damping, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, desiredTarget.z, damping, delta);
    camera.fov = THREE.MathUtils.damp(camera.fov, desiredFov, damping, delta);
    camera.updateProjectionMatrix();
    camera.lookAt(currentTarget.current);
  });

  return null;
};

const NightAtmosphere = ({ isMobile, reducedMotion }) => {
  const points = useRef();
  const positions = useMemo(() => {
    const count = isMobile ? 45 : 95;
    const values = new Float32Array(count * 3);
    for (let index = 0; index < count; index += 1) {
      values[index * 3] = (Math.random() - 0.5) * 52;
      values[index * 3 + 1] = 4 + Math.random() * 16;
      values[index * 3 + 2] = (Math.random() - 0.5) * 52;
    }
    return values;
  }, [isMobile]);

  useFrame((_, delta) => {
    if (points.current && !reducedMotion) points.current.rotation.y += delta * 0.002;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#c6d4d9" size={0.025} transparent opacity={0.28} depthWrite={false} />
    </points>
  );
};

const WindowLight = ({ position, size = [0.68, 0.58, 0.055], intensity = 1.8 }) => (
  <mesh position={position}>
    <boxGeometry args={size} />
    <meshStandardMaterial color="#ffe2b4" emissive="#ffab55" emissiveIntensity={intensity} roughness={0.44} />
  </mesh>
);

const House = ({
  position,
  scale = 1,
  wallColor = "#877360",
  roofColor = "#302a26",
  missionHouse = false,
  visionHouse = false,
  worldState,
  reducedMotion,
}) => {
  const group = useRef();
  const wallMaterial = useRef();
  const roofMaterial = useRef();
  const statusMaterial = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const visionWeight = visionHouse ? stageWeight(step, 3, 0.9) : 0;
    const hoverScale = hovered ? 1.018 : 1;
    const nextScale = reducedMotion ? hoverScale : THREE.MathUtils.damp(group.current.scale.x / scale, hoverScale, 5, delta);
    group.current.scale.setScalar(nextScale * scale);

    if (wallMaterial.current) {
      wallMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.72, visionWeight);
      wallMaterial.current.emissiveIntensity = hovered ? 0.08 : 0.015;
    }
    if (roofMaterial.current) roofMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.8, visionWeight);

    if (missionHouse && statusMaterial.current) {
      const resolved = step > 10.25;
      const active = step > 0.72 && !resolved;
      statusMaterial.current.color.set(resolved ? "#d9f4df" : active ? "#ffd5a0" : "#6e756d");
      statusMaterial.current.emissive.set(resolved ? "#3ca66f" : active ? "#c96f34" : "#101710");
      statusMaterial.current.emissiveIntensity = resolved ? 2.3 : active ? 1.7 : 0.2;
    }
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
        <meshStandardMaterial ref={wallMaterial} color={wallColor} emissive="#5e3f29" transparent roughness={0.77} metalness={0.02} />
      </mesh>
      <mesh castShadow position={[-0.55, 2.62, -0.08]}>
        <boxGeometry args={[2.85, 1.22, 3.15]} />
        <meshStandardMaterial color={wallColor} roughness={0.75} />
      </mesh>
      <mesh castShadow position={[-0.55, 3.53, -0.08]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.54, 0.82]}>
        <coneGeometry args={[2.48, 1.42, 4]} />
        <meshStandardMaterial ref={roofMaterial} color={roofColor} transparent roughness={0.86} metalness={0.02} />
      </mesh>
      <mesh castShadow position={[2.72, 0.75, 0.15]}>
        <boxGeometry args={[1.6, 1.5, 2.85]} />
        <meshStandardMaterial color="#6c6359" roughness={0.82} />
      </mesh>
      <mesh castShadow position={[2.72, 1.66, 0.15]} rotation={[0, Math.PI / 4, 0]} scale={[1, 0.46, 1.18]}>
        <coneGeometry args={[1.38, 0.9, 4]} />
        <meshStandardMaterial color={roofColor} roughness={0.85} />
      </mesh>
      <mesh position={[0.35, 0.88, 1.78]}>
        <boxGeometry args={[0.78, 1.6, 0.08]} />
        <meshStandardMaterial color="#3a241a" roughness={0.78} />
      </mesh>
      <mesh position={[2.72, 0.72, 1.6]}>
        <boxGeometry args={[1.22, 0.95, 0.07]} />
        <meshStandardMaterial color="#4a4239" metalness={0.08} roughness={0.78} />
      </mesh>
      <WindowLight position={[-1.32, 2.58, 1.51]} />
      <WindowLight position={[0.25, 2.58, 1.51]} />
      <WindowLight position={[-1.28, 1.06, 1.77]} size={[0.82, 0.72, 0.055]} intensity={1.55} />
      <WindowLight position={[1.24, 1.06, 1.77]} size={[0.74, 0.72, 0.055]} intensity={1.55} />
      <mesh receiveShadow position={[0.36, 0.06, 2.28]}>
        <boxGeometry args={[1.3, 0.12, 1.35]} />
        <meshStandardMaterial color="#a59b8b" roughness={0.96} />
      </mesh>
      {[[-0.3, 0.86, 2.08], [1.02, 0.86, 2.08]].map((columnPosition) => (
        <mesh key={columnPosition.join("-")} castShadow position={columnPosition}>
          <cylinderGeometry args={[0.085, 0.085, 1.72, 10]} />
          <meshStandardMaterial color="#d0c4b2" roughness={0.79} />
        </mesh>
      ))}
      {missionHouse && (
        <group position={[-1.65, 0.42, 2.08]}>
          <mesh castShadow><boxGeometry args={[0.34, 0.52, 0.09]} /><meshStandardMaterial color="#303833" roughness={0.68} /></mesh>
          <mesh position={[0, 0.02, 0.052]}><boxGeometry args={[0.19, 0.08, 0.025]} /><meshStandardMaterial ref={statusMaterial} color="#6e756d" emissive="#101710" emissiveIntensity={0.2} /></mesh>
          <Html center position={[0, -0.52, 0]} distanceFactor={10}><span className="world-address-tag">UNIT 204</span></Html>
        </group>
      )}
    </group>
  );
};

const Tree = ({ position, scale = 1, reducedMotion }) => {
  const crown = useRef();
  useFrame(({ clock }) => {
    if (crown.current && !reducedMotion) crown.current.rotation.z = Math.sin(clock.elapsedTime * 0.45 + position[0]) * 0.012;
  });
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[0, 0.62, 0]}><cylinderGeometry args={[0.12, 0.19, 1.25, 8]} /><meshStandardMaterial color="#4a3828" roughness={0.97} /></mesh>
      <group ref={crown} position={[0, 1.15, 0]}>
        <mesh castShadow position={[0, 0.5, 0]}><coneGeometry args={[0.76, 1.6, 9]} /><meshStandardMaterial color="#203d2a" roughness={0.97} /></mesh>
        <mesh castShadow position={[0, 1.25, 0]}><coneGeometry args={[0.56, 1.25, 9]} /><meshStandardMaterial color="#2f5940" roughness={0.95} /></mesh>
      </group>
    </group>
  );
};

const StreetLight = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 1.35, 0]}><cylinderGeometry args={[0.045, 0.065, 2.7, 8]} /><meshStandardMaterial color="#25282b" metalness={0.62} roughness={0.46} /></mesh>
    <mesh position={[0, 2.74, 0]}><sphereGeometry args={[0.13, 14, 14]} /><meshStandardMaterial color="#ffe5b2" emissive="#ffad4d" emissiveIntensity={3.8} /></mesh>
    <pointLight position={[0, 2.68, 0]} color="#ffbf6a" intensity={3.5} distance={4.5} decay={2} />
  </group>
);

const ServiceVan = ({ worldState, reducedMotion }) => {
  const van = useRef();
  useFrame((_, delta) => {
    if (!van.current) return;
    const step = worldState.current.currentStep;
    const targetX = step < 1.75 ? -6.2 : step < 6.7 ? -1.8 : -6.2;
    const targetZ = step < 1.75 ? -4.9 : step < 6.7 ? 3.85 : -4.9;
    van.current.position.x = reducedMotion ? targetX : THREE.MathUtils.damp(van.current.position.x, targetX, 1.55, delta);
    van.current.position.z = reducedMotion ? targetZ : THREE.MathUtils.damp(van.current.position.z, targetZ, 1.55, delta);
    van.current.rotation.y = targetZ > 0 ? -0.3 : Math.PI;
  });

  return (
    <group ref={van} position={[-6.2, 0.27, -4.9]}>
      <mesh castShadow><boxGeometry args={[1.65, 0.72, 0.9]} /><meshStandardMaterial color="#d7d3c8" roughness={0.58} metalness={0.08} /></mesh>
      <mesh castShadow position={[-0.28, 0.58, 0]}><boxGeometry args={[0.92, 0.48, 0.84]} /><meshStandardMaterial color="#c7c3b8" roughness={0.58} /></mesh>
      <mesh position={[0.7, 0.05, 0]}><boxGeometry args={[0.23, 0.3, 0.91]} /><meshStandardMaterial color="#bf6f42" roughness={0.7} /></mesh>
      <mesh position={[0.45, 0.2, 0.456]}><planeGeometry args={[0.55, 0.2]} /><meshStandardMaterial color="#314652" emissive="#2e5e6c" emissiveIntensity={0.45} /></mesh>
      {[[-0.52, -0.32, 0.5], [0.52, -0.32, 0.5], [-0.52, -0.32, -0.5], [0.52, -0.32, -0.5]].map((wheel) => (
        <mesh key={wheel.join("-")} position={wheel} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.2, 0.2, 0.12, 14]} /><meshStandardMaterial color="#121314" roughness={0.94} /></mesh>
      ))}
    </group>
  );
};

const ArrivalSign = ({ worldState }) => {
  const group = useRef();
  useFrame(() => {
    if (group.current) group.current.visible = worldState.current.currentStep < 0.8;
  });

  return (
    <group ref={group} position={[0, 0, 3.35]}>
      <mesh castShadow position={[0, 1.15, 0]}><boxGeometry args={[5.4, 1.58, 0.18]} /><meshStandardMaterial color="#282623" metalness={0.24} roughness={0.62} /></mesh>
      {[-2.25, 2.25].map((x) => <mesh castShadow key={x} position={[x, 0.45, 0]}><boxGeometry args={[0.1, 1.2, 0.1]} /><meshStandardMaterial color="#463a2d" metalness={0.15} roughness={0.72} /></mesh>)}
      <Html center position={[0, 1.18, 0.2]} distanceFactor={9}>
        <div className="world-arrival-sign world-arrival-sign-v2"><strong>WALTER THORNTON</strong><span>REAL ESTATE OPERATIONS × AI PRODUCT BUILDER</span></div>
      </Html>
      <pointLight position={[0, 1.7, 1]} color="#ffb862" intensity={1.8} distance={4} />
    </group>
  );
};

const VoiceEvent = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const pulse = useRef();
  const start = useMemo(() => new THREE.Vector3(-1.28, 2.62, 1.83), []);
  const end = useMemo(() => new THREE.Vector3(-5.7, 2.2, -4.8), []);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const weight = stageWeight(worldState.current.currentStep, 1, 0.82);
    group.current.visible = weight > 0.04;
    if (pulse.current) {
      const travel = reducedMotion ? 0.62 : (clock.elapsedTime * 0.22) % 1;
      pulse.current.position.copy(start).lerp(end, travel);
      pulse.current.scale.setScalar(0.8 + weight * 0.2);
    }
  });

  return (
    <group ref={group}>
      <Line points={[start.toArray(), end.toArray()]} color="#9a83d7" lineWidth={1} transparent opacity={0.5} />
      <mesh ref={pulse}><sphereGeometry args={[0.1, 12, 12]} /><meshStandardMaterial color="#eee9ff" emissive="#8166ca" emissiveIntensity={3.2} /></mesh>
      <group position={start}>
        {[0, 1].map((ring) => <mesh key={ring} rotation={[-Math.PI / 2, 0, 0]} scale={1 + ring * 0.55}><ringGeometry args={[0.2, 0.225, 28]} /><meshBasicMaterial color="#9a83d7" transparent opacity={0.58 - ring * 0.18} /></mesh>)}
      </group>
      <Html center position={[-2.2, 4.7, 0.8]} distanceFactor={10}><div className="world-location-sign"><span>VOICEOPS</span><strong>A CALL BECOMES WORK</strong></div></Html>
    </group>
  );
};

const OperationsHub = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const bayLight = useRef();
  const statusLight = useRef();

  useFrame(({ clock }) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const active = Math.max(stageWeight(step, 2, 0.92), stageWeight(step, 10.9, 0.65));
    group.current.visible = step > 0.8;
    if (bayLight.current) bayLight.current.intensity = 1.4 + active * 5.2;
    if (statusLight.current) {
      statusLight.current.emissiveIntensity = 0.4 + active * 2.7;
      if (!reducedMotion) statusLight.current.opacity = 0.65 + Math.sin(clock.elapsedTime * 2.2) * 0.12 * active;
    }
  });

  return (
    <group ref={group} position={[-5.8, 0, -6.2]}>
      <mesh castShadow receiveShadow position={[0, 1.25, 0]}><boxGeometry args={[6.8, 2.5, 4.3]} /><meshStandardMaterial color="#5a5650" roughness={0.86} /></mesh>
      <mesh castShadow position={[0, 2.65, 0]}><boxGeometry args={[7.1, 0.35, 4.55]} /><meshStandardMaterial color="#3a3936" roughness={0.78} metalness={0.08} /></mesh>
      {[-1.75, 0.2].map((x) => (
        <group key={x} position={[x, 0.92, 2.18]}>
          <mesh><boxGeometry args={[1.55, 1.7, 0.12]} /><meshStandardMaterial color="#292b2b" roughness={0.7} /></mesh>
          {[0.38, 0.02, -0.34].map((y) => <mesh key={y} position={[0, y, 0.07]}><boxGeometry args={[1.33, 0.05, 0.035]} /><meshStandardMaterial color="#8b8880" roughness={0.72} /></mesh>)}
        </group>
      ))}
      <mesh position={[2.15, 1.25, 2.19]}><boxGeometry args={[1.4, 1.05, 0.09]} /><meshStandardMaterial color="#283136" emissive="#244c54" emissiveIntensity={0.5} roughness={0.45} /></mesh>
      <mesh position={[2.15, 0.62, 2.21]}><boxGeometry args={[0.72, 0.09, 0.035]} /><meshStandardMaterial ref={statusLight} color="#8ca7a8" emissive="#4aabb4" emissiveIntensity={0.4} transparent opacity={0.72} /></mesh>
      <pointLight ref={bayLight} position={[0, 2.25, 2.5]} color="#ffc47f" intensity={1.4} distance={8} />
      <Html center position={[0.6, 3.35, 1.9]} distanceFactor={10}><div className="world-location-sign world-location-sign-physical"><span>PROPCONTROL</span><strong>PROPERTY OPERATIONS</strong></div></Html>
    </group>
  );
};

const VisionInspection = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const scan = useRef();
  const marker = useRef();
  const finding = useRef();

  useFrame(({ clock }) => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const weight = Math.max(stageWeight(step, 3, 0.9), stageWeight(step, 4, 0.78));
    group.current.visible = weight > 0.03;
    if (scan.current) {
      const scanProgress = reducedMotion ? 0.65 : (clock.elapsedTime * 0.16) % 1;
      scan.current.position.x = THREE.MathUtils.lerp(-2.2, 2.2, scanProgress);
      scan.current.material.opacity = 0.07 + weight * 0.14;
    }
    if (marker.current && !reducedMotion) marker.current.scale.setScalar(0.95 + Math.sin(clock.elapsedTime * 2.4) * 0.05);
    if (finding.current) finding.current.visible = step > 2.85;
  });

  return (
    <group ref={group} position={[4.7, 0, -4.2]}>
      <mesh ref={scan} position={[-2.2, 1.9, 0]}><boxGeometry args={[0.045, 4.4, 4.55]} /><meshBasicMaterial color="#5fe1cf" transparent opacity={0.16} depthWrite={false} side={THREE.DoubleSide} /></mesh>
      <mesh ref={marker} position={[-0.62, 3.58, 1.4]}><ringGeometry args={[0.28, 0.32, 32]} /><meshBasicMaterial color="#82e6d7" transparent opacity={0.78} side={THREE.DoubleSide} /></mesh>
      <group ref={finding} position={[-0.62, 3.56, 1.34]}>
        <mesh rotation={[0, Math.PI / 4, 0]} scale={[0.58, 0.22, 0.5]}><coneGeometry args={[1.4, 0.72, 4]} /><meshStandardMaterial color="#8d6e57" emissive="#3a786e" emissiveIntensity={0.4} roughness={0.8} /></mesh>
        <Html center position={[0, 0.65, 0.3]} distanceFactor={10}><span className="world-finding-tag">WATER-AFFECTED AREA</span></Html>
      </group>
      <Html center position={[0.1, 5.0, 0]} distanceFactor={10}><div className="world-location-sign"><span>VISIONOPS</span><strong>INSPECT THE PHYSICAL CONDITION</strong></div></Html>
    </group>
  );
};

const RepairEstimate = ({ worldState }) => {
  const group = useRef();
  useFrame(() => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    group.current.visible = step > 3.45 && step < 5.15;
  });

  return (
    <group ref={group} position={[7.15, 3.25, -2.35]} rotation={[0, -0.52, 0]}>
      <mesh castShadow><boxGeometry args={[2.15, 2.85, 0.16]} /><meshStandardMaterial color="#5a493a" roughness={0.82} /></mesh>
      <mesh position={[0, 0, 0.09]}><planeGeometry args={[1.82, 2.48]} /><meshStandardMaterial color="#eee9dc" roughness={0.93} /></mesh>
      <mesh position={[0, 1.2, 0.14]}><boxGeometry args={[0.72, 0.22, 0.09]} /><meshStandardMaterial color="#313537" metalness={0.45} roughness={0.38} /></mesh>
      {[0.55, 0.24, -0.08, -0.4].map((y, index) => <mesh key={y} position={[-0.18, y, 0.145]}><boxGeometry args={[1.08 - index * 0.08, 0.055, 0.018]} /><meshStandardMaterial color={index === 3 ? "#7c9f8f" : "#8a8982"} roughness={0.9} /></mesh>)}
      <mesh position={[0, -0.82, 0.145]}><boxGeometry args={[1.25, 0.3, 0.025]} /><meshStandardMaterial color="#33483f" emissive="#2d6b55" emissiveIntensity={0.38} roughness={0.76} /></mesh>
      <Html center position={[0, 0, 0.2]} distanceFactor={8.5}><div className="estimate-paper-copy"><span>REPAIR COST GUIDE</span><strong>QUOTE READY</strong><small>Illustrative repair scope · Unit 204</small></div></Html>
    </group>
  );
};

const MissionDocument = ({ worldState, reducedMotion }) => {
  const document = useRef();
  const route = useMemo(() => [
    { step: 3.55, position: new THREE.Vector3(7.15, 3.15, -2.35) },
    { step: 4.25, position: new THREE.Vector3(4.6, 1.6, -3.7) },
    { step: 5.0, position: new THREE.Vector3(-5.4, -3.2, -0.8) },
    { step: 5.42, position: new THREE.Vector3(-2.0, -3.2, -0.3) },
    { step: 5.72, position: new THREE.Vector3(0.4, -3.2, 0.35) },
    { step: 6.02, position: new THREE.Vector3(3.6, -3.2, -0.35) },
    { step: 6.35, position: new THREE.Vector3(5.7, -3.2, 1.4) },
    { step: 7.15, position: new THREE.Vector3(-1.25, 1.15, 1.95) },
    { step: 11, position: new THREE.Vector3(-1.25, 1.15, 1.95) },
  ], []);
  const nextPosition = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!document.current) return;
    const step = worldState.current.currentStep;
    document.current.visible = step > 3.52;
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
    document.current.position.copy(nextPosition);
    document.current.rotation.y = reducedMotion ? -0.15 : -0.15 + Math.sin(clock.elapsedTime * 0.7) * 0.06;
  });

  return (
    <group ref={document} scale={0.45}>
      <mesh castShadow><boxGeometry args={[1.1, 1.48, 0.09]} /><meshStandardMaterial color="#5c4939" roughness={0.82} /></mesh>
      <mesh position={[0, 0, 0.055]}><planeGeometry args={[0.9, 1.22]} /><meshStandardMaterial color="#eee8dc" roughness={0.95} /></mesh>
      <mesh position={[0, 0.62, 0.085]}><boxGeometry args={[0.38, 0.13, 0.05]} /><meshStandardMaterial color="#333638" metalness={0.4} roughness={0.38} /></mesh>
      {[0.3, 0.08, -0.14].map((y) => <mesh key={y} position={[-0.06, y, 0.085]}><boxGeometry args={[0.58, 0.035, 0.012]} /><meshStandardMaterial color="#8c8a83" roughness={0.9} /></mesh>)}
      <mesh position={[0, -0.42, 0.085]}><boxGeometry args={[0.66, 0.14, 0.015]} /><meshStandardMaterial color="#587666" roughness={0.8} /></mesh>
    </group>
  );
};

const DeskStation = ({ position, screenColor = "#31575b" }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.7, 0]}><boxGeometry args={[1.55, 0.12, 0.72]} /><meshStandardMaterial color="#5a5148" roughness={0.78} /></mesh>
    {[-0.58, 0.58].map((x) => <mesh castShadow key={x} position={[x, 0.34, 0]}><boxGeometry args={[0.09, 0.72, 0.6]} /><meshStandardMaterial color="#363533" roughness={0.82} /></mesh>)}
    <mesh position={[0, 1.2, -0.2]}><boxGeometry args={[0.75, 0.58, 0.08]} /><meshStandardMaterial color="#1d2325" roughness={0.5} /></mesh>
    <mesh position={[0, 1.2, -0.155]}><planeGeometry args={[0.62, 0.43]} /><meshStandardMaterial color={screenColor} emissive={screenColor} emissiveIntensity={0.72} roughness={0.5} /></mesh>
    <mesh position={[0, 0.86, -0.2]}><boxGeometry args={[0.06, 0.26, 0.06]} /><meshStandardMaterial color="#303235" metalness={0.3} roughness={0.55} /></mesh>
  </group>
);

const ArchiveRack = ({ position, rows = 3 }) => (
  <group position={position}>
    <mesh castShadow position={[0, 1.15, 0]}><boxGeometry args={[1.8, 2.3, 0.45]} /><meshStandardMaterial color="#343536" metalness={0.25} roughness={0.62} /></mesh>
    {Array.from({ length: rows }, (_, row) => [-0.48, 0.48].map((x) => (
      <mesh key={`${row}-${x}`} position={[x, 0.45 + row * 0.68, 0.27]}><boxGeometry args={[0.65, 0.42, 0.32]} /><meshStandardMaterial color={row % 2 ? "#6f6250" : "#7d6b54"} roughness={0.88} /></mesh>
    )))}
  </group>
);

const ApprovalGate = ({ worldState, reducedMotion, position }) => {
  const arm = useRef();
  const lamp = useRef();
  useFrame((_, delta) => {
    if (!arm.current) return;
    const approved = worldState.current.currentStep > 5.72;
    const target = approved ? -Math.PI * 0.42 : 0;
    arm.current.rotation.z = reducedMotion ? target : THREE.MathUtils.damp(arm.current.rotation.z, target, 4, delta);
    if (lamp.current) lamp.current.emissiveIntensity = approved ? 2.2 : 1.5;
  });
  return (
    <group position={position}>
      {[-0.7, 0.7].map((x) => <mesh castShadow key={x} position={[x, 1.05, 0]}><boxGeometry args={[0.18, 2.1, 0.35]} /><meshStandardMaterial color="#444443" metalness={0.35} roughness={0.58} /></mesh>)}
      <group ref={arm} position={[-0.62, 1.45, 0.2]}>
        <mesh position={[0.73, 0, 0]}><boxGeometry args={[1.45, 0.12, 0.14]} /><meshStandardMaterial color="#c38a45" roughness={0.62} /></mesh>
      </group>
      <mesh position={[0, 2.18, 0.05]}><boxGeometry args={[0.95, 0.26, 0.2]} /><meshStandardMaterial ref={lamp} color="#d7aa68" emissive="#aa6f2f" emissiveIntensity={1.5} /></mesh>
    </group>
  );
};

const WorkforceFacility = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const floorLight = useRef();
  const routePoints = useMemo(() => [
    [-5.6, 0.04, -0.75],
    [-3.5, 0.04, -0.2],
    [-1.7, 0.04, -0.3],
    [0.35, 0.04, 0.25],
    [2.6, 0.04, -0.2],
    [4.5, 0.04, 0.45],
    [5.8, 0.04, 1.35],
  ], []);

  useFrame(() => {
    if (!group.current) return;
    const step = worldState.current.currentStep;
    const weight = Math.max(stageWeight(step, 5, 1.0), stageWeight(step, 6.2, 0.65));
    group.current.visible = weight > 0.03;
    if (floorLight.current) floorLight.current.opacity = 0.12 + weight * 0.38;
  });

  return (
    <group ref={group} position={[0, -3.65, -1.2]}>
      <mesh receiveShadow position={[0, -0.2, 0]}><boxGeometry args={[16.6, 0.38, 8.3]} /><meshStandardMaterial color="#45433f" roughness={0.94} /></mesh>
      <mesh castShadow receiveShadow position={[0, 1.55, -4.0]}><boxGeometry args={[16.6, 3.4, 0.32]} /><meshStandardMaterial color="#5a5852" roughness={0.9} /></mesh>
      <mesh castShadow position={[-8.15, 1.45, 0]}><boxGeometry args={[0.32, 3.2, 8.0]} /><meshStandardMaterial color="#4b4944" roughness={0.92} /></mesh>
      <mesh castShadow position={[8.15, 1.45, 0]}><boxGeometry args={[0.32, 3.2, 8.0]} /><meshStandardMaterial color="#4b4944" roughness={0.92} /></mesh>
      {[[-6.2, 2.7], [-2.0, 2.7], [2.2, 2.7], [6.2, 2.7]].map(([x, y]) => <mesh key={x} position={[x, y, -3.76]}><boxGeometry args={[2.2, 0.09, 0.06]} /><meshStandardMaterial color="#d8c59b" emissive="#a57c42" emissiveIntensity={0.6} /></mesh>)}
      <Line points={routePoints} color="#717b77" lineWidth={4} transparent opacity={0.5} />
      <Line points={routePoints} color="#5aa8a4" lineWidth={1} transparent opacity={0.32} ref={floorLight} />
      <DeskStation position={[-5.7, 0, -1.5]} screenColor="#315c62" />
      <ArchiveRack position={[-2.7, 0, -2.8]} />
      <ApprovalGate position={[0.35, 0, 0.25]} worldState={worldState} reducedMotion={reducedMotion} />
      <group position={[3.0, 0, -1.7]}>
        <mesh castShadow position={[0, 0.7, 0]}><boxGeometry args={[2.15, 1.4, 1.1]} /><meshStandardMaterial color="#4d4c49" roughness={0.82} /></mesh>
        {[[-0.6, 0.65], [0, 0.65], [0.6, 0.65]].map(([x, z]) => <mesh key={x} position={[x, 0.95, z - 0.48]}><boxGeometry args={[0.44, 0.16, 0.08]} /><meshStandardMaterial color="#776b58" roughness={0.8} /></mesh>)}
        <mesh position={[0, 1.6, 0]}><boxGeometry args={[1.55, 0.22, 0.3]} /><meshStandardMaterial color="#b97b45" emissive="#7b4b25" emissiveIntensity={0.6} /></mesh>
      </group>
      <ArchiveRack position={[5.9, 0, -2.7]} rows={3} />
      <group position={[5.65, 0, 1.55]}>
        <mesh position={[0, 0.72, 0]}><boxGeometry args={[1.7, 1.44, 0.7]} /><meshStandardMaterial color="#3f4544" roughness={0.78} /></mesh>
        <mesh position={[0, 0.9, 0.37]}><planeGeometry args={[1.25, 0.62]} /><meshStandardMaterial color="#314b46" emissive="#315f56" emissiveIntensity={0.55} /></mesh>
      </group>
      <pointLight position={[-5.3, 2.4, -1]} color="#e8c692" intensity={2.4} distance={6} />
      <pointLight position={[0.2, 2.6, 0.6]} color="#e4a75d" intensity={2.8} distance={5} />
      <pointLight position={[5.0, 2.2, 0.8]} color="#89b9b4" intensity={1.7} distance={6} />
      <Html center position={[0, 2.35, -3.72]} distanceFactor={10}><div className="world-location-sign world-location-sign-wall"><span>WORKFORCE OS</span><strong>GOVERNED AI OPERATIONS</strong></div></Html>
      <Html center position={[-5.65, 1.9, -1.45]} distanceFactor={11}><span className="world-station-label">INTAKE</span></Html>
      <Html center position={[-2.7, 2.75, -2.5]} distanceFactor={11}><span className="world-station-label">CONTEXT + MEMORY</span></Html>
      <Html center position={[0.35, 2.75, 0.25]} distanceFactor={11}><span className="world-station-label world-station-label-approval">HUMAN APPROVAL</span></Html>
      <Html center position={[3.0, 2.15, -1.7]} distanceFactor={11}><span className="world-station-label">DISPATCH</span></Html>
      <Html center position={[5.9, 2.75, -2.5]} distanceFactor={11}><span className="world-station-label">AUDIT ARCHIVE</span></Html>
    </group>
  );
};

const BlueprintTable = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.72, 0]}><boxGeometry args={[2.4, 0.12, 1.45]} /><meshStandardMaterial color="#5c4c3e" roughness={0.78} /></mesh>
    {[-0.92, 0.92].map((x) => <mesh castShadow key={x} position={[x, 0.34, 0]}><boxGeometry args={[0.09, 0.72, 1.1]} /><meshStandardMaterial color="#33312e" roughness={0.8} /></mesh>)}
    <mesh position={[0, 0.795, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[2.05, 1.15]} /><meshStandardMaterial color="#385e68" emissive="#284a52" emissiveIntensity={0.42} roughness={0.74} /></mesh>
    {[[-0.52, 0.9], [0.1, 0.55], [0.48, -0.1], [-0.35, -0.5]].map(([x, z], index) => <mesh key={`${x}-${z}`} position={[x, 0.81, z * 0.45]}><boxGeometry args={[0.55 + index * 0.06, 0.012, 0.025]} /><meshStandardMaterial color="#c8dbd9" /></mesh>)}
  </group>
);

const AssemblyBench = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 0.78, 0]}><boxGeometry args={[2.6, 0.16, 1.2]} /><meshStandardMaterial color="#4f463c" roughness={0.78} /></mesh>
    {[-1, 1].map((x) => <mesh castShadow key={x} position={[x, 0.38, 0]}><boxGeometry args={[0.1, 0.78, 0.92]} /><meshStandardMaterial color="#2f3030" metalness={0.2} roughness={0.66} /></mesh>)}
    {[-0.72, -0.24, 0.24, 0.72].map((x, index) => <mesh castShadow key={x} position={[x, 1.03, index % 2 ? 0.18 : -0.14]}><boxGeometry args={[0.33, 0.18, 0.45]} /><meshStandardMaterial color={index % 2 ? "#6d665c" : "#485c5b"} roughness={0.72} metalness={0.08} /></mesh>)}
    <mesh position={[0, 1.55, -0.45]}><boxGeometry args={[2.2, 1.15, 0.12]} /><meshStandardMaterial color="#3a3733" roughness={0.72} /></mesh>
    {[-0.7, 0, 0.7].map((x) => <mesh key={x} position={[x, 1.6, -0.37]}><boxGeometry args={[0.08, 0.52, 0.04]} /><meshStandardMaterial color="#b58a58" metalness={0.22} roughness={0.52} /></mesh>)}
  </group>
);

const TestChamber = ({ position }) => (
  <group position={position}>
    <mesh castShadow position={[0, 1.2, -0.55]}><boxGeometry args={[2.4, 2.4, 0.12]} /><meshStandardMaterial color="#3b3d3d" roughness={0.66} /></mesh>
    {[-1.12, 1.12].map((x) => <mesh castShadow key={x} position={[x, 1.2, 0]}><boxGeometry args={[0.12, 2.4, 1.25]} /><meshStandardMaterial color="#343536" metalness={0.28} roughness={0.58} /></mesh>)}
    <mesh position={[0, 1.15, 0]}><boxGeometry args={[2.1, 2.0, 1.05]} /><meshPhysicalMaterial color="#8aa1a0" transparent opacity={0.18} roughness={0.18} transmission={0.45} thickness={0.2} /></mesh>
    <pointLight position={[0, 1.4, 0]} color="#77aaa6" intensity={1.8} distance={3} />
  </group>
);

const DeploymentBay = ({ position, worldState }) => {
  const lamp = useRef();
  useFrame(() => {
    if (!lamp.current) return;
    const active = worldState.current.currentStep > 6.15;
    lamp.current.emissiveIntensity = active ? 2.8 : 0.45;
  });
  return (
    <group position={position}>
      {[-1.2, 1.2].map((x) => <mesh castShadow key={x} position={[x, 1.45, 0]}><boxGeometry args={[0.22, 2.9, 0.4]} /><meshStandardMaterial color="#373736" metalness={0.28} roughness={0.58} /></mesh>)}
      <mesh castShadow position={[0, 2.85, 0]}><boxGeometry args={[2.65, 0.22, 0.4]} /><meshStandardMaterial color="#373736" metalness={0.28} roughness={0.58} /></mesh>
      <mesh position={[0, 2.55, 0.1]}><boxGeometry args={[1.2, 0.2, 0.12]} /><meshStandardMaterial ref={lamp} color="#7da889" emissive="#3d7650" emissiveIntensity={0.45} /></mesh>
    </group>
  );
};

const CapabilityCartridge = ({ worldState, reducedMotion }) => {
  const cartridge = useRef();
  const led = useRef();
  const positions = useMemo(() => [
    new THREE.Vector3(-5.4, 0.98, 0),
    new THREE.Vector3(-1.8, 1.08, 0),
    new THREE.Vector3(2.0, 1.2, 0),
    new THREE.Vector3(5.5, 1.45, 0),
  ], []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    if (!cartridge.current) return;
    const step = worldState.current.currentStep;
    cartridge.current.visible = step > 5.45 && step < 7.05;
    const local = clamp01((step - 5.55) / 0.95) * 3;
    const index = Math.min(2, Math.floor(local));
    const progress = local - index;
    target.copy(positions[index]).lerp(positions[index + 1], THREE.MathUtils.smoothstep(progress, 0, 1));
    cartridge.current.position.copy(target);
    cartridge.current.rotation.y = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.45) * 0.08;
    if (led.current) led.current.emissiveIntensity = 0.6 + local * 0.55;
  });

  return (
    <group ref={cartridge}>
      <mesh castShadow><boxGeometry args={[0.72, 0.38, 0.52]} /><meshStandardMaterial color="#555c5a" metalness={0.38} roughness={0.46} /></mesh>
      <mesh position={[0.22, 0.06, 0.27]}><boxGeometry args={[0.18, 0.08, 0.025]} /><meshStandardMaterial ref={led} color="#9fc8b0" emissive="#4f8b67" emissiveIntensity={0.6} /></mesh>
      <mesh position={[-0.22, 0.06, 0.27]}><boxGeometry args={[0.18, 0.08, 0.025]} /><meshStandardMaterial color="#9e9382" roughness={0.7} /></mesh>
    </group>
  );
};

const BaselineWorkshop = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const routeLight = useRef();
  const routePoints = useMemo(() => [[-5.4, 0.04, 0], [-1.8, 0.04, 0], [2.0, 0.04, 0], [5.5, 0.04, 0]], []);

  useFrame(() => {
    if (!group.current) return;
    const weight = stageWeight(worldState.current.currentStep, 6, 0.95);
    group.current.visible = weight > 0.03;
    if (routeLight.current) routeLight.current.opacity = 0.12 + weight * 0.28;
  });

  return (
    <group ref={group} position={[0, -7.0, -1.2]}>
      <mesh receiveShadow position={[0, -0.2, 0]}><boxGeometry args={[17.8, 0.38, 8.8]} /><meshStandardMaterial color="#4b4239" roughness={0.92} /></mesh>
      <mesh castShadow receiveShadow position={[0, 1.7, -4.25]}><boxGeometry args={[17.8, 3.8, 0.34]} /><meshStandardMaterial color="#654f3e" roughness={0.92} /></mesh>
      <mesh castShadow position={[-8.7, 1.55, 0]}><boxGeometry args={[0.34, 3.5, 8.5]} /><meshStandardMaterial color="#51473d" roughness={0.9} /></mesh>
      <mesh castShadow position={[8.7, 1.55, 0]}><boxGeometry args={[0.34, 3.5, 8.5]} /><meshStandardMaterial color="#51473d" roughness={0.9} /></mesh>
      {[-6.2, -2.1, 2.0, 6.1].map((x) => <group key={x} position={[x, 3.0, -1]}><mesh><cylinderGeometry args={[0.13, 0.13, 0.22, 12]} /><meshStandardMaterial color="#5d554c" /></mesh><pointLight position={[0, -0.35, 0]} color="#ffc987" intensity={2.2} distance={5} /></group>)}
      <Line points={routePoints} color="#766c60" lineWidth={4} transparent opacity={0.48} />
      <Line points={routePoints} color="#6e9890" lineWidth={1} transparent opacity={0.22} ref={routeLight} />
      <BlueprintTable position={[-5.4, 0, 0]} />
      <AssemblyBench position={[-1.8, 0, 0]} />
      <TestChamber position={[2.0, 0, 0]} />
      <DeploymentBay position={[5.5, 0, 0]} worldState={worldState} />
      <CapabilityCartridge worldState={worldState} reducedMotion={reducedMotion} />
      <ArchiveRack position={[-6.6, 0, -2.9]} rows={2} />
      <group position={[-0.4, 0, -3.1]}>{[-1.1, 0, 1.1].map((x, index) => <mesh key={x} position={[x, 1.0, 0]}><boxGeometry args={[0.9, 1.8, 0.55]} /><meshStandardMaterial color={index === 1 ? "#475856" : "#4a4540"} metalness={0.12} roughness={0.75} /></mesh>)}</group>
      <Html center position={[0, 2.65, -4.0]} distanceFactor={10}><div className="world-location-sign world-location-sign-wall world-location-sign-workshop"><span>BASELINE STUDIOS / ARKITECH</span><strong>CAPABILITY WORKSHOP</strong></div></Html>
      <Html center position={[-5.4, 1.65, 0]} distanceFactor={11}><span className="world-station-label">SPEC KIT</span></Html>
      <Html center position={[-1.8, 2.25, 0]} distanceFactor={11}><span className="world-station-label">ASSEMBLE</span></Html>
      <Html center position={[2.0, 2.75, 0]} distanceFactor={11}><span className="world-station-label">TEST</span></Html>
      <Html center position={[5.5, 3.35, 0]} distanceFactor={11}><span className="world-station-label world-station-label-deploy">DEPLOY</span></Html>
    </group>
  );
};

const ResolutionState = ({ worldState, reducedMotion }) => {
  const group = useRef();
  const light = useRef();
  useFrame(({ clock }) => {
    if (!group.current) return;
    const visible = worldState.current.currentStep > 10.2;
    group.current.visible = visible;
    if (light.current && visible && !reducedMotion) light.current.intensity = 2.4 + Math.sin(clock.elapsedTime * 1.4) * 0.25;
  });

  return (
    <group ref={group} position={[0, 0, 0]}>
      <pointLight ref={light} position={[-1.5, 2.1, 2.7]} color="#79c997" intensity={2.4} distance={5} />
      <Html center position={[0, 4.9, 0]} distanceFactor={10}><div className="world-location-sign world-location-sign-resolved"><span>UNIT 204</span><strong>WORK COMPLETE · EVIDENCE RETAINED</strong></div></Html>
    </group>
  );
};

const Neighborhood = ({ worldState, terrainMaterial, reducedMotion, isMobile }) => (
  <group>
    <mesh receiveShadow position={[0, -0.48, -2]}><boxGeometry args={[30, 0.9, 22]} /><meshStandardMaterial ref={terrainMaterial} color="#223626" transparent roughness={0.99} /></mesh>
    <mesh receiveShadow position={[0, 0.015, 5.9]}><boxGeometry args={[30, 0.08, 3.6]} /><meshStandardMaterial color="#252729" roughness={0.96} /></mesh>
    <mesh receiveShadow position={[0, 0.07, 4.05]}><boxGeometry args={[30, 0.06, 0.42]} /><meshStandardMaterial color="#8d8b82" roughness={0.97} /></mesh>
    <mesh receiveShadow position={[0, 0.07, 7.75]}><boxGeometry args={[30, 0.06, 0.42]} /><meshStandardMaterial color="#8d8b82" roughness={0.97} /></mesh>
    <mesh position={[0, 0.065, 5.9]}><boxGeometry args={[30, 0.012, 0.04]} /><meshBasicMaterial color="#cbbd8f" transparent opacity={0.32} /></mesh>

    <House position={[0, 0, 0]} missionHouse worldState={worldState} reducedMotion={reducedMotion} />
    <ArrivalSign worldState={worldState} />
    <House position={[4.7, 0, -4.2]} scale={0.86} wallColor="#9a826a" roofColor="#3d322b" visionHouse worldState={worldState} reducedMotion={reducedMotion} />
    {!isMobile && (
      <>
        <House position={[-6.6, 0, -5.1]} scale={0.64} wallColor="#6d766b" worldState={worldState} reducedMotion={reducedMotion} />
        <House position={[9.2, 0, 0.3]} scale={0.58} wallColor="#766758" worldState={worldState} reducedMotion={reducedMotion} />
        <House position={[-10.4, 0, 0.2]} scale={0.54} wallColor="#827463" worldState={worldState} reducedMotion={reducedMotion} />
      </>
    )}

    {[[-6.1, 0, 1.2], [6.5, 0, 1.4], [-3.6, 0, -6.9], [8.1, 0, -6.3], [-11.2, 0, -6.2]].slice(0, isMobile ? 3 : 5).map((position, index) => <Tree key={position.join("-")} position={position} scale={0.72 + index * 0.05} reducedMotion={reducedMotion} />)}
    {[[-10, 0, 4.2], [-5, 0, 7.65], [0, 0, 4.2], [5, 0, 7.65], [10, 0, 4.2]].slice(0, isMobile ? 3 : 5).map((position) => <StreetLight key={position.join("-")} position={position} />)}

    <OperationsHub worldState={worldState} reducedMotion={reducedMotion} />
    <ServiceVan worldState={worldState} reducedMotion={reducedMotion} />
    <VoiceEvent worldState={worldState} reducedMotion={reducedMotion} />
    <VisionInspection worldState={worldState} reducedMotion={reducedMotion} />
    <RepairEstimate worldState={worldState} />
    <MissionDocument worldState={worldState} reducedMotion={reducedMotion} />
    <WorkforceFacility worldState={worldState} reducedMotion={reducedMotion} />
    <BaselineWorkshop worldState={worldState} reducedMotion={reducedMotion} />
    <ResolutionState worldState={worldState} reducedMotion={reducedMotion} />
  </group>
);

const PersistentWorldSceneV2 = ({ worldState, isMobile, reducedMotion }) => {
  const world = useRef();
  const terrainMaterial = useRef();
  const moon = useRef();
  const ambient = useRef();
  const warmKey = useRef();
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
    const workforceWeight = stageWeight(step, 5, 1.0);
    const baselineWeight = stageWeight(step, 6, 0.95);
    const undergroundWeight = Math.max(workforceWeight, baselineWeight);

    if (terrainMaterial.current) terrainMaterial.current.opacity = THREE.MathUtils.lerp(1, 0.38, undergroundWeight);
    if (moon.current) moon.current.intensity = THREE.MathUtils.lerp(0.45, 2.7, reveal.current);
    if (ambient.current) ambient.current.intensity = THREE.MathUtils.lerp(0.04, 0.28, reveal.current);
    if (warmKey.current) warmKey.current.intensity = THREE.MathUtils.lerp(6.5, 3.4, undergroundWeight);
    if (!builderLoaded && step > 6.35) setBuilderLoaded(true);
  });

  return (
    <>
      <color attach="background" args={["#090b0d"]} />
      <fog attach="fog" args={["#0d1112", isMobile ? 18 : 23, isMobile ? 46 : 60]} />
      <ambientLight ref={ambient} intensity={0.04} color="#9aaab1" />
      <hemisphereLight color="#8ea0aa" groundColor="#24261f" intensity={0.34} />
      <directionalLight ref={moon} castShadow={!isMobile} position={[11, 15, 10]} intensity={0.45} color="#a6b7c2" shadow-mapSize-width={isMobile ? 512 : 1024} shadow-mapSize-height={isMobile ? 512 : 1024} />
      <pointLight ref={warmKey} position={[0, 6.5, 1]} color="#ffb66c" intensity={6.5} distance={14} />
      <pointLight position={[4.7, 5.4, -4.2]} color="#ffc181" intensity={4.5} distance={10} />
      <CameraRig worldState={worldState} reducedMotion={reducedMotion} isMobile={isMobile} />
      <NightAtmosphere isMobile={isMobile} reducedMotion={reducedMotion} />
      <group ref={world} scale={0.92} position={[0, -0.35, 0]}>
        <Neighborhood worldState={worldState} terrainMaterial={terrainMaterial} reducedMotion={reducedMotion} isMobile={isMobile} />
        {builderLoaded && <BuilderStudio worldState={worldState} reducedMotion={reducedMotion} isMobile={isMobile} />}
      </group>
    </>
  );
};

export default PersistentWorldSceneV2;
