import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import PersistentWorldScene from "./PersistentWorldScene";

const WorldFallback = ({ checking = false, activeStep = 0 }) => (
  <div className={`world-webgl-fallback ${checking ? "world-webgl-checking" : ""}`} data-fallback-step={activeStep}>
    <div className="fallback-world-map" aria-hidden="true">
      <span className="fallback-road fallback-road-main" />
      <span className="fallback-road fallback-road-cross" />
      {["unit-204", "inspection", "operations", "studio"].map((building) => (
        <span className={`fallback-building fallback-building-${building}`} key={building}>
          <i /><i /><i /><b />
        </span>
      ))}
      <span className="fallback-voice-signal" />
      <span className="fallback-scan" />
      <span className="fallback-artifact">QUOTE</span>
      <span className="fallback-workforce-core"><i /><i /><i /><i /></span>
      <span className="fallback-capability-core"><i /><i /><i /></span>
      <span className="fallback-return-path" />
    </div>
    <div className="fallback-world-copy">
      <span>{checking ? "ENTERING WORLD" : "LIGHTWEIGHT WORLD MODE"}</span>
      <strong>PHYSICAL OPERATIONS<br />ILLUMINATED BY AI</strong>
      {!checking && <small>This browser cannot render WebGL. The same connected ecosystem story remains fully available in the professional layer.</small>}
    </div>
  </div>
);

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
          dpr={isMobile ? 1 : [1, 1.4]}
          frameloop={pageVisible ? "always" : "never"}
          shadows={!isMobile}
          camera={{ position: [15.5, 8.2, 20.5], fov: 42, near: 0.1, far: 90 }}
          gl={{ antialias: !isMobile, alpha: false, powerPreference: "high-performance" }}
          fallback={<WorldFallback activeStep={activeStep} />}
        >
          <Suspense fallback={null}>
            <PersistentWorldScene worldState={worldState} isMobile={isMobile} reducedMotion={reducedMotion} />
          </Suspense>
        </Canvas>
      )}
      <div className="world-vignette" />
      <div className="world-grain" />
    </div>
  );
};

export default PersistentWorldExperience;
