# Master Build Brief — Walter Thornton 3D Portfolio

## Mission

Codex owns the final creative and technical outcome for this portfolio.

The task is not to rebuild from scratch. It is to take the current successful persistent-world implementation and elevate it into an immersive, cinematic, game-like real-estate AI world while preserving the professional portfolio and working engineering foundation.

The desired reaction is:

> I've never seen a real-estate AI portfolio presented like this.

## Experience quality references

Study the experience principles—not the exact graphics—of:

- https://www.igloo.inc/
- https://bruno-simon.com/
- https://www.maximeguillon.com/
- https://orpetron.com/sites/maximes-portfolio/
- https://basement.studio/
- https://orpetron.com/sites/basement-studio-2/

Learn from their:
- immersive worldbuilding
- cinematic motion
- environmental storytelling
- game-like interaction
- camera choreography
- pacing
- microinteractions
- discovery
- art direction
- optional sound
- visual polish

Do not copy them.

## The defining concept

The portfolio is the cinematic, interactive portfolio version of the 3D PropControl Empire universe.

PropControl Empire is the WORLD.

The ecosystem is what makes the world function:

- PropControl = operate
- VoiceOps = hear
- VisionOps = see
- Workforce OS = coordinate / govern / execute
- Baseline Studios / Arkitech = build and deploy new intelligence

Walter is the recurring builder/guide behind the ecosystem.

The site must not become a PropControl-only story. It must tell the full ecosystem story.

## Signature journey

Preferred high-level journey:

1. Arrival — enter a living real-estate world
2. Walter introduction
3. A real-estate operational problem occurs
4. VoiceOps hears and structures the request
5. PropControl turns the request into operational work
6. VisionOps inspects the physical condition
7. Repair Cost Guide turns findings into repair-cost intelligence / quote
8. Workforce OS reveals the hidden AI workforce coordinating the response
9. Baseline Studios / Arkitech reveals how capabilities and agents are created
10. The capability is deployed back into Workforce OS
11. The operational result returns to PropControl
12. The physical world changes
13. Builder Studio / technology
14. Built From Operations, Not Just Code
15. Contact / final world pullback

The visitor should understand the architecture because they experienced the mission, not because they read a diagram.

## World design

The physical environment should communicate real estate before any AI layer appears.

Use, where appropriate:
- houses
- multifamily property
- roads
- sidewalks
- lots
- landscaping
- streetlights
- property signage
- maintenance/project/inspection props
- vendor/service activity
- builder/workstation environment

Physical world:
- warm
- tactile
- architectural
- believable
- stylized-realistic

AI world:
- holographic cyan / blue
- controlled violet
- scanning
- data movement
- computer-vision markers
- task paths
- dimensional annotations

Do not make the entire world blue.

## Persistent world architecture

Preserve and improve the merged persistent-world approach.

Prefer one primary R3F/Three.js world with coordinated chapter/world states rather than a pile of disconnected Canvases.

Centralize world progression where practical instead of scattering arbitrary scroll percentages throughout components.

The camera moves through the world; the site should not feel like it keeps replacing the world with unrelated sections.

## Camera and game feel

Treat camera work like cinematography.

Use intentional establishing shots, push-ins, tracking, close inspection, flythroughs, reveals, pullbacks, and pauses.

Primary navigation is scroll.

Secondary interaction can include pointer parallax, hover, tap/click, limited orbit/drag, property/inspection interactions, and optional WASD in designated exploration moments.

Never require game controls to understand the portfolio.

## Walter AI twin

Walter should eventually exist as a recurring 3D protagonist/guide at realistic world scale.

Preferred asset: `walter-ai-twin.glb`.

Do not ship an uncanny low-quality fake character merely to satisfy the requirement. If a high-quality model cannot be produced, prepare the integration architecture and document the asset dependency.

## VoiceOps

VoiceOps must be gameplay, not a waveform decoration.

Show a call/communication event becoming understood, resolved to property/unit context, prioritized, routed, and converted into real operational work.

VoiceOps means: THE WORLD CAN HEAR.

## PropControl

PropControl is the operating system of the property world.

Show work orders, maintenance, inspections, projects, follow-ups, vendors, owner approvals, property context, and completion affecting the world itself.

PropControl means: THE WORLD CAN OPERATE.

## VisionOps + Repair Cost Guide

VisionOps is a signature visual chapter.

Show Capture → Analyze → Findings → Repair Cost → Action.

Use a property scan, component/finding markers, and clear visual transformation from physical evidence to repair intelligence.

Repair Cost Guide quote/estimate generation is a mandatory signature moment.

VisionOps means: THE WORLD CAN SEE.

## Workforce OS

Workforce OS is a major reveal beneath/behind the physical world.

Show the hidden AI workforce coordinating tasks, agents, workflows, approvals, memory, tools, artifacts, audit, policies, governance, and orchestration.

It must feel spatial/architectural, not like another dashboard or generic neural network.

Workforce OS means: THE WORLD CAN COORDINATE AND EXECUTE.

## Baseline Studios / Arkitech

This is the capability/agent creation layer.

Show Business Problem → Spec Kit → Capability → Agent → Model → Tools → Skills → Memory → Policy → Workflow → Test → Publish → Deploy → Workforce OS.

Make this feel like a sophisticated AI architecture studio / capability factory, not another card grid.

Baseline Studios / Arkitech means: THE WORLD CAN EVOLVE.

## Professional portfolio requirements

The immersive world is the presentation layer, not a replacement for Walter's professional information.

Preserve all verified information already in the portfolio, including About, professional background, experience, How I Build, capabilities, projects, resume, GitHub/verified professional links, and contact.

Use the established positioning and theme:

REAL ESTATE OPERATIONS × AI PRODUCT BUILDER

I TURN REAL-WORLD OPERATIONS INTO AI-POWERED SYSTEMS.

BUILT FROM OPERATIONS, NOT JUST CODE.

Do not invent claims, employers, metrics, clients, URLs, or credentials.

## Recruiter mode + experience mode

Support both:

FULL EXPERIENCE — follow the cinematic journey.

FAST PROFESSIONAL MODE — jump directly to About, Experience, Products, Capabilities, Resume, and Contact.

The site must never punish a recruiter for not wanting to play through the full journey.

## Product landing pages

Each ecosystem product needs a verified external landing-page route:

- PropControl
- VoiceOps
- VisionOps
- Workforce OS
- Baseline Studios / Arkitech

Inside each chapter, support the distinction:

EXPERIENCE PRODUCT = stay inside the portfolio story.

EXPLORE PRODUCT ↗ = open the actual landing page.

Centralize URLs. Never invent a destination. Never use `#` as a fake link. If a URL is not verified, leave it unset and report it.

## Blender / CLI-Anything

Inspect `WaltLuv/CLI-Anything`, including its Codex and Blender skills.

Use Blender only when the actual environment supports it and when it materially improves the result.

The desired pipeline is:

Blender → preview/render critique → GLB → web optimization → R3F → browser verification.

Use Blender for environment assets, materials, composition, props, optimization, lighting studies, and character preparation where justified.

Do not claim Blender work that was not actually performed.

## Performance

Performance engineering is part of the art direction.

Audit draw calls, triangles, materials, texture sizes, GLB size, shadows, postprocessing, particles, DPR, animation loops, React rerenders, and network loading.

Use appropriate optimizations such as instancing, shared materials, optimized GLBs, Meshopt/Draco where justified, texture reduction/KTX2 where worthwhile, LOD, frustum culling, adaptive DPR, selective shadows, lazy loading, and chapter preloading.

Do not optimize by deleting the defining 3D experience.

## Accessibility

Preserve semantic HTML, keyboard navigation, focus states, skip link, contrast, reduced motion, accessible sound controls if sound exists, and DOM-based critical information.

Essential professional/product content must not exist only in WebGL.

## Visual validation

Do not judge success from source code or passing tests alone.

Where visual/browser tooling exists:

build → run → inspect → capture → critique → improve → repeat.

Review Arrival, Walter, VoiceOps, PropControl, VisionOps, Repair Cost Guide, Workforce OS, Baseline Studios / Arkitech, Builder Studio, About, Contact, and Final Pullback.

## Definition of done

The final site must be technically healthy and visually excellent.

A visitor should leave understanding:
- Walter's real-estate operations background matters
- PropControl operates the world
- VoiceOps gives it hearing
- VisionOps gives it sight
- Repair Cost Guide turns evidence into repair economics
- Workforce OS coordinates the AI workforce
- Baseline Studios / Arkitech creates the capabilities
- all systems belong to one strategy
- Walter is the builder behind that strategy

Do not call the project finished merely because lint/build pass. Use the release scorecard and continue improving major categories that fall below the required visual bar.