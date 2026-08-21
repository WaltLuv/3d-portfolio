import { words } from "../constants";

const Hero = () => (
  <section id="hero" data-world-step="0" className="world-chapter arrival-chapter" aria-labelledby="hero-title">
    <div className="chapter-panel arrival-panel">
      <p className="chapter-index">CHAPTER 01 · ARRIVAL</p>
      <p className="arrival-name">Walter Thornton</p>
      <p className="arrival-role">Real Estate Operations × AI Product Builder</p>
      <h1 id="hero-title">
        I Turn Real-World Operations Into <span>AI-Powered Systems.</span>
      </h1>
      <p className="chapter-lede">
        I build software at the intersection of property operations, voice AI,
        computer vision, automation, and intelligent agents.
      </p>
      <div className="arrival-mission" aria-label="Illustrative ecosystem mission">
        <span>Live mission</span><strong>Unit 204 · Active Water Leak</strong><small>One event. Five connected systems.</small>
      </div>
      <a className="enter-world-link" href="#voiceops">
        <span>Scroll to explore</span>
        <i aria-hidden="true">↓</i>
      </a>
    </div>

    <div className="world-keyword-rail" aria-label="Core system themes">
      {words.slice(0, 6).map((word) => (
        <span key={word.text}>{word.text}</span>
      ))}
    </div>
  </section>
);

export default Hero;
