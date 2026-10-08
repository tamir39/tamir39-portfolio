# Frontend project content sources

Reviewed 2026-10-08. These notes support the portfolio copy in `lib/data/projects.ts` and the selected-work cards in `components/Portfolio.tsx`. The sibling projects were inspected read-only. User-confirmed frontend/UI/UX scope supplies the role; repository features alone do not establish sole authorship.

## Joi.vn — Whitelable

Source root: `D:/Projects/Whitelable`.

- `FRONTEND_CONTEXT.md` and `FRONTEND_UPDATE_LOG.md`: current responsive refinements, availability behavior, persistent background, bilingual feedback, and compact ordering surfaces.
- `FRONTEND_GUIDE.md`: storefront purpose and React, Vite, TypeScript, Tailwind, TanStack Query, Zustand, and i18n stack.
- `DESIGN.md`: food-first warm-green identity, semantic action/state colors, separate mobile/desktop treatments, restrained motion, and four-step checkout.
- `FRONTEND_PAGE_STATUS.md`: implemented landing, delivery, payment, shared layout, and remaining legacy routes. The portfolio does not describe every route as redesigned.
- `src/components/Payment/PaymentPage.tsx`: Receiving, Customer, Pay & save, Review; validation, draft state, submission, and invoice behavior.
- `src/components/Delivery/DeliveryPage.tsx`: search, category selection, shared browsing state, and deals shelf.
- `src/components/MenuItemDetail/MenuItemDetailModal.tsx` and `src/components/Layout/index.tsx`: responsive product surface, keyboard/viewport sizing, cart/chat ownership, and shared background continuity.

Joi.vn is the user-supplied portfolio destination. The local code also names The Joi Factory and its own deployment domains; this inspection does not independently establish which build currently serves Joi.vn.

## Twohearts.vn — standalone landing

Source root: `D:/Projects/TwoheartsMissonControl/landing` (the actual folder is spelled **MissonControl**).

- `FRONTEND_CONTEXT.md`, `FRONTEND_UPDATES_LOG.md`, and `DESIGN.md`: landing scope, teal identity, localization, asset/performance work, and product storytelling.
- `src/pages/Home.tsx`: actual hero → standalone sections → footer composition.
- `src/components/landing/StandaloneSections.tsx`: savings sliders/calculation, message-to-order-to-kitchen relay, OS scenes, and motion gating.
- `src/components/landing/Hero.tsx`: responsive product scene and observer-gated connector animation.
- `src/pages/WaitlistPage.tsx`: current form validation, first-error focus, busy state, and success panel. Older notes mention a three-step wizard; the portfolio intentionally follows the current form implementation instead.
- `src/components/landing/live-tracking/LiveTrackingDemo.tsx`: five-stage illustrative demo with play, next, and stage selection controls.
- `src/contexts/LandingLanguageContext.tsx`: VI/EN route handling and stored language preference.

Scope is the public landing experience, not the root Mission Control dashboard. Calculator outputs are illustrative estimates, not verified customer savings. Product scenes and tracking are demos, not evidence of live operational integrations.

## Zuno

Source root: `D:/Projects/Zuno`.

- `PRD.md`: Class Zone core loop; future Zone types are explicitly roadmap material.
- `DESIGN.md`: current visual baseline, mobile navigation/settings, shared light/dark semantic roles, and Vietnamese typography.
- `CHANGELOG.md`: current UI refinements, inline Zone picker, progressive loading, PWA update behavior, and contextual notifications. Unreleased notes alone are not treated as proof of deployed behavior.
- `components/MobileDashboardNav.tsx`: labeled destinations versus posting/inbox dialog actions.
- `app/z/[zoneId]/invite/[token]/page.tsx`: preview, sign-in return destination, join action, and readable errors.
- `components/dock/GlobalCreateLauncher.tsx`: inline ZoneTargetChip in creation flows.
- `components/Composer.tsx`: per-Zone local text draft persistence and clearing after successful posting.
- `components/UpdateToast.tsx`: user-controlled update modal and public/auth-route suppression.
- `components/IosInstallSheet.tsx`, `components/InstallAppButton.tsx`, and `lib/pwa/useInstallPwa.ts`: supported-browser install prompt and iOS walkthrough.
- `modules/notifications/service.ts`: actor/Zone context for push messages.

No claim of fully offline social functionality, completed payments, future Zone-type availability, quantified conversion gains, or independently verified production parity is made. PWA specifics belong to the project case study; the personal About copy emphasizes visual exploration, themes, motion, and interaction.

## Workspace policy availability

The user-referenced `D:/Data/Downloads/Policies` directory was not present when checked. No collaboration, release, or QA workflow was changed in the sibling repositories.
