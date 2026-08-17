import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import TechnologyOrbitExperience from "../components/models/tech_logos/TechnologyOrbitExperience";
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
    <section id="skills" className="capabilities-section section-padding" aria-labelledby="capabilities-title">
      <header className="section-heading">
        <p className="section-kicker">04 — TECHNICAL CAPABILITIES</p>
        <h2 id="capabilities-title">AI Product Engineering,<br /><span>End to End.</span></h2>
        <p>Technologies organized by the role they play in building useful operational systems.</p>
      </header>
      <div className="capability-grid">
        {capabilityGroups.map((group, index) => (
          <article className="capability-group" key={group.title}>
            <span className="capability-index">0{index + 1}</span>
            <h3>{group.title}</h3>
            <div>{group.items.map((item) => <span key={item}>{item}</span>)}</div>
          </article>
        ))}
      </div>
      <div className="technology-orbit" aria-label="Interactive three-dimensional technology orbit">
        <div className="technology-orbit-copy">
          <p className="section-kicker">3D ENGINEERING CORE</p>
          <h3>Dimensional tools.<br />One connected system.</h3>
          <p>React, Python, Node, Three.js, and Git occupy one interactive engineering orbit.</p>
        </div>
        <div className="technology-orbit-canvas"><TechnologyOrbitExperience /></div>
        <div className="technology-orbit-labels" aria-label="Technologies shown in the 3D scene">
          {techStackIcons.map((model, index) => <span key={model.name}><b>0{index + 1}</b>{model.name}</span>)}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
