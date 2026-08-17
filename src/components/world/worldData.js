export const journeyChapters = [
  { step: 0, id: "hero", label: "Arrival" },
  { step: 1, id: "propcontrol", label: "PropControl" },
  { step: 2, id: "voiceops", label: "VoiceOps" },
  { step: 3, id: "visionops", label: "VisionOps" },
  { step: 4, id: "baseline-studios", label: "Baseline Studios" },
  { step: 5, id: "skills", label: "Builder Studio" },
  { step: 6, id: "about", label: "Built From Operations" },
  { step: 7, id: "contact", label: "Contact" },
  { step: 8, id: "world-end", label: "World Overview" },
];

export const cameraRoute = [
  { position: [15.5, 8.2, 20.5], target: [0, 1.1, -1.2], fov: 42 },
  { position: [7.4, 4.1, 9.2], target: [0, 1.25, 0], fov: 40 },
  { position: [-8.2, 3.8, 7.4], target: [-0.6, 1.35, 0.4], fov: 41 },
  { position: [9.2, 3.3, 3.1], target: [4.5, 1.5, -4.1], fov: 39 },
  { position: [0.4, 11.5, 12.5], target: [0, -2.2, -1.5], fov: 46 },
  { position: [8.6, 4.4, -9.4], target: [0.2, 1.1, -18], fov: 42 },
  { position: [15.2, 8.4, 17.2], target: [0, 0.7, -5.5], fov: 47 },
  { position: [-4.9, 2.8, -10.6], target: [-6.4, 0.1, -18.1], fov: 39 },
  { position: [18.5, 11.2, 25], target: [0, 0, -5], fov: 49 },
];

export const operationNodes = [
  { label: "WORK ORDERS", position: [-5.1, 0.55, 2.5] },
  { label: "MAINTENANCE", position: [-4.8, 0.55, -2.5] },
  { label: "INSPECTIONS", position: [-1.8, 0.55, -4.8] },
  { label: "PROJECTS", position: [2.1, 0.55, -4.8] },
  { label: "FOLLOW-UPS", position: [5.1, 0.55, -2.2] },
  { label: "VENDORS", position: [5.4, 0.55, 2.25] },
  { label: "OWNER APPROVALS", position: [2.2, 0.55, 4.6] },
];

export const baselineNodes = [
  { label: "BUSINESS PROBLEM", position: [-5.2, 0.2, 0] },
  { label: "SPEC KIT", position: [-3.5, 0.75, -1.4] },
  { label: "AGENT", position: [-1.65, 0.2, 0.6] },
  { label: "TOOLS", position: [0.15, 0.8, -1] },
  { label: "SKILLS", position: [2, 0.2, 0.7] },
  { label: "WORKFLOW", position: [3.7, 0.8, -1.1] },
  { label: "DEPLOY", position: [5.45, 0.2, 0] },
];
