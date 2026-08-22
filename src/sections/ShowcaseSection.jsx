import { Fragment } from "react";

import { portfolioProjects } from "../data/projects";

const nextChapter = {
  voiceops: "#propcontrol",
  propcontrol: "#visionops",
  visionops: "#repair-cost-guide",
  "workforce-os": "#baseline-studios",
  "baseline-studios": "#process",
};

const chapterProof = {
  voiceops: ["Understands the request", "Resolves property + unit context", "Turns conversation into action"],
  propcontrol: ["Creates the work", "Coordinates approvals + vendors", "Tracks the operation to completion"],
  visionops: ["Captures evidence", "Finds the physical issue", "Creates repair intelligence"],
  "workforce-os": ["Assigns governed work", "Routes through human approval", "Records completion + audit evidence"],
  "baseline-studios": ["Starts with the business problem", "Assembles a reusable capability", "Tests, publishes, and deploys"],
};

const ProductActions = ({ project }) => (
  <div className="product-actions product-actions-editorial">
    <a href={nextChapter[project.slug]}>Continue the mission <span>↓</span></a>
    {project.landingPage && <a href={project.landingPage} target="_blank" rel="noopener noreferrer">{project.ctaLabel} <span>↗</span></a>}
  </div>
);

const RepairCostChapter = () => (
  <article id="repair-cost-guide" data-world-step="4" className="world-chapter repair-cost-chapter" aria-labelledby="repair-cost-title">
    <div className="chapter-panel chapter-panel-right repair-cost-narrative editorial-chapter-panel">
      <header className="chapter-heading chapter-heading-editorial">
        <p className="chapter-index">05 / REPAIR COST GUIDE</p>
        <h2 id="repair-cost-title">Evidence becomes<br /><span>a repair artifact.</span></h2>
        <p>VisionOps turns the Unit 204 finding into an illustrative repair scope and recognizable estimate document. That document becomes the object the workforce can approve, route, and execute.</p>
      </header>
      <div className="editorial-proof" aria-label="Repair Cost Guide sequence">
        <span>Finding</span><i aria-hidden="true" />
        <span>Scope</span><i aria-hidden="true" />
        <strong>Quote Ready</strong>
      </div>
      <p className="chapter-disclaimer">Illustrative portfolio sequence. No customer data or fabricated pricing.</p>
      <div className="product-actions product-actions-editorial"><a href="#workforce-os">Follow the estimate into Workforce OS <span>↓</span></a></div>
    </div>
  </article>
);

const AppShowcase = () => (
  <section id="work" className="project-journey" aria-labelledby="systems-title">
    <h2 id="systems-title" className="sr-only">Walter Thornton AI real estate ecosystem</h2>
    {portfolioProjects.map((project, index) => (
      <Fragment key={project.slug}>
        <article id={project.slug} data-world-step={project.journeyStep} className={`world-chapter project-chapter project-chapter-${project.slug}`} aria-labelledby={`${project.slug}-title`}>
          <div className={`chapter-panel project-narrative editorial-chapter-panel ${index % 2 === 0 ? "chapter-panel-left" : "chapter-panel-right"}`}>
            <header className="chapter-heading chapter-heading-editorial">
              <p className="chapter-index">{project.chapter} / {project.category}</p>
              <h2 id={`${project.slug}-title`}>{project.name}</h2>
              <p className="project-role project-role-editorial">{project.role}</p>
            </header>
            <p className="project-value project-value-editorial">{project.value}</p>
            <p className="project-description project-description-editorial">{project.description}</p>
            <div className="chapter-proof" aria-label={`${project.name} operational proof`}>
              {chapterProof[project.slug].map((item, proofIndex) => (
                <div key={item}><span>{String(proofIndex + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
              ))}
            </div>
            {project.featured && <p className="signature-line"><span>Signature capability</span><strong>{project.featured}</strong></p>}
            {project.slug === "workforce-os" && <p className="governance-statement">Automation where appropriate. Human approval where required. Audit evidence at the end.</p>}
            {project.slug === "baseline-studios" && <p className="governance-statement">The capability is built in the workshop, tested, deployed into Workforce OS, and returned to the operating world.</p>}
            <ProductActions project={project} />
          </div>
        </article>
        {project.slug === "visionops" && <RepairCostChapter />}
      </Fragment>
    ))}
  </section>
);

export default AppShowcase;
