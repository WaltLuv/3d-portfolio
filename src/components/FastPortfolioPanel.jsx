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
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        requestAnimationFrame(() => triggerRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll("a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])")];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyboard);
    };
  }, [open]);

  const closePanel = (restoreFocus = false) => {
    setOpen(false);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <button ref={triggerRef} type="button" className="world-control fast-view-trigger" aria-expanded={open} aria-controls="fast-portfolio-panel" onClick={() => setOpen(true)}>
        <span className="world-control-dot" />Fast View
      </button>
      {open && <button type="button" className="fast-view-backdrop" aria-label="Close professional view" onClick={() => closePanel(true)} />}
      <aside ref={panelRef} id="fast-portfolio-panel" role="dialog" aria-modal="true" aria-labelledby="fast-panel-title" className={`fast-portfolio-panel ${open ? "is-open" : ""}`} aria-hidden={!open} inert={!open}>
        <header>
          <div><span>Professional Index</span><strong id="fast-panel-title">Walter Thornton</strong></div>
          <button ref={closeRef} type="button" onClick={() => closePanel(true)}>Close</button>
        </header>
        <p>{professionalSummary}</p>
        <nav aria-label="Fast professional navigation">
          {directSections.map(([label, href]) => <a key={href} href={href} onClick={() => closePanel()}>{label}<span>↘</span></a>)}
        </nav>
        <section aria-labelledby="fast-products-title">
          <h2 id="fast-products-title">Connected Ecosystem</h2>
          <div className="fast-product-list">
            {portfolioProjects.map((product) => (
              <div key={product.slug}>
                <a href={`#${product.slug}`} onClick={() => closePanel()}><b>{product.name}</b><span>{product.role}</span></a>
                {product.landingPage && <a className="fast-external-link" href={product.landingPage} target="_blank" rel="noopener noreferrer">{product.ctaLabel} ↗</a>}
              </div>
            ))}
          </div>
        </section>
        <section aria-labelledby="fast-chapters-title">
          <h2 id="fast-chapters-title">Owner Review Chapters</h2>
          <nav className="fast-chapter-list" aria-label="World chapter navigation">
            {reviewChapters.map(([label, href]) => <a key={href} href={href} onClick={() => closePanel()}>{label}<span>↓</span></a>)}
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
