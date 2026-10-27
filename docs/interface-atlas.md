# Interface Atlas in the portfolio

Reviewed October 13, 2026. The user identifies Interface Atlas as their current frontend knowledge library for coding agents and requested that it replace the complete 20-source shelf.

The description is grounded in the local `D:/Projects/InterfaceAtlas` README, theme catalog, Editorial README and design specification, preparation skill, shared Agent Experience guidance, project template, example notes, source registry, and validation record. The public [repository](https://github.com/tamir39/interface-atlas) and [preview site](https://tamir39.github.io/interface-atlas/) were verified as accessible during this update.

## Supported description

- A frontend UI/UX knowledge library for preparing project-specific design documents.
- One current theme: Editorial, revision `0.1.0-draft`, adapted from this portfolio.
- Guidance for color, typography, spacing, layout, components, accessibility, appearance, motion, and optional effects.
- A preparation workflow that turns selected guidance into a self-contained project design document for implementation agents.
- Portfolio and agent operations design examples, shared guidance for interfaces that expose agent activity and operator controls, and live previews.
- An evolving pilot. Draft specifications and representative preview checks do not establish a completed design system or production-ready agent backend.

The source registry contains external research candidates; their presence does not mean Atlas imports all of their skills or implementations. The portfolio does not claim that its five visual styles are all packaged in Atlas. Original source credits in the portfolio documentation and Atlas's provenance records remain intact.

## Presentation

`lib/interface-atlas.ts` owns the description and verified destinations. `components/InterfaceAtlas.tsx` replaces the shelf with a compact overview and repository/preview links. Exploration chapter disclosures now point to relevant Atlas documents. The Knowledge & practice chapter explains the workflow while preserving the existing poster and scroll behavior. The unused five-skill data and picker were retired.

The Atlas marks in `public/projects/icons/interface-atlas-light.svg` and `interface-atlas-dark.svg` are unchanged copies of the user's original library assets. Their three-plane geometry and padding are preserved; each variant follows the portfolio's selected appearance. The originals are credited to Tamir with Codex AI assistance in [Atlas's brand notes](https://github.com/tamir39/interface-atlas/blob/main/assets/brand/README.md).

Project detail headings use the existing Zuno asset through `components/ProjectLogo.tsx`, alongside its other project mappings. The Twohearts project entry and its logo mapping were removed on October 19, 2026, and The Joi Factory entry and mapping were removed on October 27, 2026, at the user's request. Logos are decorative beside the visible project name. Long titles wrap at narrow widths; projects without a supplied logo continue to display their title normally.
