import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";
import TechIconCardExperience from "../components/models/tech_logos/TechIconCardExperience";
import { techStackIcons } from "../constants";

const capabilityGroups = [
  { title: "Frontend", items: ["React", "JavaScript", "Tailwind CSS", "Three.js", "React Three Fiber", "Responsive Interfaces"] },
  { title: "Backend / Product", items: ["Python", "FastAPI", "APIs", "Application Architecture"] },
  { title: "Data / Infrastructure", items: ["PostgreSQL", "Supabase", "Git", "GitHub", "Deployment Workflows"] },
  { title: "AI Systems", items: ["LLM Integrations", "AI Agents", "Voice AI", "Computer Vision", "Tool Calling", "Skills", "Workflow Automation", "Orchestration", "Multi-Agent Concepts", "RAG / Structured Memory"] },
];

const TechStack = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
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
      <div className="technology-models" aria-label="Interactive three-dimensional technology models">
        <div className="model-copy"><p className="section-kicker">3D TECHNOLOGY CORE</p><h3>Built with the same tools<br />this portfolio demonstrates.</h3></div>
        {!isMobile ? techStackIcons.slice(0, 3).map((model) => (
          <article className="technology-model" key={model.name}><div><TechIconCardExperience model={model} /></div><p>{model.name}</p></article>
        )) : <div className="mobile-tech-list">{techStackIcons.slice(0, 3).map((model) => <span key={model.name}>{model.name}</span>)}</div>}
      </div>
    </section>
  );
};

export default TechStack;
