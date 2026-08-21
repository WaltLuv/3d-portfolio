import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import PersistentWorldExperience from "./PersistentWorldExperience";
import { journeyChapters } from "./worldData";
import FastPortfolioPanel from "../FastPortfolioPanel";
import WalterGuide from "../WalterGuide";

gsap.registerPlugin(ScrollTrigger);

const AudioControl = () => {
  const audioGraph = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => () => {
    audioGraph.current?.context.close();
    audioGraph.current = null;
  }, []);

  const createAudioGraph = async () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;

    const context = new AudioContext();
    const master = context.createGain();
    const filter = context.createBiquadFilter();
    const lowTone = context.createOscillator();
    const upperTone = context.createOscillator();
    const noise = context.createBufferSource();
    const noiseFilter = context.createBiquadFilter();
    const noiseGain = context.createGain();
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const data = buffer.getChannelData(0);

    for (let index = 0; index < data.length; index += 1) data[index] = (Math.random() * 2 - 1) * 0.22;

    master.gain.value = 0;
    filter.type = "lowpass";
    filter.frequency.value = 180;
    lowTone.type = "sine";
    lowTone.frequency.value = 48;
    upperTone.type = "sine";
    upperTone.frequency.value = 72;
    noise.buffer = buffer;
    noise.loop = true;
    noiseFilter.type = "lowpass";
    noiseFilter.frequency.value = 520;
    noiseGain.gain.value = 0.06;

    lowTone.connect(filter);
    upperTone.connect(filter);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    filter.connect(master);
    noiseGain.connect(master);
    master.connect(context.destination);
    lowTone.start();
    upperTone.start();
    noise.start();

    audioGraph.current = { context, master };
    return audioGraph.current;
  };

  const toggleAudio = async () => {
    const graph = audioGraph.current || await createAudioGraph();
    if (!graph) return;
    await graph.context.resume();
    const nextEnabled = !enabled;
    const now = graph.context.currentTime;
    graph.master.gain.cancelScheduledValues(now);
    graph.master.gain.setValueAtTime(graph.master.gain.value, now);
    graph.master.gain.linearRampToValueAtTime(nextEnabled ? 0.026 : 0, now + 0.45);
    setEnabled(nextEnabled);
  };

  return (
    <button type="button" className="world-control" aria-pressed={enabled} onClick={toggleAudio}>
      <span className="world-control-dot" />Sound {enabled ? "On" : "Off"}
    </button>
  );
};

const WorldJourney = ({ children }) => {
  const worldState = useRef({
    targetStep: 0,
    currentStep: 0,
    activeStep: 0,
    exploreEnabled: false,
    keys: new Set(),
    paused: false,
  });
  const [activeStep, setActiveStep] = useState(0);
  const [exploreEnabled, setExploreEnabled] = useState(false);

  useEffect(() => {
    const handleVisibility = () => { worldState.current.paused = document.hidden; };
    const handleKey = (event, pressed) => {
      if (!worldState.current.exploreEnabled) return;
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target?.isContentEditable) return;
      const key = event.key.toLowerCase();
      if (!["w", "a", "s", "d"].includes(key)) return;
      if (pressed) worldState.current.keys.add(key);
      else worldState.current.keys.delete(key);
    };
    const keyDown = (event) => handleKey(event, true);
    const keyUp = (event) => handleKey(event, false);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  useGSAP(() => {
    const sections = gsap.utils.toArray("[data-world-step]");
    let waypoints = [];

    const measure = () => {
      waypoints = sections.map((element) => ({
        scroll: element.getBoundingClientRect().top + window.scrollY + element.offsetHeight * 0.5 - window.innerHeight * 0.5,
        step: Number(element.dataset.worldStep),
      }));
    };

    const updateWorld = () => {
      if (!waypoints.length) return;
      const scroll = window.scrollY;
      let target = waypoints[0].step;

      if (scroll >= waypoints[waypoints.length - 1].scroll) {
        target = waypoints[waypoints.length - 1].step;
      } else {
        for (let index = 0; index < waypoints.length - 1; index += 1) {
          const current = waypoints[index];
          const next = waypoints[index + 1];
          if (scroll < current.scroll || scroll > next.scroll) continue;
          const range = Math.max(1, next.scroll - current.scroll);
          const progress = gsap.utils.clamp(0, 1, (scroll - current.scroll) / range);
          target = gsap.utils.interpolate(current.step, next.step, progress);
          break;
        }
      }

      worldState.current.targetStep = target;
      const nextActive = Math.round(gsap.utils.clamp(0, journeyChapters.length - 1, target));
      if (nextActive !== worldState.current.activeStep) {
        worldState.current.activeStep = nextActive;
        setActiveStep(nextActive);
      }
    };

    measure();
    updateWorld();
    const trigger = ScrollTrigger.create({
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      onUpdate: updateWorld,
      onRefresh: () => { measure(); updateWorld(); },
    });

    return () => trigger.kill();
  }, []);

  const toggleExplore = () => {
    const next = !exploreEnabled;
    worldState.current.exploreEnabled = next;
    worldState.current.keys.clear();
    setExploreEnabled(next);
  };

  return (
    <>
      <PersistentWorldExperience worldState={worldState} activeStep={activeStep} />
      <WalterGuide activeStep={activeStep} />
      <div className="world-interface" aria-label="Interactive world controls">
        <div className="world-progress" aria-live="polite">
          <span>{String(activeStep + 1).padStart(2, "0")} / {String(journeyChapters.length).padStart(2, "0")}</span>
          <strong>{journeyChapters[activeStep]?.label}</strong>
          <small>{journeyChapters[activeStep]?.mission}</small>
        </div>
        <div className="world-control-group">
          <FastPortfolioPanel />
          <button type="button" className="world-control world-explore-control" aria-pressed={exploreEnabled} onClick={toggleExplore}>
            <span className="world-control-dot" />Explore {exploreEnabled ? "On · WASD" : "Off"}
          </button>
          <AudioControl />
        </div>
      </div>
      {children}
    </>
  );
};

export default WorldJourney;
