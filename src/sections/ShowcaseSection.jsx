import { Fragment } from "react";

import { portfolioProjects } from "../data/projects";

const nextChapter = {
  voiceops: "#propcontrol",
  propcontrol: "#visionops",
  visionops: "#repair-cost-guide",
  "workforce-os": "#baseline-studios",
  "baseline-studios": "#process",
};

const MissionFlow = ({ project }) => (
  <ol className={`mission-flow mission-flow-${project.slug}`} aria-label={`${project.name} mission sequence`}>
    {project.missionFlow?.map((step, index) => (
      <li className={step.includes("Approval") ? "requires-approval" : ""} key={step}>
        <b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span>
      </li>
    ))}
  </ol>
);

const ProductActions = ({ project }) => (
  <div className="product-actions">
    <a href={nextChapter[project.slug]}>Continue mission <span>↓</span></a>
    {project.landingPage && <a href={project.landingPage} target="_blank" rel="noopener noreferrer">{project.ctaLabel} <span>↗</span></a>}
  </div>
);

const RepairCostChapter = () => (
  <article id="repair-cost-guide" data-world-step="4" className="world-chapter repair-cost-chapter" aria-labelledby="repair-cost-title">
    <div className="chapter-panel chapter-panel-right repair-cost-narrative">
      <header className="chapter-heading">
        <p className="chapter-index">CHAPTER 05 · VISIONOPS SIGNATURE MOMENT</p>
        <h2 id="repair-cost-title">Evidence Becomes<br /><span>Repair Intelligence.</span></h2>
        <p>The illustrated Unit 204 finding becomes a structured repair scope, then a quote-ready operational artifact.</p>
      </header>
      <div className="quote-artifact" aria-label="Illustrative Repair Cost Guide quote sequence">
        <div><span>Finding</span><strong>Water-affected drywall + plumbing area</strong></div>
        <div><span>Scope</span><strong>Inspect · isolate · repair · restore</strong></div>
        <div className="quote-artifact-result"><span>Repair Cost Guide</span><strong>Quote Generated</strong><small>Illustrative system visualization—no customer or fabricated pricing data.</small></div>
      </div>
      <ol className="repair-handoff"><li>Evidence</li><li>Finding</li><li>Scope</li><li>Quote</li><li>Owner approval</li><li>Workforce OS</li></ol>
      <div className="product-actions"><a href="#workforce-os">Follow the artifact <span>↓</span></a></div>
    </div>
  </article>
);

const AppShowcase = () => (
  <section id="work" className="project-journey" aria-labelledby="systems-title">
    <h2 id="systems-title" className="sr-only">Walter Thornton AI real estate ecosystem</h2>
    {portfolioProjects.map((project, index) => (
      <Fragment key={project.slug}>
        <article id={project.slug} data-world-step={project.journeyStep} className={`world-chapter project-chapter project-chapter-${project.slug}`} aria-labelledby={`${project.slug}-title`}>
          <div className={`chapter-panel project-narrative ${index % 2 === 0 ? "chapter-panel-left" : "chapter-panel-right"}`}>
            <header className="chapter-heading">
              <p className="chapter-index">CHAPTER {project.chapter} · {project.category}</p>
              <h2 id={`${project.slug}-title`}>{project.name}</h2>
              <p className="project-world-label">{project.visualLabel}</p>
            </header>
            <p className="project-role">{project.role}</p>
            <p className="project-value">{project.value}</p>
            <p className="project-description">{project.description}</p>
            <ul className="capability-ribbon" aria-label={`${project.name} capabilities`}>{project.capabilities.map((capability) => <li key={capability}>{capability}</li>)}</ul>
            {project.workflow && <ol className="vision-chapter-flow" aria-label={`${project.name} workflow`}>{project.workflow.map((step) => <li className={step === "Repair Cost" ? "is-repair" : ""} key={step}><span>{step}</span></li>)}</ol>}
            {project.missionFlow && <MissionFlow project={project} />}
            {project.featured && <div className="repair-cost-callout"><span>Signature capability</span><strong>{project.featured}</strong><small>The next chapter visualizes quote generation as an operational artifact.</small></div>}
            {project.slug === "workforce-os" && <div className="governance-legend"><span><i />Automated execution</span><span><i />Human approval required</span><strong>Controlled AI—not uncontrolled autonomy.</strong></div>}
            <ProductActions project={project} />
          </div>
        </article>
        {project.slug === "visionops" && <RepairCostChapter />}
      </Fragment>
    ))}
  </section>
);

export default AppShowcase;
