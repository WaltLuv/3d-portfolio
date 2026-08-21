import assetUrl from "../utils/assetUrl";

const navLinks = [
  { name: "World", link: "#hero" },
  { name: "Ecosystem", link: "#work" },
  { name: "Experience", link: "#experience" },
  { name: "Process", link: "#process" },
  { name: "Capabilities", link: "#skills" },
  { name: "About", link: "#about" },
];

const words = [
  { text: "OPERATIONS", imgPath: "/images/concepts.svg" },
  { text: "VOICE", imgPath: "/images/chat.png" },
  { text: "VISION", imgPath: "/images/designs.svg" },
  { text: "AGENTS", imgPath: "/images/code.svg" },
  { text: "AUTOMATION", imgPath: "/images/time.png" },
  { text: "INTELLIGENCE", imgPath: "/images/ideas.svg" },
  { text: "OPERATIONS", imgPath: "/images/concepts.svg" },
  { text: "VOICE", imgPath: "/images/chat.png" },
];

// Retained as empty compatibility exports for tutorial components that are no
// longer rendered. No fabricated clients, employers, metrics, or testimonials.
const counterItems = [];
const logoIconsList = [];
const expCards = [];
const expLogos = [];
const testimonials = [];

const abilities = [
  { imgPath: "/images/seo.png", title: "Workflow First", desc: "Start with the real operation and the people responsible for it." },
  { imgPath: "/images/chat.png", title: "Connected Intelligence", desc: "Connect voice, vision, data, tools, and business rules." },
  { imgPath: "/images/time.png", title: "Useful Systems", desc: "Build software that is understandable, testable, and operationally valuable." },
];

const techStackImgs = [
  { name: "React", imgPath: "/images/logos/react.png" },
  { name: "Python", imgPath: "/images/logos/python.svg" },
  { name: "Node.js", imgPath: "/images/logos/node.png" },
  { name: "Three.js", imgPath: "/images/logos/three.png" },
  { name: "Git", imgPath: "/images/logos/git.svg" },
];

const techStackIcons = [
  { name: "React", modelPath: assetUrl("/models/react_logo-transformed.glb"), scale: 1, rotation: [0, 0, 0] },
  { name: "Python", modelPath: assetUrl("/models/python-transformed.glb"), scale: 0.8, rotation: [0, 0, 0] },
  { name: "Node.js", modelPath: assetUrl("/models/node-transformed.glb"), scale: 5, rotation: [0, -Math.PI / 2, 0] },
  { name: "Three.js", modelPath: assetUrl("/models/three.js-transformed.glb"), scale: 0.05, rotation: [0, 0, 0] },
  { name: "Git", modelPath: assetUrl("/models/git-svg-transformed.glb"), scale: 0.05, rotation: [0, -Math.PI / 4, 0] },
];

const socialImgs = [
  { name: "insta", imgPath: "/images/insta.png" },
  { name: "fb", imgPath: "/images/fb.png" },
  { name: "x", imgPath: "/images/x.png" },
  { name: "linkedin", imgPath: "/images/linkedin.png" },
];

export { words, abilities, logoIconsList, counterItems, expCards, expLogos, testimonials, socialImgs, techStackIcons, techStackImgs, navLinks };
