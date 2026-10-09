# Tamir — UI/UX & Frontend

A portfolio and interactive design lab for Tamir (Phi Vuong Tuong Tam), with five visual styles and light, dark, or system appearance. Built with Next.js App Router, TypeScript, Tailwind CSS v4, and Lucide icons.

## Run locally on Windows

Double-click `run.bat`. The launcher checks Node.js 20+, installs missing dependencies, and selects a free port starting at **5260**. It shows desktop and phone/LAN URLs and keeps startup errors visible. It never kills existing processes or starts sibling backends or Docker services.

To use another starting port: `run.bat 5300`. Reserved Twohearts/Whitelable ports and Mission Control's fallback range are skipped. Ctrl+C stops the foreground portfolio server.

For mobile testing, open the printed **Phone/LAN** URL on a phone connected to the same local network. The launcher prefers Wi-Fi, then Ethernet, and excludes VPN/virtual adapters such as Radmin. The server listens on all interfaces. If the correct URL still cannot connect, check that neither device uses an isolated guest network and that Windows Firewall permits Node.js on your trusted private network; do not disable the firewall.

To choose a specific active adapter address, run `powershell -NoProfile -ExecutionPolicy Bypass -File .\run-local.ps1 -LanAddress 192.168.1.15` with your computer's current local address. `PORTFOLIO_LAN_IP` provides the same override. Local addresses can change when reconnecting to Wi-Fi. `-CheckOnly` prints the next available port without starting a server; an already-running preview keeps its original port.

Check prerequisites without starting the server:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\run-local.ps1 -CheckOnly
```

Manual development:

```bash
npm ci
npm run dev -- --port 5260
npm run typecheck
npm run build
```

## Structure

- `app/page.tsx` and `components/Portfolio.tsx`: homepage, selected work, about, and approach.
- `app/missions/[slug]/page.tsx`: project detail pages.
- `components/layout/`: shared navigation and contact footer.
- `lib/data/portfolio-projects.ts`: featured project images.
- `lib/data/projects.ts`: project details and links.
- `public/`: project images and the current frontend/UI/UX resume (`PHI_VUONG_TUONG_TAM_FRONTEND_RESUME.pdf`), linked from About. The original `PHIVUONGTUONGTAM_RESUME.pdf` is preserved. Editable generation source is `output/pdf/build_resume.py`.
- `app/globals.css` and `app/themes.css`: shared tokens, five art directions, and responsive styles.

Homepage copy and project descriptions are a starting point based on the existing portfolio and should be kept current as projects evolve.

## Theme studio

Fresh homepage visits show the animated logo loader while the first screen becomes ready, followed by the logo and Tamir intro. The hero appears fully visible as the intro clears. Loading, error, and missing-page states share the brand identity. Reduced motion keeps loading static and skips the intro; Escape and the on-screen controls let visitors enter immediately. See `docs/hero-artwork.md` for readiness and motion behavior.

The bottom-left Appearance dock offers Editorial, Swiss, Blueprint, Play, and Botanical styles in a compact tray. Click, Enter/Space, Escape, and outside dismissal are supported; desktop hover also opens it. Themes and display preferences share a row on desktop, while mobile puts preferences below the themes. Each style has its own light and dark palette. System mode follows live device changes. The Playground introduces styles with a visible mood challenge. Styles change colors, typography, geometry, interaction motion, and the decorative cursor. Desktop page/background taps advance through Editorial → Swiss → Blueprint → Play → Botanical → Editorial, preserving the current light/dark/system preference. Buttons, links, forms, text selection, scrolling, and dragging retain their normal behavior; choosing a swatch selects that style directly. Preferences survive navigation and reloads and sync across tabs. The pre-paint script restores the palette before hydration and follows system appearance when storage is blocked. The original transparent cat silhouette takes the palette’s accent color, and circular favicons adapt to the same choice.

After the intro on each reload, the cat crosses a centered hero heading and taps through the remaining themes. Headings type in after each reveal. The profile stays hidden during the lap, then settles into place and reveals its copy. Scrolling or direct interaction ends the lap without moving the cat abruptly or waiting for a visitor choice. On mobile and desktop, the incoming viewport appears inside the original 560ms expanding circle with its accent at the edge. Hidden hero/studio artwork defers theme updates until it enters view, and scroll entrance observers survive theme changes. Reduced motion applies the theme immediately. Ordinary cat comments close after 5–7 seconds and pause dismissal on hover or keyboard focus. On phones, a brief four-second visit to the middle ends with a smooth return to a clear margin. See `docs/cat-companion.md` for the behavior, cancellation rules, and regression checks.

- `lib/themes.ts`: theme names, hero copy, entrance styles, and Motion transitions.
- `lib/appearance.ts` and `app/appearance.css`: independent appearance preferences, pre-paint initialization, dark palettes, and the floating palette.
- `components/providers/ThemeProvider.tsx`: style and appearance state, live system preference, persistence, browser theme color, adaptive favicon, and shared reduced-motion behavior.
- `components/AppearanceDock.tsx`: a bottom-left hover/click tray with five swatches, a sun/moon/system pill, and a motion button. Its geometry stays consistent across themes.
- `components/ThemeSwitcher.tsx`: reusable style comparison controls.
- `components/HeroArtwork.tsx`, `lib/hero-artwork.ts`, and `app/hero-artwork.css`: desktop-only floating paths, kinetic grid, projected wireframes, physics spheres, and living contours. Hover and click effects follow the selected palette. Artwork clicks do not cycle themes; Enter/Space activates the same effects. Motion pauses offscreen, in hidden tabs, or through the existing motion preference. Mobile retains the content-first hero. References and lifecycle details are in `docs/hero-artwork.md`.
- `components/ThemeCursor.tsx` and `app/cursors.css`: halo, precision square, drafting crosshair, star trail, and leaf followers. The native pointer remains available. Decorations never intercept clicks, hide during keyboard input and text entry, and are disabled for coarse pointers, reduced motion, and motion pause. Animation frames stop when the pointer settles.
- `components/layout/Header.tsx` and `app/header.css`: viewport-following navigation with the adaptive logo and avatar. Downward scrolling retracts the header behind a 44px hover area. Hovering it, scrolling upward, or keyboard focus reveals navigation. Coarse-pointer/touch devices retain a visible header. Small viewports use a navigation disclosure; Escape dismisses it and restores trigger focus.
- `app/themes.css`: palette and geometry tokens, typography treatments, responsive theme controls, and CSS interactions.

Theme buttons support Tab and Enter/Space. Motion respects the operating system's reduced-motion preference; the pause control also disables CSS transitions, Motion transitions, and animated drag behavior. The studio note supports dragging or arrow-key movement, with Enter/Space to reset.

Run `node output/verify-appearance.cjs` for preference lifecycle and all ten palette contrast checks. `node output/build-theme-favicons.cjs` regenerates the 64px favicons from the supplied monochrome logo after palette changes. Each favicon has a contrasting circular background with transparent corners and inner padding to keep the silhouette clear on light, dark, and colored browser tabs.

Visual direction was informed by [DESIGN.md directory](https://designdotmd.directory/) and [Design Prompts](https://www.designprompts.dev/). Animation patterns reference the [Motion documentation](https://motion.dev/docs/react-animation). The implementation is original and uses the installed Framer Motion package without adding a new animation dependency.

## Interaction lab

The homepage opens with six original interactive studies in `components/InteractionLab.tsx`: save feedback, shared selection, progressive disclosure, target sizing, proximity, and dragging. Demo state is preserved when changing themes. Reference links point to Motion and Laws of UX; the inspiration sources are available in a disclosure below the lab.

Selected work includes 100b.studio, Twohearts.vn, Joi.vn, Zuno, and EnStudy-Hub (public alpha), plus a Panic Hub hackathon feature with its YouTube trailer and a project page. The verified competition and frontend role are documented in `docs/panic-hub-sources.md`. Website projects include direct website links and internal project details. The previous cosmic prototype remains in source but is not loaded by the homepage.

Development output lives in `.next-dev`, separate from production `.next`, so builds do not overwrite the preview cache.

Academic work is grouped separately in `components/AcademicWork.tsx`, with Point of Sale and CausaSent featured, plus LawMate and the ongoing Reconia project. Data lives in `lib/data/academic-projects.ts`; evidence and status boundaries are in `docs/academic-project-sources.md`. VNM/VN30 and Android UI studies were removed at the user's request.

`components/IndependentWork.tsx` presents Moza (Frontend prototype), SelfNest (Local MVP), and Educata (Frontend prototype) in a slideshow. Data lives in `lib/data/independent-projects.ts`; implementation evidence is in `docs/independent-project-sources.md`. These entries do not imply a public launch. EnStudy-Hub's live alpha belongs to Selected work, with its case data in `lib/data/projects.ts`. All project pages lead with their deliverable, a prominent contribution or project-focus summary, and explicit highlight headings. Tamir is the public name across the header, hero, About card, footer, page metadata and share image; the full name remains in the About introduction.

The shared `components/Portrait.tsx` preserves the avatar crop without a CSS scale transform. Only the About card's decorative surface rotates, keeping the portrait and text upright. On desktop viewports at least 1024px wide and 560px tall, the profile follows scrolling within the About section. Its top offset adapts from 16px to 96px so shorter windows and browser zoom retain the behavior without hiding the resume link. Phones and windows under 560px tall retain normal document flow. The section uses overflow clipping without creating a nested scroll container, so sticky positioning stays attached to the page viewport.

Independent-project detail pages include interactive sample-data mockups in `components/ProjectMockup.tsx`, with fixtures in `lib/data/mockups.ts` and scoped styles in `app/mockups.css`. Homepage cards remain compact summaries linking to those details. Try SelfNest check-ins/routines, EnStudy-Hub flashcards/ratings, and Educata lessons/roles. They use local component state and include resets; no live app connection is required. Source revisions and pull limitations are recorded in `docs/independent-project-sources.md`.

Academic detail pages for Point of Sale, CausaSent, and LawMate include conceptual, sample-data motion stories in `components/AcademicMotionDemo.tsx`, styled in `app/academic-motion.css`. Playback starts only on request, supports stage selection, pause, replay, and reset, and stops offscreen or when motion is reduced. Homepage summaries stay compact. Independent cards and detail headings use source logos for SelfNest and EnStudy-Hub; Educata uses an original book/cap mark created for the portfolio. Hash navigation aligns section boundaries without stacking scroll padding and margins.

The exploration studio is a continuous six-chapter notebook in components/Exploration.tsx. At 900px and wider, a sticky live preview follows the visible chapter, with compact chapter links attached to its footer; native scrolling remains in control. Each chapter opens with a short headline and one sentence. The first four chapters show their challenge immediately: change the mood, try save feedback, find the 375px layout, and move a component. A four-stamp trail records actual interactions, preserving progress while navigating chapters and switching styles. Longer explanations, references, and skill links live in native disclosures. The original studio phone is shared by the first three chapters, retaining its border, camera, T / Studio header, saved state, and responsive edge grip/keyboard-accessible width slider (244–620px). The complete frame is measured as its content reflows, then scaled to fit with space above and below. Later chapters show component pieces, a workflow map, and craft notes. On narrower screens the preview and game controls are replaced by chapter-specific animated illustrations and flowing content. Viewport observers pause decorative motion offscreen; the global motion toggle and reduced-motion preference keep all content readable without animation. Reference and project links remain available. Preview and illustration code lives in components/StudioNotebookPreview.tsx; layout and motion styles are in app/exploration.css.
