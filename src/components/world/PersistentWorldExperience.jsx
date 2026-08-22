import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import StylizedHouse from "../models/property/StylizedHouse";
import PersistentWorldSceneV2 from "./PersistentWorldSceneV2";
import { journeyChapters } from "./worldData";

const WorldFallback = ({ checking = false, activeStep = 0 }) => {
  const chapter = journeyChapters[activeStep] || journeyChapters[0];

  return (
    <div className={`world-webgl-fallback world-webgl-fallback-v2 fallback-stage-${activeStep} ${checking ? "world-webgl-checking" : ""}`} data-fallback-step={activeStep}>
      <div className="fallback-editorial-light" aria-hidden="true" />
      <div className="fallback-editorial-copy">
        <p>{checking ? "Entering Walter's world" : "Cinematic editorial mode"}</p>
        <span>{String(activeStep + 1).padStart(2, "0")}</span>
        <strong>{chapter.label}</strong>
        <small>{chapter.mission}</small>
        {!checking && <em>Unit 204 · One mission moving through the complete ecosystem</em>}
      </div>
      <div className="fallback-chapter-track" aria-hidden="true">
        {journeyChapters.map((item, index) => <i className={index <= activeStep ? "is-active" : ""} key={item.id} />)}
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
            <StylizedHouse
              position={[0, 0, 0]}
              scale={1.045}
              reducedMotion={reducedMotion}
              interactive={false}
              float={false}
              showAura={false}
              missionHouse
              worldState={worldState}
            />
          </Suspense>
        </Canvas>
      )}
      <div className="world-vignette" />
      <div className="world-grain" />
    </div>
  );
};

export default PersistentWorldExperience;
