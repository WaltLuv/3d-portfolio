import { portfolioProjects } from "../data/projects";

const baselineSequence = [
  "Business Problem",
  "Spec Kit",
  "Agent",
  "Tools",
  "Skills",
  "Workflow",
  "Deploy",
];

const AppShowcase = () => (
  <section id="work" className="project-journey" aria-labelledby="systems-title">
    <h2 id="systems-title" className="sr-only">Systems I&apos;ve Built</h2>

    {portfolioProjects.map((project, index) => (
      <article
        id={project.slug}
        data-world-step={index + 1}
        className={`world-chapter project-chapter project-chapter-${project.slug}`}
        key={project.slug}
        aria-labelledby={`${project.slug}-title`}
      >
        <div className={`chapter-panel project-narrative ${index % 2 === 0 ? "chapter-panel-right" : "chapter-panel-left"}`}>
          <header className="chapter-heading">
            <p className="chapter-index">CHAPTER {String(index + 2).padStart(2, "0")} · {project.category}</p>
            <h2 id={`${project.slug}-title`}>{project.name}</h2>
            <p className="project-world-label">{project.visualLabel}</p>
          </header>

          <p className="project-value">{project.value}</p>
          <p className="project-description">{project.description}</p>

          <ul className="capability-ribbon" aria-label={`${project.name} capabilities`}>
            {project.capabilities.map((capability) => <li key={capability}>{capability}</li>)}
          </ul>

          {project.workflow && (
            <ol className="vision-chapter-flow" aria-label={`${project.name} system workflow`}>
              {project.workflow.map((step) => (
                <li className={step === "Repair Cost" ? "is-repair" : ""} key={step}>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          )}

          {project.featured && (
            <div className="repair-cost-callout">
              <span>Signature capability</span>
              <strong>{project.featured}</strong>
              <small>Illustrative system visualization only—no customer data or fabricated quote.</small>
            </div>
          )}

          {project.slug === "baseline-studios" && (
            <ol className="baseline-chapter-flow" aria-label="Baseline Studios system architecture">
              {baselineSequence.map((step) => <li key={step}>{step}</li>)}
            </ol>
          )}
        </div>
      </article>
    ))}
  </section>
);

export default AppShowcase;
