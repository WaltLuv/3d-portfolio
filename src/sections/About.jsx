import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const intersections = ["Real Estate", "Property Operations", "Workflow Design", "AI", "Automation", "Software Development", "Systems Thinking"];

const About = () => {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".domain-list-editorial li", { opacity: 0, y: 14, stagger: 0.06, duration: 0.55, scrollTrigger: { trigger: "#about", start: "top 75%" } });
  });

  return (
    <section id="about" data-world-step="9" className="world-chapter about-chapter" aria-labelledby="about-title">
      <div className="chapter-panel chapter-panel-left about-narrative editorial-chapter-panel">
        <header className="chapter-heading chapter-heading-editorial">
          <p className="chapter-index">10 / DOMAIN ADVANTAGE</p>
          <h2 id="about-title">Built from operations,<br /><span>not just code.</span></h2>
          <p>My approach to AI comes from working with the kinds of operational problems these systems are meant to solve. The technology has to improve the workflow—not merely demonstrate that AI exists.</p>
        </header>
        <ul className="domain-list-editorial" aria-label="Areas of expertise">
          {intersections.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
};

export default About;
