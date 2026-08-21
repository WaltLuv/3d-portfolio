import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { techStackIcons } from "../constants";

const capabilityGroups = [
  { title: "Frontend", items: ["React", "JavaScript", "Tailwind CSS", "Three.js", "React Three Fiber", "Responsive Interfaces"] },
  { title: "Backend / Product", items: ["Python", "FastAPI", "APIs", "Application Architecture"] },
  { title: "Data / Infrastructure", items: ["PostgreSQL", "Supabase", "Git", "GitHub", "Deployment Workflows"] },
  { title: "AI Systems", items: ["LLM Integrations", "AI Agents", "Voice AI", "Computer Vision", "Tool Calling", "Skills", "Workflow Automation", "Orchestration", "Multi-Agent Concepts", "RAG / Structured Memory"] },
];

const TechStack = () => {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".capability-group", { y: 35, opacity: 0, stagger: 0.12, duration: 0.75, scrollTrigger: { trigger: "#skills", start: "top 72%" } });
  });

  return (
    <section id="skills" data-world-step="7" className="world-chapter builder-chapter" aria-labelledby="capabilities-title">
      <div className="chapter-panel chapter-panel-right builder-narrative">
        <header className="chapter-heading">
          <p className="chapter-index">CHAPTER 08 · THE BUILDER&apos;S STUDIO</p>
          <h2 id="capabilities-title">The Tools Behind The World.</h2>
          <p>The original dimensional technology models now live inside the shared studio—not in separate canvases.</p>
        </header>
        <div className="technology-name-rail" aria-label="Technologies shown as interactive objects in the 3D world">
          {techStackIcons.map((model, index) => <span key={model.name}><b>0{index + 1}</b>{model.name}</span>)}
        </div>
        <div className="capability-grid">
          {capabilityGroups.map((group, index) => (
            <article className="capability-group" key={group.title}>
              <span className="capability-index">0{index + 1}</span>
              <h3>{group.title}</h3>
              <div>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
