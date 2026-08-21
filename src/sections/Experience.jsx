import { professionalExperience, professionalSummary } from "../data/profile";

const Experience = () => (
  <section id="experience" data-world-step="8" className="world-chapter experience-chapter" aria-labelledby="experience-title">
    <div className="chapter-panel chapter-panel-right experience-narrative">
      <header className="chapter-heading">
        <p className="chapter-index">CHAPTER 09 · PROFESSIONAL FOUNDATION</p>
        <h2 id="experience-title">Operations<br /><span>Before Automation.</span></h2>
        <p>{professionalSummary}</p>
      </header>
      <ol className="experience-timeline">
        {professionalExperience.map((item) => (
          <li key={`${item.organization}-${item.period}`}>
            <span>{item.period}</span>
            <div><strong>{item.role}</strong><b>{item.organization}</b><p>{item.focus}</p></div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Experience;
