import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";

import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { Suspense } from "react";
import PropertyWorld from "../property/PropertyWorld";
import useCanvasVisibility from "../../../hooks/useCanvasVisibility";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const { containerRef, isVisible, shouldRender } = useCanvasVisibility("100px");

  return (
    <div ref={containerRef} className="canvas-shell" aria-hidden="true">
      {shouldRender && (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.5]}
          frameloop={isVisible ? "always" : "never"}
          shadows={!isMobile}
          camera={{ position: isMobile ? [8.4, 5.8, 13.6] : [8.6, 5.2, 10.8], fov: isMobile ? 48 : 42 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={["#03080d", 12, 24]} />
          <ambientLight intensity={0.18} color="#173849" />
          {!isMobile && (
            <OrbitControls
              target={[0, 1.15, 0]}
              enablePan={false}
              enableZoom={!isTablet}
              enableRotate={!reducedMotion}
              rotateSpeed={0.22}
              enableDamping
              dampingFactor={0.08}
              minDistance={8}
              maxDistance={16}
              minPolarAngle={Math.PI / 4.5}
              maxPolarAngle={Math.PI / 2.25}
              minAzimuthAngle={-Math.PI / 3.4}
              maxAzimuthAngle={Math.PI / 3.4}
            />
          )}
          <Suspense fallback={null}>
            <HeroLights />
            <Particles count={isMobile ? 24 : 68} reducedMotion={reducedMotion} />
            <PropertyWorld stage={0} mode="hero" isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default HeroExperience;
