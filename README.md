# Walter Thornton — Interactive AI Real Estate Portfolio

An employer-facing portfolio built as one persistent, scroll-directed 3D world. A single Unit 204 water-leak mission moves through Walter Thornton's connected real-estate AI ecosystem:

**VoiceOps → PropControl → VisionOps → Repair Cost Guide → Workforce OS → Baseline Studios / Arkitech → resolved property**

The experience uses physical places—a residential neighborhood, Unit 204, an inspection scene, a concrete service corridor, an AI capability workshop, and a builder studio—instead of presenting the products as disconnected cards or dashboards.

## Experience

- Persistent React Three Fiber world with GSAP-driven camera choreography
- VoiceOps communication becoming structured property work
- PropControl operational response inside the property environment
- VisionOps architectural scan and structured finding sequence
- Repair Cost Guide represented as a recognizable repair-estimate artifact
- Workforce OS represented as the operations infrastructure beneath the neighborhood
- Baseline Studios / Arkitech represented as a physical capability workshop
- Fast View for direct recruiter access to professional information and product chapters
- Intentional non-WebGL editorial fallback
- Mobile, reduced-motion, keyboard, semantic HTML, and graceful contact fallbacks

## Stack

- React 19 and Vite
- Three.js, React Three Fiber, and Drei
- GSAP and ScrollTrigger
- Tailwind CSS
- EmailJS (optional and environment-configured)

## Run locally

```bash
git clone https://github.com/WaltLuv/3d-portfolio.git
cd 3d-portfolio
npm install
npm run dev
```

Vite prints the local URL after startup, normally `http://localhost:5173`.

## Validation

```bash
npm run lint
npm run build
```

## Optional environment variables

The portfolio does not require secrets to build or deploy. The contact form activates only when all EmailJS values are configured:

```env
VITE_APP_EMAILJS_SERVICE_ID=
VITE_APP_EMAILJS_TEMPLATE_ID=
VITE_APP_EMAILJS_PUBLIC_KEY=
```

A future production Walter character can be enabled only after a verified `/public/models/walter-ai-twin.glb` asset exists:

```env
VITE_ENABLE_WALTER_TWIN=true
```

The current build never requests or fabricates that missing model.

## Deployment

The repository includes `netlify.toml` for the existing Vite deployment. EmailJS credentials remain optional environment variables and are never committed.

## Verified destinations

- GitHub: [WaltLuv](https://github.com/WaltLuv)

Product landing pages, LinkedIn, direct email, and résumé actions remain data-driven and hidden until verified destinations are supplied. No placeholder links are rendered.

## Upstream credit

This portfolio began from the JavaScript Mastery 3D portfolio tutorial structure by Adrian Hajdin. The current implementation retains and re-themes selected original room, computer, and technology-model assets while replacing the tutorial identity, content, layout, and narrative experience. See [JavaScript Mastery](https://www.youtube.com/@javascriptmastery/videos) for the original educational material.
