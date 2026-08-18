import { Grid, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import * as THREE from "three";

import useCanvasVisibility from "../../../hooks/useCanvasVisibility";
import Computer from "./Computer";

const ContactSignal = ({ reducedMotion }) => {
  const signal = useRef();
  const pulse = useRef();

  useFrame(({ clock }) => {
    if (!signal.current || reducedMotion) return;
    signal.current.rotation.y = clock.elapsedTime * 0.22;
    if (pulse.current) {
      const scale = 1 + Math.sin(clock.elapsedTime * 2.4) * 0.16;
      pulse.current.scale.setScalar(scale);
    }
  });

  return (
    <group ref={signal} position={[0, -0.18, -0.15]}>
      {[0, 1, 2].map((ring) => (
        <mesh key={ring} rotation={[Math.PI / 2, 0, 0]} scale={1 + ring * 0.5}>
          <torusGeometry args={[1.25, 0.014, 8, 72]} />
          <meshBasicMaterial color={ring === 1 ? "#7d72ff" : "#55eaff"} transparent opacity={0.65 - ring * 0.16} />
        </mesh>
      ))}
      <mesh ref={pulse} position={[0, 1.45, -0.45]}>
        <octahedronGeometry args={[0.13, 0]} />
        <meshStandardMaterial color="#e5fcff" emissive="#58eaff" emissiveIntensity={4} />
      </mesh>
      <mesh position={[0, 0.72, -0.45]}>
        <cylinderGeometry args={[0.014, 0.014, 1.5, 8]} />
        <meshBasicMaterial color="#54e8ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};

const ContactExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const { containerRef, isVisible, shouldRender } = useCanvasVisibility("240px");

  return (
    <div ref={containerRef} className="canvas-shell" aria-hidden="true">
      {shouldRender && (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.4]}
          frameloop={isVisible ? "always" : "never"}
          shadows={!isMobile}
          camera={{ position: [0, 2.55, isMobile ? 8.7 : 7.5], fov: 43 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={["#03080d", 8, 17]} />
          <ambientLight intensity={0.34} color="#b8f8ff" />
          <directionalLight position={[5, 7, 4]} intensity={2.4} color="#83efff" />
          <directionalLight position={[-4, 5, -2]} castShadow={!isMobile} intensity={1.8} color="#7468ff" />
          <spotLight position={[0, 7, 2]} angle={0.42} penumbra={0.9} intensity={24} color="#4fdff4" />

          {!isMobile && (
            <OrbitControls
              target={[0, 0.25, -0.5]}
              enableZoom={false}
              enablePan={false}
              enableRotate={!reducedMotion}
              rotateSpeed={0.22}
              minPolarAngle={Math.PI / 4.2}
              maxPolarAngle={Math.PI / 2.25}
              minAzimuthAngle={-Math.PI / 4}
              maxAzimuthAngle={Math.PI / 4}
              enableDamping
            />
          )}

          <Suspense fallback={null}>
            <mesh receiveShadow position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <planeGeometry args={[30, 30]} />
              <meshStandardMaterial color="#06151f" metalness={0.18} roughness={0.78} />
            </mesh>
            <Grid
              position={[0, -1.48, 0]}
              args={[18, 18]}
              cellSize={0.75}
              cellThickness={0.42}
              cellColor="#174b5c"
              sectionSize={3}
              sectionThickness={0.72}
              sectionColor="#2e8ca3"
              fadeDistance={13}
              fadeStrength={1.3}
              infiniteGrid
            />
            <group scale={0.034} position={[0, -1.49, -2]} castShadow>
              <Computer />
            </group>
            <ContactSignal reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default ContactExperience;
