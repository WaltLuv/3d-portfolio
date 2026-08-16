import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { portfolioProjects } from "../data/projects";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    cardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <section id="work" ref={sectionRef} className="app-showcase" aria-labelledby="systems-title">
      <div className="w-full">
        <div className="mb-12">
          <p className="text-blue-50 uppercase tracking-[0.2em] text-sm mb-3">Flagship systems</p>
          <h2 id="systems-title" className="text-4xl md:text-6xl font-semibold">Systems I&apos;ve Built</h2>
          <p className="text-white-50 md:text-xl mt-4">AI products designed around real operational problems.</p>
        </div>
        <div className="systems-grid">
          {portfolioProjects.map((project, index) => (
            <article key={project.name} tabIndex="0" ref={(element) => { cardsRef.current[index] = element; }} className={`system-card ${project.accent}`}>
              <div className={`system-visual visual-${project.slug}`} role="img" aria-label={`${project.name} abstract product visualization`}>
                <span>{project.id} / 04</span><small>{project.visualLabel}</small><strong><b>{project.mark}</b></strong>
                <div className="system-orbit orbit-one" /><div className="system-orbit orbit-two" />
                {project.slug === "voiceops" && <div className="voice-wave">{[1,2,3,4,5,6,7,8,9].map((bar) => <i key={bar} />)}</div>}
                {project.slug === "visionops" && <div className="scan-frame"><i /><i /><i /><i /></div>}
                {project.slug === "baseline-studios" && <div className="agent-nodes"><i /><i /><i /><i /><i /></div>}
                <div className="future-media">REAL PRODUCT MEDIA SLOT</div>
              </div>
              <div className="system-copy">
                <p className="system-category">{project.category}</p>
                <h3>{project.name}</h3>
                <p className="system-value">{project.value}</p>
                <p>{project.description}</p>
                <div className="system-tags">{project.capabilities.map((capability) => <span key={capability}>{capability}</span>)}</div>
                {project.workflow && <div className="vision-flow">{project.workflow.map((step, stepIndex) => <span className={step === "Repair Cost" ? "featured-step" : ""} key={step}><b>{String(stepIndex + 1).padStart(2, "0")}</b>{step}</span>)}</div>}
                {project.featured && <div className="repair-feature"><span>★ FEATURED CAPABILITY</span><strong>{project.featured}</strong></div>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppShowcase;
