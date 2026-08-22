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
    gsap.from(".process-editorial li", { opacity: 0, y: 18, stagger: 0.12, duration: 0.65, ease: "power2.out", scrollTrigger: { trigger: "#process", start: "top 70%" } });
  });

  return (
    <section id="process" data-world-step="6.55" className="world-chapter process-chapter" aria-labelledby="process-title">
      <div className="chapter-panel chapter-panel-left process-narrative editorial-chapter-panel">
        <header className="chapter-heading chapter-heading-editorial">
          <p className="chapter-index">BASELINE STUDIOS / ARKITECH / SYSTEM DESIGN</p>
          <h2 id="process-title">How I build.</h2>
          <p>The intelligence beneath the operation starts with the operation itself.</p>
        </header>
        <ol className="process-editorial">
          {stages.map(([number, title, description]) => (
            <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{description}</p></div></li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowIBuild;
