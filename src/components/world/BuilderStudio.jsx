import { Float, Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import Computer from "../models/contact/Computer";
import { Room } from "../models/hero_models/Room";
import { techStackIcons } from "../../constants";

const TechRelic = ({ model, position, reducedMotion }) => {
  const group = useRef();
  const { scene } = useGLTF(model.modelPath);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.16 : 1;
    const scale = reducedMotion ? target : THREE.MathUtils.damp(group.current.scale.x, target, 5.5, delta);
    group.current.scale.setScalar(scale);
    if (!reducedMotion) group.current.rotation.y += delta * (hovered ? 0.65 : 0.12);
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <Float speed={reducedMotion ? 0 : 1.2} rotationIntensity={reducedMotion ? 0 : 0.08} floatIntensity={reducedMotion ? 0 : 0.18}>
        <group scale={model.scale} rotation={model.rotation}><primitive object={clonedScene} /></group>
      </Float>
      <mesh position={[0, -1.05, 0]}>
        <cylinderGeometry args={[0.82, 0.98, 0.18, 32]} />
        <meshStandardMaterial color="#202326" metalness={0.58} roughness={0.38} />
      </mesh>
      <mesh position={[0, -0.94, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.66, 0.71, 48]} />
        <meshBasicMaterial color={hovered ? "#d8fbff" : "#45d9ed"} transparent opacity={hovered ? 0.9 : 0.34} />
      </mesh>
      <Html center position={[0, -1.35, 0]} distanceFactor={10}><span className="world-object-label">{model.name}</span></Html>
      <pointLight color={hovered ? "#88f4ff" : "#2a5665"} intensity={hovered ? 3.4 : 0.65} distance={3.5} />
    </group>
  );
};

const BuilderStudio = ({ worldState, reducedMotion, isMobile }) => {
  const builderLabel = useRef();
  const contactLabel = useRef();
  const signal = useRef();
  const techPositions = [[-4.5, 2.2, -15.4], [-2.35, 3.2, -15.8], [0.1, 3.55, -15.3], [2.5, 3.05, -15.7], [4.65, 2.15, -15.4]];

  useFrame(({ clock }) => {
    const step = worldState.current.currentStep;
    if (builderLabel.current) builderLabel.current.visible = step > 4.45 && step < 6.35;
    if (contactLabel.current) contactLabel.current.visible = step > 6.55;
    if (signal.current && !reducedMotion) signal.current.rotation.z = clock.elapsedTime * 0.18;
  });

  return (
    <group>
      <mesh receiveShadow position={[0, -0.58, -18]}>
        <boxGeometry args={[17, 0.34, 11]} />
        <meshStandardMaterial color="#25272a" metalness={0.12} roughness={0.82} />
      </mesh>
      <mesh position={[0, -0.38, -18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[16.5, 10.5]} />
        <meshStandardMaterial color="#313336" roughness={0.88} />
      </mesh>
      {!isMobile && <group position={[0, -0.42, -18.8]} rotation={[0, -0.08, 0]} scale={0.62}><Room enableEffects={false} /></group>}
      <pointLight position={[0, 4, -15]} color="#ffbd78" intensity={10} distance={13} />
      <pointLight position={[3, 6, -14]} color="#78e9ff" intensity={7} distance={16} />
      {!isMobile && techStackIcons.map((model, index) => <TechRelic key={model.name} model={model} position={techPositions[index]} reducedMotion={reducedMotion} />)}
      {isMobile && techStackIcons.slice(0, 3).map((model, index) => <TechRelic key={model.name} model={model} position={techPositions[index + 1]} reducedMotion={reducedMotion} />)}
      <group position={[-6.4, -1.45, -18]} scale={0.034}><Computer /></group>
      <group ref={signal} position={[-6.4, 0.05, -17.6]}>
        {[0, 1, 2].map((ring) => (
          <mesh key={ring} rotation={[Math.PI / 2, 0, 0]} scale={1 + ring * 0.5}>
            <torusGeometry args={[1.15, 0.014, 8, 64]} />
            <meshBasicMaterial color={ring === 1 ? "#7f73ff" : "#56e8f7"} transparent opacity={0.62 - ring * 0.15} />
          </mesh>
        ))}
      </group>
      <group ref={builderLabel}>
        <Html center position={[0, 5.4, -16]} distanceFactor={11}><div className="world-title-label"><span>THE BUILDER&apos;S STUDIO</span><strong>THE TOOLS BEHIND THE WORLD</strong></div></Html>
      </group>
      <group ref={contactLabel}>
        <Html center position={[-6.4, 2.65, -17.2]} distanceFactor={9}><div className="world-title-label"><span>CONTACT WORKSTATION</span><strong>LET&apos;S BUILD SOMETHING USEFUL.</strong></div></Html>
      </group>
    </group>
  );
};

export default BuilderStudio;
