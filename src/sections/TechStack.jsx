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
    gsap.from(".capability-directory article", { y: 22, opacity: 0, stagger: 0.1, duration: 0.65, scrollTrigger: { trigger: "#skills", start: "top 72%" } });
  });

  return (
    <section id="skills" data-world-step="7" className="world-chapter builder-chapter" aria-labelledby="capabilities-title">
      <div className="chapter-panel chapter-panel-right builder-narrative editorial-chapter-panel">
        <header className="chapter-heading chapter-heading-editorial">
          <p className="chapter-index">08 / BUILDER STUDIO</p>
          <h2 id="capabilities-title">The tools<br /><span>behind the world.</span></h2>
          <p>The dimensional technology objects in the studio represent the practical stack behind the ecosystem.</p>
        </header>
        <p className="studio-tech-line" aria-label="Technologies represented in the 3D studio">{techStackIcons.map((model) => model.name).join(" · ")}</p>
        <div className="capability-directory">
          {capabilityGroups.map((group, index) => (
            <article key={group.title}>
              <span>0{index + 1}</span>
              <div><h3>{group.title}</h3><p>{group.items.join(" · ")}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechStack;
