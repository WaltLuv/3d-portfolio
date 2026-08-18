import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { useMediaQuery } from "react-responsive";

import useCanvasVisibility from "../../../hooks/useCanvasVisibility";
import HeroLights from "../hero_models/HeroLights";
import Particles from "../hero_models/Particles";
import PropertyWorld from "./PropertyWorld";

const SystemsWorldExperience = ({ stage }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const { containerRef, isVisible, shouldRender } = useCanvasVisibility("280px");

  return (
    <div ref={containerRef} className="canvas-shell" aria-hidden="true">
      {shouldRender && (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.35]}
          frameloop={isVisible ? "always" : "never"}
          shadows={!isMobile}
          camera={{ position: isMobile ? [8.7, 6.2, 14.8] : [7.1, 4.3, 9.2], fov: isMobile ? 50 : 42 }}
          gl={{ antialias: !isMobile, alpha: true, powerPreference: "high-performance" }}
        >
          <fog attach="fog" args={["#03080d", 11, 25]} />
          <ambientLight intensity={0.16} color="#14394b" />
          <Suspense fallback={null}>
            <HeroLights />
            <Particles count={isMobile ? 20 : 52} reducedMotion={reducedMotion} />
            <PropertyWorld stage={stage} mode="story" isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      )}
    </div>
  );
};

export default SystemsWorldExperience;
