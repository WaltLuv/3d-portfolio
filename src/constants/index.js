const navLinks = [
  { name: "Work", link: "#work" },
  { name: "Experience", link: "#experience" },
  { name: "Skills", link: "#skills" },
  { name: "Approach", link: "#testimonials" },
];

const words = [
  { text: "Operations", imgPath: "/images/concepts.svg" },
  { text: "Voice", imgPath: "/images/chat.png" },
  { text: "Vision", imgPath: "/images/designs.svg" },
  { text: "Agents", imgPath: "/images/code.svg" },
  { text: "Automation", imgPath: "/images/time.png" },
  { text: "Intelligence", imgPath: "/images/ideas.svg" },
  { text: "Operations", imgPath: "/images/concepts.svg" },
  { text: "Voice", imgPath: "/images/chat.png" },
];

const counterItems = [
  { value: 13, suffix: "+", label: "Years in Operations" },
  { value: 5, suffix: "", label: "Core AI Systems" },
  { value: 3, suffix: "", label: "AI Focus Areas" },
  { value: 1, suffix: "", label: "Real Estate Domain" },
];

const logoIconsList = [
  { name: "React", imgPath: "/images/logos/react.png" },
  { name: "Python", imgPath: "/images/logos/python.svg" },
  { name: "Node.js", imgPath: "/images/logos/node.png" },
  { name: "Three.js", imgPath: "/images/logos/three.png" },
  { name: "Git", imgPath: "/images/logos/git.svg" },
];

const abilities = [
  {
    imgPath: "/images/concepts.svg",
    title: "Workforce OS",
    desc: "AI workforce governance and execution for agents, tasks, workflows, approvals, memory, artifacts, and orchestration.",
  },
  {
    imgPath: "/images/code.svg",
    title: "Baseline Studios / Arkitech",
    desc: "A capability-building layer for turning business problems into structured agents, tools, skills, workflows, and deployable systems.",
  },
  {
    imgPath: "/images/time.png",
    title: "Built From Operations",
    desc: "My product thinking starts with real property workflows, maintenance, leasing, documentation, communication, and execution.",
  },
];

const techStackImgs = [
  { name: "React", imgPath: "/images/logos/react.png" },
  { name: "Python", imgPath: "/images/logos/python.svg" },
  { name: "Node.js", imgPath: "/images/logos/node.png" },
  { name: "Three.js", imgPath: "/images/logos/three.png" },
  { name: "Git", imgPath: "/images/logos/git.svg" },
];

const techStackIcons = [
  { name: "React", modelPath: "/models/react_logo-transformed.glb", scale: 1, rotation: [0, 0, 0] },
  { name: "Python", modelPath: "/models/python-transformed.glb", scale: 0.8, rotation: [0, 0, 0] },
  { name: "Node.js", modelPath: "/models/node-transformed.glb", scale: 5, rotation: [0, -Math.PI / 2, 0] },
  { name: "Three.js", modelPath: "/models/three.js-transformed.glb", scale: 0.05, rotation: [0, 0, 0] },
  { name: "Git", modelPath: "/models/git-svg-transformed.glb", scale: 0.05, rotation: [0, -Math.PI / 4, 0] },
];

const expCards = [
  {
    review: "Property operations, field coordination, maintenance, leasing, vendor, owner, and resident workflows.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/fav.png",
    title: "Property Manager & Field Manager — 10X Property Management",
    date: "2023 - 2026",
    responsibilities: [
      "Managed property and field operations across maintenance, leasing, inspections, vendors, owners, and residents.",
      "Coordinated repairs, property readiness, work delegation, and issue follow-through.",
      "Used hands-on operational experience to identify workflows that can be improved with AI and automation.",
    ],
    showStars: false,
  },
  {
    review: "Leasing operations, customer experience, property readiness, and process coordination.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/fav.png",
    title: "Leasing Manager — Haven Residential",
    date: "2021 - 2023",
    responsibilities: [
      "Managed leasing workflows, prospect communication, tours, follow-up, and property readiness.",
      "Coordinated with operational teams to support move-ins and resident experience.",
      "Worked across high-volume communication and documentation processes that shaped later automation ideas.",
    ],
    showStars: false,
  },
  {
    review: "Operational execution, team coordination, customer service, documentation, and compliance workflows.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/fav.png",
    title: "Operations Manager — Cash America",
    date: "2018 - 2021",
    responsibilities: [
      "Managed day-to-day operations, workflow execution, customer service, and team coordination.",
      "Maintained documentation and process consistency in a compliance-focused environment.",
      "Built practical experience in operational problem-solving, prioritization, and accountability.",
    ],
    showStars: false,
  },
  {
    review: "Loan-file coordination, documentation accuracy, stakeholder communication, and processing support.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/fav.png",
    title: "Loan Processor — American Bank",
    date: "2017 - 2018",
    responsibilities: [
      "Coordinated loan documentation and processing workflows.",
      "Supported communication between borrowers, internal stakeholders, and required documentation steps.",
      "Focused on file accuracy, completeness, and timely progression through the process.",
    ],
    showStars: false,
  },
  {
    review: "Residential property management, leasing, maintenance coordination, and resident communication.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/fav.png",
    title: "Property Manager — Rickert Property Management",
    date: "2014 - 2017",
    responsibilities: [
      "Managed residential property operations including leasing, maintenance coordination, and resident communication.",
      "Worked with vendors and property stakeholders to keep day-to-day operations moving.",
      "Developed the real-estate operations foundation that now informs my AI product work.",
    ],
    showStars: false,
  },
];

const expLogos = [];

const testimonials = [
  {
    name: "01",
    mentions: "Start With The Workflow",
    review: "Understand what people actually do before deciding where AI belongs.",
    imgPath: "/images/concepts.svg",
    showStars: false,
  },
  {
    name: "02",
    mentions: "Find The Repetition",
    review: "Identify repetitive work, bottlenecks, communication overhead, and operational friction.",
    imgPath: "/images/time.png",
    showStars: false,
  },
  {
    name: "03",
    mentions: "Give AI The Right Tools",
    review: "Connect models to data, APIs, skills, memory, voice, vision, workflows, and business rules.",
    imgPath: "/images/code.svg",
    showStars: false,
  },
  {
    name: "04",
    mentions: "Build For The Real Operation",
    review: "Make the result useful, understandable, observable, testable, and maintainable.",
    imgPath: "/images/designs.svg",
    showStars: false,
  },
];

const socialImgs = [
  { name: "GitHub", imgPath: "/images/logos/git.svg", url: "https://github.com/WaltLuv" },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};
