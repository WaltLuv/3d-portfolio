import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const intersections = ["Real Estate", "Property Operations", "Workflow Design", "AI", "Automation", "Software Development", "Systems Thinking"];

const About = () => {
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(".domain-chip", { opacity: 0, y: 18, stagger: 0.08, duration: 0.6, scrollTrigger: { trigger: "#about", start: "top 75%" } });
  });

  return (
    <section id="about" className="domain-section section-padding" aria-labelledby="about-title">
      <div className="domain-heading">
        <p className="section-kicker">02 — DOMAIN ADVANTAGE</p>
        <h2 id="about-title">Built From Operations,<br /><span>Not Just Code.</span></h2>
      </div>
      <div className="domain-copy">
        <p>My approach to AI comes from working with the types of operational problems these systems are meant to solve.</p>
        <p>That perspective shapes how I think about automation: the technology has to improve the workflow, not simply demonstrate that AI exists.</p>
        <div className="domain-map" aria-label="Areas of expertise">
          {intersections.map((item) => <span className="domain-chip" key={item}>{item}</span>)}
        </div>
      </div>
    </section>
  );
};

export default About;
