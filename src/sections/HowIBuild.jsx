import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const stages = [
  ["01", "Start With The Workflow", "Understand what people actually do."],
  ["02", "Find The Repetition", "Identify repetitive work, bottlenecks, communication overhead, and operational friction."],
  ["03", "Give AI The Right Tools", "Connect models to data, APIs, skills, memory, voice, vision, workflows, and business rules."],
  ["04", "Build For The Real Operation", "Make the result useful, understandable, observable, testable, and maintainable."],
];

const HowIBuild = () => {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".process-stage", { opacity: 0, x: -28, stagger: 0.16, duration: 0.75, ease: "power2.out", scrollTrigger: { trigger: "#process", start: "top 70%" } });
  });

  return (
    <section id="process" data-world-step="4.35" className="world-chapter process-chapter" aria-labelledby="process-title">
      <div className="chapter-panel chapter-panel-left process-narrative">
        <header className="chapter-heading">
          <p className="chapter-index">BASELINE STUDIOS · SYSTEM DESIGN PROCESS</p>
          <h2 id="process-title">How I Build</h2>
          <p>The intelligence beneath the operation starts with the operation itself.</p>
        </header>
        <ol className="process-pipeline">
          {stages.map(([number, title, description]) => (
            <li className="process-stage" key={number}>
              <div className="stage-node"><span>{number}</span><i /></div>
              <div><h3>{title}</h3><p>{description}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowIBuild;
