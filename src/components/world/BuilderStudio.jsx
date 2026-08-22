import { Html, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import Computer from "../models/contact/Computer";
import { Room } from "../models/hero_models/Room";
import { techStackIcons } from "../../constants";

const TechObject = ({ model, position, reducedMotion }) => {
  const group = useRef();
  const { scene } = useGLTF(model.modelPath);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.08 : 1;
    const scale = reducedMotion ? target : THREE.MathUtils.damp(group.current.scale.x, target, 5, delta);
    group.current.scale.setScalar(scale);
    if (!reducedMotion && hovered) group.current.rotation.y += delta * 0.35;
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <group scale={model.scale} rotation={model.rotation}><primitive object={clonedScene} /></group>
      <mesh castShadow position={[0, -0.9, 0]}><boxGeometry args={[1.4, 0.11, 1.05]} /><meshStandardMaterial color="#4b4238" roughness={0.78} /></mesh>
      <Html center position={[0, -1.17, 0]} distanceFactor={10}><span className="world-station-label">{model.name}</span></Html>
    </group>
  );
};

const BuilderStudio = ({ worldState, reducedMotion, isMobile }) => {
  const builderLabel = useRef();
  const contactLabel = useRef();
  const deskLight = useRef();
  const techPositions = [[-4.4, 2.0, -15.45], [-2.2, 2.2, -15.45], [0, 2.3, -15.45], [2.2, 2.2, -15.45], [4.4, 2.0, -15.45]];

  useFrame(() => {
    const step = worldState.current.currentStep;
    if (builderLabel.current) builderLabel.current.visible = step > 6.65 && step < 9.35;
    if (contactLabel.current) contactLabel.current.visible = step > 9.65;
    if (deskLight.current) deskLight.current.intensity = step > 9.5 ? 5.5 : 2.8;
  });

  const visibleModels = isMobile ? techStackIcons.slice(0, 3) : techStackIcons;
  const offset = isMobile ? 1 : 0;

  return (
    <group>
      <mesh receiveShadow position={[0, -0.58, -18]}><boxGeometry args={[17, 0.34, 11]} /><meshStandardMaterial color="#2c2a27" metalness={0.06} roughness={0.9} /></mesh>
      <mesh position={[0, -0.38, -18]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[16.5, 10.5]} /><meshStandardMaterial color="#38342f" roughness={0.92} /></mesh>
      {!isMobile && <group position={[0, -0.42, -18.8]} rotation={[0, -0.08, 0]} scale={0.62}><Room enableEffects={false} /></group>}

      <group position={[0, 0, -15.7]}>
        <mesh castShadow position={[0, 1.15, -0.65]}><boxGeometry args={[12.2, 2.7, 0.25]} /><meshStandardMaterial color="#4d4339" roughness={0.9} /></mesh>
        <mesh castShadow position={[0, 0.72, -0.35]}><boxGeometry args={[11.5, 0.12, 1.2]} /><meshStandardMaterial color="#6b5744" roughness={0.82} /></mesh>
        <mesh castShadow position={[0, 2.35, -0.35]}><boxGeometry args={[11.5, 0.12, 1.2]} /><meshStandardMaterial color="#6b5744" roughness={0.82} /></mesh>
        {[-5.3, -2.65, 0, 2.65, 5.3].map((x) => <mesh key={x} castShadow position={[x, 1.55, -0.4]}><boxGeometry args={[0.09, 1.65, 1.05]} /><meshStandardMaterial color="#36322e" metalness={0.08} roughness={0.74} /></mesh>)}
      </group>

      <pointLight position={[0, 4, -15]} color="#ffc78a" intensity={7.5} distance={12} />
      <pointLight ref={deskLight} position={[-5.2, 2.5, -17]} color="#e6b878" intensity={2.8} distance={8} />
      <pointLight position={[3.5, 4.2, -17]} color="#8faeaa" intensity={2.2} distance={10} />

      {visibleModels.map((model, index) => <TechObject key={model.name} model={model} position={techPositions[index + offset]} reducedMotion={reducedMotion} />)}

      <group position={[-5.0, -1.45, -18]} scale={0.034}><Computer /></group>
      <group position={[-5.0, 0.05, -17.25]}>
        <mesh castShadow position={[0, -0.42, 0]}><boxGeometry args={[3.2, 0.16, 1.55]} /><meshStandardMaterial color="#4b4036" roughness={0.8} /></mesh>
        <mesh position={[1.18, -0.15, 0.2]}><boxGeometry args={[0.32, 0.12, 0.24]} /><meshStandardMaterial color="#746652" roughness={0.82} /></mesh>
        <mesh position={[1.55, -0.15, -0.12]}><boxGeometry args={[0.18, 0.42, 0.18]} /><meshStandardMaterial color="#46534b" roughness={0.76} /></mesh>
      </group>

      <group ref={builderLabel}>
        <Html center position={[0, 5.3, -16]} distanceFactor={11}><div className="world-location-sign world-location-sign-wall"><span>BUILDER STUDIO</span><strong>THE TOOLS BEHIND THE WORLD</strong></div></Html>
      </group>
      <group ref={contactLabel}>
        <Html center position={[-5.0, 2.9, -17.2]} distanceFactor={9}><div className="world-location-sign"><span>CONTACT</span><strong>LET&apos;S BUILD SOMETHING USEFUL.</strong></div></Html>
      </group>
    </group>
  );
};

export default BuilderStudio;
