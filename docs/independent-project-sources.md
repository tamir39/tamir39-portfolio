# Independent project evidence

Reviewed 2026-10-08. Sibling repositories were inspected read-only. These entries support the three main product cases; they are not presented as launched client products. Public availability is noted separately where verified; individual ownership of every feature is not inferred from repository contents.

## SelfNest

- Root: `D:/Projects/SelfNest`.
- `AGENTS.md`, `README.md`: local MVP implemented, production PWA asset caching and local persistence; deployed cloud connectivity and Android device validation pending. Scheduled closed-app reminders are not implemented.
- `src/features/check-in/CheckIn.tsx`: mood/energy/sleep/priority/note form, validation, save feedback, unsaved-navigation guard.
- `src/features/routines/RoutineRow.tsx`: complete, skip, pending states and undo.
- `src/features/history/History.tsx`, `src/features/settings/Settings.tsx`: historical summaries and preferences/backup surfaces.
- `src/shared/data/`, `src/shared/styles/`, `src/shared/i18n/`, `src/shared/pwa/`: local records, shared appearance, localization, and installation behavior.
- Public status: Local MVP. No completed cloud deployment or scheduled notification claim.

## EnStudy-Hub

- Root: `D:/Projects/EnstudyHub`.
- `README.md`: vocabulary application, collections/lessons, personal import/editing, FSRS review, statistics, keyboard controls. Hosting is planned.
- `src/components/decks/csv-import-form.tsx`, `csv-preview-table.tsx`: template, paste/file input, debounced preview, validation and submission states.
- `src/components/review/review-session.tsx`: flashcard and practice modes, queue/rating state and lazy-loaded practice surfaces. Current implementation has more modes than the older README; portfolio avoids a fixed count.
- `src/components/stats/`: activity, retention, maturity and forecast chart implementations.
- Public status: Public alpha. The user supplied `https://en-study-hub.vercel.app/`; browser verification on 2026-10-08 reached its Vietnamese landing page at `/vi`, which identifies itself as an alpha build. At the user's request it now appears in Selected work, with its website link and detail page, and is removed from the independent-project slideshow. Its case data lives in `lib/data/projects.ts`; the detail page returns to Selected work and retains the sample-data mockup. Account, payment, and persistence flows were not tested; no measured learning outcome is claimed.

## Educata

- Roots: `D:/Projects/Educata` and `D:/Projects/Educata-LandingPage`.
- Educata `README.md`: client uses MSW fixtures; mutations reset on full reload; NestJS backend scaffold remains to be implemented.
- `client/src/components/AppShell.tsx`: role-aware navigation.
- `client/src/modules/learning/components.tsx`: module/lesson navigation, progress, completion, loading/error/empty and archived read-only states.
- Landing `app/page.tsx`, `app/prototype/`: public page plus teacher/student/admin role prototypes.
- Landing `components/sections/InteractiveDemo.tsx`: selected lesson, completion state, progress and reset.
- Landing `components/waitlist/WaitlistForm.tsx`: validation, loading, success and error states.
- Public status: Frontend prototype. Describes implemented screens, not a launched LMS or completed production backend.

## Selection boundaries

ProjectOS remains setup-only in its README; FoodLensVN still lists training, evaluation and a demo as pending. Neither is added as a completed interface. Research-only work and project skeletons do not displace the user's frontend, UI/UX, application-flow and PWA focus. Previously removed 100BStudio and MonoDesk remain excluded; the unlaunched Twohearts dashboard remains excluded.

## Presentation

All listed project pages now lead with the deliverable, a prominent contribution or project-focus summary, and focus chips. Academic/team scope uses neutral project language where individual feature ownership is not documented. Tamir is the public portfolio name; the About introduction retains Phí Vương Tường Tâm.

## Interactive portfolio mockups

The user requested hardcoded previews based on current source on 2026-10-08, then clarified that they belong in project details. `components/ProjectMockup.tsx` renders the interactive preview only on each independent-project case page; homepage cards contain summaries and links. `lib/data/mockups.ts` contains invented sample routines, vocabulary, lessons, and users. All changes remain in React memory and reset on reload; no application APIs, authentication, database, service worker, or personal records are connected. These are adapted interface excerpts, not complete copies of the applications.

Source update results before implementation:

- SelfNest: `git pull --ff-only` succeeded, already current at `3e8dd50`. Its implemented local MVP is uncommitted/untracked; those files were preserved and read in place.
- Educata: `git pull --ff-only` succeeded, already current at `6739d6b` on its tracked dashboard-alignment branch. Existing package/Docker/launcher changes were preserved.
- Educata-LandingPage: local source folder is not a Git repository and has no remote to pull.
- EnStudy-Hub: fetched `origin/main` at `ec0c600` (62 commits ahead of the local feature revision). The old tracked feature branch no longer exists remotely. A fast-forward from main was attempted but Git refused to overwrite local edits in the login form and two auth/session files. No stash, reset, checkout or overwrite was performed. Latest source was read directly from `origin/main` with `git show`.

Preview evidence:

- SelfNest: Today/check-in copy, routine completion behavior, shared green/warm palette from `src/features/today/Today.tsx`, `src/features/routines/RoutineRow.tsx`, `src/shared/i18n/resources/en.ts`, and `src/shared/styles/tokens.css`.
- EnStudy-Hub: latest main `src/components/review/flashcard-flip.tsx`, `review-session.tsx`, `src/styles/design/review.css`, `tokens.css`, and `theme.css`. The active theme overrides remap the older warm token base to blue/white/yellow. The portfolio adapts reveal/rating/completion and does not calculate or claim real FSRS scheduling.
- Educata: dashboard/lesson structure from `client/src/modules/dashboard/components.tsx` and `learning/components.tsx`; role-workspace structure and indigo palette from the local landing prototype. Sample publish/access controls change only the mockup state.

Shared preview controls use native buttons and checkboxes, visible keyboard focus, accessible status/progress feedback, reset actions, and the portfolio's motion-pause/reduced-motion settings. Product palettes are scoped inside each preview so switching portfolio themes does not recolor the represented product identity.

## Portfolio project marks

SelfNest uses `D:/Projects/SelfNest/public/icon.svg`; EnStudy-Hub uses `D:/Projects/EnstudyHub/public/logo-mark.svg`. Copies are stored in the portfolio public assets without modifying either source repository. No reusable logo asset was found for Educata in the inspected frontend folders, so its portfolio mark is an original SVG combining an open book and graduation cap, in its indigo identity.

## Moza
Source: D:/Projects/Moza/moza-prototype/README.md, app/lop/[slug]/page.tsx, app/san/[slug]/page.tsx, and portal routes. Frontend-only prototype with mock data; availability is illustrative. Logo reused from claude_design/assets/favicon.svg. Demo video supplied by the user: RrFHd6dGjIo.


## 100b.studio — current frontend

Source repository: D:/Projects/100BStudio. Current evidence: app/page.tsx, app/globals.css, components/sections/Hero.tsx, components/layout/TweaksPanel.tsx, components/sections/Process.tsx, components/layout/TopBar.tsx, components/sections/Contact.tsx, lib/hooks/use-wireframe.ts, lib/hooks/use-mini-canvas.ts, and lib/data.ts (Tamir: Frontend Engineer).

The older PRD and report describe a previous version. Portfolio copy follows the current cinematic cream-and-ink implementation and contact-form states. No revenue, scale, uptime, performance, or conversion claims are transferred into the portfolio. The current site icon from app/icon.png is reused locally. The user supplied the domain; the research browser could not retrieve it, so public availability is not independently verified here.
