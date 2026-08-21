import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Room } from "../components/models/hero_models/Room";
import { portfolioLinks, portfolioProjects } from "../data/projects";
import { professionalExperience, professionalSummary } from "../data/profile";
import "../story.css";

const primaryProjects = portfolioProjects.filter((project) =>
  ["propcontrol", "voiceops", "visionops"].includes(project.slug)
);

const supportingProjects = portfolioProjects.filter((project) =>
  ["workforce-os", "baseline-studios"].includes(project.slug)
);

const buildPrinciples = [
  {
    number: "01",
    title: "Start with the workflow",
    copy: "I begin with the real operation: who is doing the work, what information they need, what slows them down, and what has to happen next.",
  },
  {
    number: "02",
    title: "Find the repetition",
    copy: "I look for the calls, inspections, follow-ups, approvals, handoffs, and documentation that consume time or create avoidable mistakes.",
  },
  {
    number: "03",
    title: "Give AI the right tools",
    copy: "The goal is not to add AI everywhere. The goal is to give it enough context, tools, and guardrails to solve a useful part of the operation.",
  },
  {
    number: "04",
    title: "Build for the real operation",
    copy: "The system has to work for the people using it. Clear actions, reliable information, human approval where needed, and useful outputs matter more than novelty.",
  },
];

function StaticRoom() {
  return (
    <div className="story-room" aria-hidden="true">
      <Canvas
        frameloop="demand"
        dpr={[1, 1.25]}
        camera={{ position: [3.4, 2.6, 5.9], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={1.2} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.8} />
        <Suspense fallback={null}>
          <Room position={[0, -1.35, 0]} scale={0.72} rotation={[0, -0.45, 0]} enableEffects={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function ProjectCard({ project, featured = false }) {
  return (
    <article className={`story-project ${featured ? "story-project-featured" : ""}`}>
      <div className="story-project-kicker">{project.category}</div>
      <h3>{project.name}</h3>
      <p className="story-project-value">{project.value}</p>
      <p>{project.description}</p>
      {project.featured && <p className="story-project-signature">Signature capability: {project.featured}</p>}
      <div className="story-capabilities" aria-label={`${project.name} capabilities`}>
        {project.capabilities.slice(0, 5).map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
      {project.landingPage && (
        <a href={project.landingPage} target="_blank" rel="noopener noreferrer" className="story-link">
          Explore product
        </a>
      )}
    </article>
  );
}

export default function StoryPortfolio() {
  return (
    <div className="story-site">
      <a className="story-skip" href="#story-main">Skip to main content</a>

      <header className="story-nav">
        <a href="#scene-1" className="story-brand">Walter Thornton</a>
        <nav aria-label="Primary navigation">
          <a href="#scene-2">Experience</a>
          <a href="#scene-4">Systems</a>
          <a href="#scene-5">Process</a>
          <a href="#scene-6">Contact</a>
        </nav>
      </header>

      <main id="story-main">
        <section id="scene-1" className="story-scene story-hero" aria-labelledby="scene-1-title">
          <div className="story-scene-number">Scene 01</div>
          <div className="story-hero-grid">
            <div className="story-hero-copy">
              <p className="story-eyebrow">Real Estate Operations × AI Product Builder</p>
              <h1 id="scene-1-title">I turn real-world operations into useful AI-powered systems.</h1>
              <p className="story-lead">
                I did not start with AI. I started with properties, residents, leasing, maintenance, vendors, field work, documentation, and the daily problems that keep operations moving.
              </p>
              <p className="story-lead story-lead-muted">
                That operating experience is now the foundation for how I design and build technology.
              </p>
              <div className="story-hero-actions">
                <a href="#scene-2" className="story-button">See my experience</a>
                {portfolioLinks.github && (
                  <a href={portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="story-text-link">GitHub ↗</a>
                )}
              </div>
            </div>
            <StaticRoom />
          </div>
        </section>

        <section id="scene-2" className="story-scene" aria-labelledby="scene-2-title">
          <div className="story-scene-number">Scene 02</div>
          <div className="story-heading-row">
            <div>
              <p className="story-eyebrow">The foundation</p>
              <h2 id="scene-2-title">Built from operations, not just code.</h2>
            </div>
            <p className="story-section-intro">{professionalSummary}</p>
          </div>

          <div className="story-timeline">
            {professionalExperience.map((item) => (
              <article className="story-role" key={`${item.organization}-${item.period}`}>
                <div className="story-role-period">{item.period}</div>
                <div className="story-role-body">
                  <h3>{item.role}</h3>
                  <p className="story-role-company">{item.organization}</p>
                  <p>{item.focus}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="scene-3" className="story-scene story-lesson" aria-labelledby="scene-3-title">
          <div className="story-scene-number">Scene 03</div>
          <p className="story-eyebrow">What the work taught me</p>
          <h2 id="scene-3-title">The hardest problems were rarely “technology problems.”</h2>
          <div className="story-lesson-grid">
            <p>They were missed handoffs. Incomplete information. Slow follow-up. Repetitive calls. Inspection evidence that had to be interpreted. Approvals sitting in someone’s inbox. Work moving between residents, managers, owners, vendors, and field teams.</p>
            <p>That is why I build around workflows first. AI is useful when it understands the operation, has the right context, and can move real work forward without making the process harder for people.</p>
          </div>
          <blockquote>
            “My advantage is knowing what the software is supposed to accomplish before I start building it.”
          </blockquote>
        </section>

        <section id="scene-4" className="story-scene" aria-labelledby="scene-4-title">
          <div className="story-scene-number">Scene 04</div>
          <div className="story-heading-row">
            <div>
              <p className="story-eyebrow">Selected systems</p>
              <h2 id="scene-4-title">I started building the tools I wished operations teams had.</h2>
            </div>
            <p className="story-section-intro">Each product starts from a real operational problem and focuses on turning information into a clear next action.</p>
          </div>

          <div className="story-project-grid">
            {primaryProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} featured={project.slug === "visionops"} />
            ))}
          </div>

          <div className="story-supporting">
            <p className="story-supporting-label">The broader system</p>
            <div className="story-supporting-grid">
              {supportingProjects.map((project) => (
                <article key={project.slug}>
                  <h3>{project.name}</h3>
                  <p>{project.value}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="scene-5" className="story-scene" aria-labelledby="scene-5-title">
          <div className="story-scene-number">Scene 05</div>
          <p className="story-eyebrow">How I build</p>
          <h2 id="scene-5-title">The process stays simple.</h2>
          <div className="story-principles">
            {buildPrinciples.map((principle) => (
              <article key={principle.number}>
                <span>{principle.number}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </article>
            ))}
          </div>

          <div className="story-capability-summary">
            <p className="story-eyebrow">Technical range</p>
            <p>React · JavaScript · Three.js · React Three Fiber · Python · FastAPI · PostgreSQL · Supabase · Git · GitHub · LLM integrations · AI agents · voice AI · computer vision · workflow automation</p>
          </div>
        </section>

        <section id="scene-6" className="story-scene story-contact" aria-labelledby="scene-6-title">
          <div className="story-scene-number">Scene 06</div>
          <p className="story-eyebrow">What comes next</p>
          <h2 id="scene-6-title">I want to keep solving real operational problems with better systems.</h2>
          <p className="story-contact-copy">I bring the perspective of someone who has worked inside the operation and then learned how to build the technology around it.</p>
          <div className="story-contact-actions">
            {portfolioLinks.github && (
              <a href={portfolioLinks.github} target="_blank" rel="noopener noreferrer" className="story-button">View GitHub</a>
            )}
            {portfolioLinks.linkedin && (
              <a href={portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer" className="story-text-link">LinkedIn ↗</a>
            )}
            {portfolioLinks.email && <a href={`mailto:${portfolioLinks.email}`} className="story-text-link">Email ↗</a>}
          </div>
        </section>
      </main>

      <footer className="story-footer">
        <span>Walter Thornton</span>
        <span>Real Estate Operations × AI Product Builder</span>
      </footer>
    </div>
  );
}
