export const journeyChapters = [
  { step: 0, id: "hero", label: "Arrival", mission: "World online" },
  { step: 1, id: "voiceops", label: "VoiceOps", mission: "Incoming call understood" },
  { step: 2, id: "propcontrol", label: "PropControl", mission: "Unit 204 work order active" },
  { step: 3, id: "visionops", label: "VisionOps", mission: "Property evidence analyzed" },
  { step: 4, id: "repair-cost-guide", label: "Repair Cost Guide", mission: "Quote artifact generated" },
  { step: 5, id: "workforce-os", label: "Workforce OS", mission: "Governed execution routed" },
  { step: 6, id: "baseline-studios", label: "Baseline / Arkitech", mission: "Capability assembled + deployed" },
  { step: 7, id: "skills", label: "Builder Studio", mission: "Tools behind the ecosystem" },
  { step: 8, id: "experience", label: "Experience", mission: "Operations before automation" },
  { step: 9, id: "about", label: "Built From Operations", mission: "Workflow-first perspective" },
  { step: 10, id: "contact", label: "Contact", mission: "Build something useful" },
  { step: 11, id: "world-end", label: "World Overview", mission: "Mission resolved · audit retained" },
];

export const cameraRoute = [
  { position: [15.5, 8.2, 20.5], target: [0, 1.1, -1.2], fov: 42 },
  { position: [-8.7, 4.1, 8.1], target: [-1.4, 1.45, 1], fov: 41 },
  { position: [7.4, 4.1, 9.2], target: [0, 1.25, 0], fov: 40 },
  { position: [9.2, 3.3, 3.1], target: [4.5, 1.5, -4.1], fov: 39 },
  { position: [8.2, 4.7, -0.8], target: [5.8, 3.25, -2.1], fov: 36 },
  { position: [0.4, 10.8, 12.5], target: [0, -3.2, -1.5], fov: 46 },
  { position: [0.3, 8.4, 7.6], target: [0, -6.35, -1.2], fov: 44 },
  { position: [8.6, 4.4, -9.4], target: [0.2, 1.1, -18], fov: 42 },
  { position: [15.2, 8.4, 17.2], target: [0, 0.7, -5.5], fov: 47 },
  { position: [12.4, 6.8, 15.8], target: [0, 0.5, -4.6], fov: 45 },
  { position: [-4.9, 2.8, -10.6], target: [-6.4, 0.1, -18.1], fov: 39 },
  { position: [18.5, 11.2, 25], target: [0, 0, -5], fov: 49 },
];

export const operationNodes = [
  { label: "WORK ORDER", position: [-5.1, 0.55, 2.5] },
  { label: "PRIORITY", position: [-4.8, 0.55, -2.5] },
  { label: "INSPECTION", position: [-1.8, 0.55, -4.8] },
  { label: "PROJECT", position: [2.1, 0.55, -4.8] },
  { label: "FOLLOW-UP", position: [5.1, 0.55, -2.2] },
  { label: "VENDOR", position: [5.4, 0.55, 2.25] },
  { label: "OWNER APPROVAL", position: [2.2, 0.55, 4.6] },
];

export const workforceNodes = [
  { label: "VOICEOPS INTAKE", type: "input", position: [-6.2, 0.2, 1.8] },
  { label: "MAINTENANCE TASK", type: "auto", position: [-5.1, 0.6, 0.3] },
  { label: "PROPERTY CONTEXT", type: "memory", position: [-3.9, 0.15, -1.2] },
  { label: "VISIONOPS EVIDENCE", type: "artifact", position: [-2.6, 0.65, 0.3] },
  { label: "REPAIR COST ARTIFACT", type: "artifact", position: [-1.25, 0.2, -1.1] },
  { label: "HUMAN APPROVAL", type: "approval", position: [0.2, 0.75, 0.4] },
  { label: "VENDOR ACTION", type: "tool", position: [1.6, 0.2, -1] },
  { label: "PROPCONTROL UPDATE", type: "output", position: [3, 0.65, 0.4] },
  { label: "RESIDENT FOLLOW-UP", type: "output", position: [4.35, 0.15, -0.95] },
  { label: "COMPLETION", type: "output", position: [5.45, 0.65, 0.35] },
  { label: "AUDIT EVIDENCE", type: "artifact", position: [6.4, 0.2, 1.65] },
];

export const baselineNodes = [
  { label: "PROBLEM", position: [-6.2, 0.1, 0.9] },
  { label: "SPEC KIT", position: [-5.15, 0.65, -0.55] },
  { label: "CAPABILITY", position: [-4.05, 0.1, 0.7] },
  { label: "AGENT", position: [-2.95, 0.7, -0.75] },
  { label: "MODEL", position: [-1.85, 0.12, 0.65] },
  { label: "TOOLS", position: [-0.75, 0.72, -0.7] },
  { label: "SKILLS", position: [0.4, 0.12, 0.68] },
  { label: "MEMORY", position: [1.5, 0.72, -0.66] },
  { label: "POLICY", position: [2.6, 0.12, 0.7] },
  { label: "WORKFLOW", position: [3.7, 0.72, -0.72] },
  { label: "TEST", position: [4.75, 0.12, 0.68] },
  { label: "PUBLISH", position: [5.75, 0.68, -0.45] },
  { label: "DEPLOY", position: [6.65, 0.15, 0.6] },
];
