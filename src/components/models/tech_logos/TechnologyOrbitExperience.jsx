import { Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import * as THREE from "three";

import { techStackIcons } from "../../../constants";
import useCanvasVisibility from "../../../hooks/useCanvasVisibility";

const orbitPositions = [
  [0, 2.25, 0],
  [-3.25, 0.55, 0.15],
  [3.25, 0.55, 0.15],
  [-2.15, -1.85, 0.35],
  [2.15, -1.85, 0.35],
];

const OrbitModel = ({ model, position, reducedMotion }) => {
  const group = useRef();
  const { scene } = useGLTF(model.modelPath);
  const [hovered, setHovered] = useState(false);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useEffect(() => {
    clonedScene.traverse((child) => {
      if (!child.isMesh) return;
      child.material = child.material.clone();
      if (model.name === "Three.js" && child.name === "Object_5") {
        child.material = new THREE.MeshStandardMaterial({ color: "#eefcff", metalness: 0.08, roughness: 0.35 });
      }
    });
  }, [clonedScene, model.name]);

  useFrame(({ clock }, delta) => {
    if (!group.current) return;
    const target = hovered ? 1.16 : 1;
    const scale = THREE.MathUtils.damp(group.current.scale.x, target, 5.5, delta);
    group.current.scale.setScalar(scale);
    if (!reducedMotion) group.current.rotation.y += delta * (hovered ? 0.72 : 0.2);
    group.current.position.y = position[1] + (reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.7 + position[0]) * 0.09);
  });

  return (
    <group
      ref={group}
      position={position}
      onPointerEnter={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerLeave={() => setHovered(false)}
    >
      <Float speed={reducedMotion ? 0 : 1.7} rotationIntensity={reducedMotion ? 0 : 0.12} floatIntensity={reducedMotion ? 0 : 0.25}>
        <group scale={model.scale} rotation={model.rotation}>
          <primitive object={clonedScene} />
        </group>
      </Float>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={hovered ? 1.15 : 1}>
        <torusGeometry args={[0.84, 0.012, 8, 64]} />
        <meshBasicMaterial color={hovered ? "#d0fbff" : "#4adff1"} transparent opacity={hovered ? 0.9 : 0.35} />
      </mesh>
      <pointLight color={hovered ? "#9cf6ff" : "#335b72"} intensity={hovered ? 3.4 : 0.8} distance={3.5} />
    </group>
  );
};

const OrbitLines = ({ reducedMotion }) => {
  const orbit = useRef();
  useFrame((_, delta) => {
    if (orbit.current && !reducedMotion) orbit.current.rotation.z += delta * 0.025;
  });

  return (
    <group ref={orbit}>
      <mesh rotation={[Math.PI / 2.15, 0, 0.2]} scale={[1.25, 0.72, 1]}>
        <torusGeometry args={[3.8, 0.008, 8, 96]} />
        <meshBasicMaterial color="#4addf2" transparent opacity={0.28} />
      </mesh>
      <mesh rotation={[Math.PI / 2.05, 0.55, -0.32]} scale={[1, 0.68, 1]}>
        <torusGeometry args={[3.55, 0.008, 8, 96]} />
        <meshBasicMaterial color="#7d72ff" transparent opacity={0.23} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#d8fbff" emissive="#45dff5" emissiveIntensity={3.4} metalness={0.2} roughness={0.3} />
      </mesh>
    </group>
  );
};

const TechnologyOrbitExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const { containerRef, isVisible, shouldRender } = useCanvasVisibility("240px");

  return (
    <div ref={containerRef} className="canvas-shell" aria-hidden="true">
      {shouldRender && (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.4]}
          frameloop={isVisible ? "always" : "never"}
          camera={{ position: [0, 0.4, isMobile ? 11.5 : 9.7], fov: isMobile ? 52 : 45 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={["#03080d", 10, 19]} />
          <ambientLight intensity={0.42} color="#b5efff" />
          <directionalLight position={[5, 6, 5]} intensity={2.1} color="#8defff" />
          <directionalLight position={[-4, -1, 3]} intensity={1.4} color="#786fff" />
          <pointLight position={[0, 0, 3]} intensity={5} color="#47dff4" distance={9} />
          {!isMobile && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={!reducedMotion}
              rotateSpeed={0.24}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.7}
              enableDamping
            />
          )}
          <Suspense fallback={null}>
            <OrbitLines reducedMotion={reducedMotion} />
            {techStackIcons.map((model, index) => (
              <OrbitModel
                key={model.name}
                model={model}
                position={isMobile ? orbitPositions[index].map((value) => value * 0.82) : orbitPositions[index]}
                reducedMotion={reducedMotion}
              />
            ))}
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

techStackIcons.forEach((model) => useGLTF.preload(model.modelPath));

export default TechnologyOrbitExperience;
