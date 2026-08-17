import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import PersistentWorldScene from "./PersistentWorldScene";

const PersistentWorldExperience = ({ worldState }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const [pageVisible, setPageVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return (
    <div className="persistent-world" aria-hidden="true">
      <Canvas
        dpr={isMobile ? 1 : [1, 1.4]}
        frameloop={pageVisible ? "always" : "never"}
        shadows={!isMobile}
        camera={{ position: [15.5, 8.2, 20.5], fov: 42, near: 0.1, far: 90 }}
        gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
        fallback={<div className="world-webgl-fallback"><span>3D WORLD</span><strong>REAL ESTATE × AI</strong></div>}
      >
        <Suspense fallback={null}>
          <PersistentWorldScene worldState={worldState} isMobile={isMobile} reducedMotion={reducedMotion} />
        </Suspense>
      </Canvas>
      <div className="world-vignette" />
      <div className="world-grain" />
    </div>
  );
};

export default PersistentWorldExperience;
