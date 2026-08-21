import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import PersistentWorldSceneV2 from "./PersistentWorldSceneV2";
import { journeyChapters } from "./worldData";

const WorldFallback = ({ checking = false, activeStep = 0 }) => {
  const chapter = journeyChapters[activeStep] || journeyChapters[0];

  return (
    <div className={`world-webgl-fallback world-webgl-fallback-v2 ${checking ? "world-webgl-checking" : ""}`} data-fallback-step={activeStep}>
      <div className="fallback-cinematic-scene" aria-hidden="true">
        <span className="fallback-horizon" />
        <span className="fallback-road-perspective" />
        <span className="fallback-house fallback-house-primary"><i /><i /><i /></span>
        <span className="fallback-house fallback-house-secondary"><i /><i /></span>
        <span className="fallback-streetlight fallback-streetlight-a" />
        <span className="fallback-streetlight fallback-streetlight-b" />
        <span className="fallback-window-glow" />
        <span className="fallback-ai-thread" />
      </div>
      <div className="fallback-editorial-copy">
        <span>{checking ? "ENTERING WALTER'S WORLD" : `CHAPTER ${String(activeStep + 1).padStart(2, "0")}`}</span>
        <strong>{chapter.label}</strong>
        <p>{chapter.mission}</p>
        {!checking && <small>3D is unavailable in this browser. The complete portfolio and ecosystem story remain accessible below.</small>}
      </div>
    </div>
  );
};

const PersistentWorldExperience = ({ worldState, activeStep }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });
  const [pageVisible, setPageVisible] = useState(!document.hidden);
  const [webglAvailable, setWebglAvailable] = useState(null);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2", { failIfMajorPerformanceCaveat: true })
      || probe.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    setWebglAvailable(Boolean(context));
  }, []);

  return (
    <div className="persistent-world" aria-hidden="true">
      {webglAvailable === null && <WorldFallback checking activeStep={activeStep} />}
      {webglAvailable === false && <WorldFallback activeStep={activeStep} />}
      {webglAvailable && (
        <Canvas
          dpr={isMobile ? 1 : [1, 1.35]}
          frameloop={pageVisible ? "always" : "never"}
          shadows={!isMobile}
          camera={{ position: [15.5, 8.2, 20.5], fov: 42, near: 0.1, far: 90 }}
          gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
          fallback={<WorldFallback activeStep={activeStep} />}
        >
          <Suspense fallback={null}>
            <PersistentWorldSceneV2 worldState={worldState} isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      )}
      <div className="world-vignette" />
      <div className="world-grain" />
    </div>
  );
};

export default PersistentWorldExperience;
