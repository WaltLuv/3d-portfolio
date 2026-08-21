import { useEffect, useRef, useState } from "react";

import { portfolioLinks, portfolioProjects } from "../data/projects";
import { professionalSummary } from "../data/profile";

const directSections = [["Ecosystem", "#work"], ["Experience", "#experience"], ["Capabilities", "#skills"], ["About", "#about"], ["Contact", "#contact"]];

const reviewChapters = [
  ["Arrival", "#hero"],
  ["VoiceOps", "#voiceops"],
  ["PropControl", "#propcontrol"],
  ["VisionOps", "#visionops"],
  ["Repair Cost", "#repair-cost-guide"],
  ["Workforce OS", "#workforce-os"],
  ["Baseline / Arkitech", "#baseline-studios"],
  ["Builder Studio", "#skills"],
  ["Built From Operations", "#about"],
  ["Contact", "#contact"],
  ["Final Pullback", "#world-end"],
];

const FastPortfolioPanel = () => {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const closeOnEscape = (event) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  return (
    <>
      <button type="button" className="world-control fast-view-trigger" aria-expanded={open} aria-controls="fast-portfolio-panel" onClick={() => setOpen(true)}>
        <span className="world-control-dot" />Fast View
      </button>
      {open && <button type="button" className="fast-view-backdrop" aria-label="Close professional view" onClick={() => setOpen(false)} />}
      <aside id="fast-portfolio-panel" className={`fast-portfolio-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={open ? undefined : ""}>
        <header>
          <div><span>Professional Index</span><strong>Walter Thornton</strong></div>
          <button ref={closeRef} type="button" onClick={() => setOpen(false)}>Close</button>
        </header>
        <p>{professionalSummary}</p>
        <nav aria-label="Fast professional navigation">
          {directSections.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<span>↘</span></a>)}
        </nav>
        <section aria-labelledby="fast-products-title">
          <h2 id="fast-products-title">Connected Ecosystem</h2>
          <div className="fast-product-list">
            {portfolioProjects.map((product) => (
              <div key={product.slug}>
                <a href={`#${product.slug}`} onClick={() => setOpen(false)}><b>{product.name}</b><span>{product.role}</span></a>
                {product.landingPage && <a className="fast-external-link" href={product.landingPage} target="_blank" rel="noopener noreferrer">{product.ctaLabel} ↗</a>}
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="fast-chapters-title">
          <h2 id="fast-chapters-title">Owner Review Chapters</h2>
          <nav className="fast-chapter-list" aria-label="World chapter navigation">
            {reviewChapters.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<span>↓</span></a>)}
          </nav>
        </section>
        <footer>
          <a href={portfolioLinks.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          {portfolioLinks.resume ? <a href={portfolioLinks.resume}>Resume ↗</a> : <span>Resume link awaiting verified asset</span>}
        </footer>
      </aside>
    </>
  );
};

export default FastPortfolioPanel;
