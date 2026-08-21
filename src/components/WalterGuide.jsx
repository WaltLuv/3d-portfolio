const guideRoles = [
  "Operator", "Automation Builder", "Real Estate Professional", "Property Intelligence Builder",
  "Repair Intelligence Builder", "AI Workforce Architect", "Systems Builder", "Product Engineer",
  "Operations Leader", "Operator + Builder", "Open To Useful Work", "Ecosystem Creator",
];

const WalterGuide = ({ activeStep }) => (
  <aside className={`walter-guide ${activeStep === 0 ? "walter-guide-arrival" : ""}`} aria-label="Walter Thornton, portfolio guide">
    <div className="walter-guide-portrait">
      <img src="/images/walter-ai-guide.webp" alt="Illustrated Walter Thornton digital guide" fetchPriority="high" />
      <span aria-hidden="true" />
    </div>
    <div className="walter-guide-copy">
      <small>Walter / Guide</small>
      <strong>{guideRoles[activeStep] || guideRoles.at(-1)}</strong>
      <span>2D concept · 3D twin ready</span>
    </div>
  </aside>
);

export default WalterGuide;
