# Blender / CLI-Anything Pipeline

Tooling repository:
`WaltLuv/CLI-Anything`

Before Blender work, inspect:
- `codex-skill/SKILL.md`
- `skills/cli-anything-blender/SKILL.md`

Verify actual availability:
- `blender --version`
- `cli-anything-blender --help`

Do not claim Blender use unless those capabilities are actually available.

## Pipeline

Blender
→ Model / Modify
→ Real Preview
→ Visual Critique
→ Adjust
→ Export GLB
→ Web Optimize
→ React Three Fiber
→ Browser Verify

## Good Blender uses

Where valuable:
- houses
- multifamily buildings
- roads
- sidewalks
- driveways
- landscaping
- maintenance / inspection props
- vendor/service objects
- streetlights
- property signage
- studio/workstation
- environment composition
- materials
- geometry cleanup
- UV work
- simple animation preparation
- LOD preparation
- lighting and camera-composition studies

## Do not

- model unseen detail
- create giant monolithic GLBs without a runtime reason
- use unnecessary 4K textures
- create hundreds of unique materials
- create geometry merely because Blender exists
- infer that a scene looks good just because a command succeeded

## Preview loop

For meaningful work:

change
→ preview capture
→ inspect real render
→ critique
→ adjust
→ preview again

Use absolute paths where required by the Blender skill.

When the Blender CLI provides preview bundle/live-preview functionality, use it for truthful visual checkpoints rather than relying solely on JSON scene state.

## World composition studies

Check at least these views where Blender materially contributes to the scene:
1. Arrival establishing shot
2. Walter introduction area
3. PropControl property
4. VoiceOps event area
5. VisionOps inspection property
6. Workforce OS transition point
7. Builder Studio
8. Final world pullback

Each view should have a clear focal point, useful foreground/midground/background, believable scale, and useful negative space for accessible HTML typography.

## Export

Preserve `.blend` source files.
Use logical object and collection names.
Keep GLBs optimized for web runtime.

Potential organization, adjusted to existing repo conventions as needed:
- `assets/blender/source/`
- `public/models/world/`
- `public/models/props/`
- `public/models/characters/`

## Reporting

Report:
- Blender availability
- CLI-Anything availability
- assets reused
- assets created
- assets modified
- `.blend` files
- exported GLBs
- triangle counts
- material counts
- texture sizes
- preview artifacts
- optimization work
- R3F integration
- remaining limitations