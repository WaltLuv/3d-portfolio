import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import SystemsWorldExperience from "../components/models/property/SystemsWorldExperience";
import { portfolioProjects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);
  const [activeProject, setActiveProject] = useState(0);
  const project = portfolioProjects[activeProject];

  useGSAP(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggers = cardsRef.current.filter(Boolean).map((card, index) => {
      if (!reducedMotion) {
        gsap.fromTo(
          card,
          { y: 42, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            scrollTrigger: { trigger: card, start: "top 78%" },
          }
        );
      }

      return ScrollTrigger.create({
        trigger: card,
        start: "top 58%",
        end: "bottom 42%",
        onEnter: () => setActiveProject(index),
        onEnterBack: () => setActiveProject(index),
      });
    });

    return () => triggers.forEach((trigger) => trigger.kill());
  }, { scope: sectionRef });

  const activateProject = (index) => setActiveProject(index);

  return (
    <section id="work" ref={sectionRef} className="systems-story" aria-labelledby="systems-title">
      <header className="systems-story-heading">
        <p className="section-kicker">01 — FLAGSHIP SYSTEMS</p>
        <h2 id="systems-title">Systems I&apos;ve Built</h2>
        <p>One living property world. Four intelligence layers designed around real operational work.</p>
      </header>

      <div className="systems-story-layout">
        <div className="systems-world-column">
          <div className="systems-world-sticky">
            <div className="systems-world-canvas">
              <SystemsWorldExperience stage={activeProject + 1} />
              <p className="sr-only">Interactive 3D property illustrating {project.name}: {project.value}</p>
              <div className="world-corner world-corner-top" />
              <div className="world-corner world-corner-bottom" />
            </div>

            <div className="world-status" aria-live="polite">
              <span>ACTIVE INTELLIGENCE LAYER · {project.id} / 04</span>
              <strong>{project.name}</strong>
              <p>{project.visualLabel}</p>
            </div>

            {project.slug === "visionops" && (
              <ol className="world-sequence" aria-label="VisionOps workflow">
                {project.workflow.map((step, index) => (
                  <li className={step === "Repair Cost" ? "is-repair" : ""} key={step}>
                    <span>{String(index + 1).padStart(2, "0")}</span>{step}
                  </li>
                ))}
              </ol>
            )}

            <div className="world-stage-controls" aria-label="Choose a system visualization">
              {portfolioProjects.map((item, index) => (
                <button
                  type="button"
                  key={item.slug}
                  className={index === activeProject ? "active" : ""}
                  onClick={() => activateProject(index)}
                  aria-pressed={index === activeProject}
                >
                  <span>{item.id}</span>{item.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="systems-story-copy">
          {portfolioProjects.map((item, index) => (
            <article
              key={item.name}
              tabIndex="0"
              ref={(element) => { cardsRef.current[index] = element; }}
              className={`system-story-card ${index === activeProject ? "active" : ""}`}
              onMouseEnter={() => activateProject(index)}
              onFocus={() => activateProject(index)}
              onTouchStart={() => activateProject(index)}
            >
              <header>
                <span>{item.id} / 04</span>
                <p>{item.category}</p>
              </header>
              <h3>{item.name}</h3>
              <p className="system-story-value">{item.value}</p>
              <p>{item.description}</p>
              <div className="system-story-tags">
                {item.capabilities.map((capability) => <span key={capability}>{capability}</span>)}
              </div>
              {item.workflow && (
                <ol className="vision-story-flow" aria-label={`${item.name} system workflow`}>
                  {item.workflow.map((step, stepIndex) => (
                    <li className={step === "Repair Cost" ? "featured-step" : ""} key={step}>
                      <b>{String(stepIndex + 1).padStart(2, "0")}</b>{step}
                    </li>
                  ))}
                </ol>
              )}
              {item.featured && (
                <div className="repair-story-feature">
                  <span>FEATURED CAPABILITY</span>
                  <strong>{item.featured}</strong>
                  <small>Visualized illustratively in the property scan—no customer data or fabricated quote.</small>
                </div>
              )}
              <div className="project-media-slot">
                <span>PRODUCT MEDIA SLOT</span>
                <p>Reserved for a real screenshot or demo video.</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
