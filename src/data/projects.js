export const portfolioLinks = {
  github: "https://github.com/WaltLuv",
  linkedin: null,
  email: null,
  resume: null,
};

export const ecosystemMission = {
  title: "Unit 204 · Active Water Leak",
  disclaimer: "Illustrative portfolio mission — no customer data.",
  stages: ["Incoming Call", "Structured Work", "Visual Evidence", "Quote Generated", "Governed Execution", "Capability Deployed"],
};

export const portfolioProjects = [
  {
    id: "01", chapter: "02", journeyStep: 1, slug: "voiceops", name: "VoiceOps", role: "The world can hear.",
    category: "AI Voice Operations",
    value: "Real estate conversations converted into structured action and follow-up.",
    description: "Handles leasing, maintenance, support, and emergency conversations with routing, property context, prioritization, and human escalation.",
    capabilities: ["Maintenance Intake", "Intent", "Property + Unit Context", "Priority", "Routing", "Follow-up"],
    missionFlow: ["Call", "Understand", "Intent", "Unit 204", "Priority", "Route", "Action", "Follow-up"],
    accent: "violet", mark: "VO", visualLabel: "VOICE → OPERATION", landingPage: null, repository: null, status: "Portfolio demonstration", ctaLabel: "Explore VoiceOps",
  },
  {
    id: "02", chapter: "03", journeyStep: 2, slug: "propcontrol", name: "PropControl", role: "The world can operate.",
    category: "AI Real Estate Operations OS",
    value: "One operating layer for the work that keeps residential properties moving.",
    description: "Connects property and unit context with work orders, maintenance, follow-ups, projects, inspections, approvals, vendors, and completion evidence.",
    capabilities: ["Work Orders", "Maintenance", "Projects", "Inspections", "Owner Approvals", "Vendors", "Follow-ups"],
    missionFlow: ["Unit 204", "Work Order", "Priority", "Owner Approval", "Vendor", "Project", "Completion"],
    accent: "cyan", mark: "PC", visualLabel: "PROPERTY OPERATIONS LAYER", landingPage: null, repository: null, status: "Portfolio demonstration", ctaLabel: "Explore PropControl",
  },
  {
    id: "03", chapter: "04", journeyStep: 3, slug: "visionops", name: "VisionOps", role: "The world can see.",
    category: "AI Visual Property Intelligence",
    value: "Property evidence transformed into findings, repair costs, reports, and action.",
    description: "A mobile-oriented inspection system for visual analysis, damage detection, structured evidence, and repair intelligence.",
    capabilities: ["AI Inspections", "Damage Detection", "Structured Findings", "Repair Intelligence", "Owner/Vendor Delivery", "Mobile Workflow"],
    accent: "teal", mark: "VI", visualLabel: "INSPECTION → INTELLIGENCE",
    featured: "Repair Cost Guide quote generation", workflow: ["Capture", "Analyze", "Findings", "Repair Cost", "Action"],
    landingPage: null, repository: null, status: "Portfolio demonstration", ctaLabel: "Explore VisionOps",
  },
  {
    id: "04", chapter: "06", journeyStep: 5, slug: "workforce-os", name: "Workforce OS", role: "The workforce makes the world move.",
    category: "AI Workforce Governance & Execution",
    value: "A controlled execution layer for agents, tasks, approvals, context, artifacts, and audit evidence.",
    description: "Coordinates operational work while keeping ownership, policies, tool use, human approvals, memory, and results observable.",
    capabilities: ["Agents", "Tasks", "Workflows", "Ownership", "Approvals", "Memory", "Tools", "Artifacts", "Audit", "Policies", "Governance", "Orchestration"],
    missionFlow: ["VoiceOps Intake", "Maintenance Task", "Property Context", "VisionOps Evidence", "Repair Cost Artifact", "Human Approval", "Vendor Action", "PropControl Update", "Resident Follow-Up", "Completion", "Audit Evidence"],
    accent: "electric", mark: "WO", visualLabel: "GOVERNED EXECUTION LAYER", landingPage: null, repository: null, status: "Portfolio demonstration", ctaLabel: "Explore Workforce OS",
  },
  {
    id: "05", chapter: "07", journeyStep: 6, slug: "baseline-studios", name: "Baseline Studios / Arkitech", role: "The world can evolve.",
    category: "AI Capability Factory",
    value: "Business requirements translated into structured, reusable AI capabilities.",
    description: "Creates Spec Kits, capability designs, agents, models, tools, skills, memory, policies, workflows, tests, and deployable operational systems.",
    capabilities: ["Business Problem", "Spec Kits", "Capabilities", "Agent Design", "Tools + Skills", "Memory + Policy", "Testing", "Publishing"],
    missionFlow: ["Problem", "Spec Kit", "Capability", "Agent", "Model", "Tools", "Skills", "Memory", "Policy", "Workflow", "Test", "Publish", "Deploy", "Workforce OS"],
    accent: "indigo", mark: "BS", visualLabel: "CAPABILITY FACTORY", landingPage: null, repository: null, status: "Portfolio demonstration", ctaLabel: "Explore Baseline Studios / Arkitech",
  },
];
