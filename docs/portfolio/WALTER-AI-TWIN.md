# Walter Digital AI Twin

Walter is the recurring protagonist and guide, not decoration.

## Role by chapter

Arrival:
Walter the Operator

PropControl:
Walter the Real Estate Professional

VoiceOps:
Walter the Automation Builder

VisionOps:
Walter the Property Intelligence Builder

Workforce OS:
Walter the AI Workforce Architect

Baseline Studios / Arkitech:
Walter the Systems Builder

Ending:
Walter Thornton — creator behind the ecosystem

## Preferred final asset

`walter-ai-twin.glb`

Preferred characteristics:
- professional stylized realism
- web optimized
- rigged if feasible
- PBR materials
- consistent with world scale
- compatible with Three.js AnimationMixer

Preferred animation states:
- Idle
- Welcome
- Walk
- PointProperty
- Explain
- Inspect
- Tablet
- Goodbye

## Visual identity reference

Use the supplied digital-twin reference image as the identity/art-direction reference. The established visual direction is a charismatic African-American professional with short hair, a well-groomed beard, and an upscale dark patterned three-piece suit with a white shirt, deep burgundy tie, tie bar, and burgundy pocket square.

Do not fabricate an inaccurate likeness from inadequate data and present it as final.

## Important quality rule

Do not create a crude primitive humanoid or uncanny low-quality character merely to check a box.

Do not pretend a flat PNG is a true 3D character.

If a proper asset cannot be produced at sufficient quality:
- create the integration architecture
- define world positions
- define the animation-state API
- define the asset contract
- document what asset is still required

## Reusable component

Prefer one character system controlled by world state rather than duplicated characters across chapters.

Conceptually:

`<WalterTwin state="welcome" position={...} rotation={...} />`

Use animation crossfades when clips exist.

## Scale and lighting

Walter should:
- match the physical environment scale
- stand correctly on surfaces
- receive the same world lighting as surrounding geometry
- cast an appropriate shadow where performance permits
- never look pasted into the scene

## Mobile

Retain Walter as part of the story where feasible, using lower-cost rendering, reduced texture resolution, fewer animation states, and reduced shadows rather than automatically removing him.