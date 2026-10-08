# Desktop hero artwork

## Brand introduction and page states

On a fresh homepage visit, `components/PageIntro.tsx` first shows a separate animated cat-logo loading screen. It waits for the hero to hydrate, fonts to settle, and the header/profile images to finish, without waiting for lazy projects or video embeds. The existing cat logo and Tamir wordmark then reveal from left to right. A curtain clears to the fully visible hero; there is no hero entrance animation or stagger. Section links and internal navigation do not replay the introduction.

The loading screen follows the saved palette and brightness before first paint. Its compact logo mask is embedded so the logo remains visible while assets load. The loader has pause/resume and enter-site controls; Skip intro and Escape dismiss the introduction. OS reduced motion and the global motion switch keep the loader static and bypass the intro once the page is ready. CSS hides background controls during loading and the identity scene, without changing server-rendered attributes during hydration. Startup and playback timeouts keep the page available if hydration or animation fails.

The shared theme provider uses `usePrefersReducedMotion` to keep the server output and initial browser render identical. Device motion preferences are applied after hydration and continue to follow live system changes. CSS and the intro/reveal effects check the device preference directly before starting motion, including during that initial render.

`app/loading.tsx` and `app/missions/[slug]/loading.tsx` share the separate logo loader with a breathing mark and a left-to-right light sweep. They represent the real route loading boundary, with no simulated progress percentage, and include local pause/resume controls. `app/error.tsx`, `app/not-found.tsx`, and `app/global-error.tsx` use the brand identity with recovery actions. Root errors have independent fallback styling because the normal layout may be unavailable. Route fades use CSS so content stays visible without JavaScript and honors the motion settings.

## Artwork

The hero has five original Canvas 2D scenes inspired by the 21st.dev references selected with the user. These are custom adaptations of the interaction concepts, not imports of the catalog source code.

| Theme | Reference | Behavior |
| --- | --- | --- |
| Editorial | [Floating Paths](https://21st.dev/@bundui/components/floating-paths) | Fine lavender paths flow slowly, bend toward the pointer, and carry a wave from each click. |
| Swiss | [Kinetic Grid](https://21st.dev/@satoriui/components/kinetic-grid) | A precise grid deforms near the pointer; clicks send expanding red ripples. |
| Blueprint | [Wireframe Forms](https://21st.dev/@mengto/components/wireframe-forms/wireframe-forms-cylinders) | Projected 3D linework follows the pointer. Click, Enter, or Space cycles cube → sphere → cylinders. |
| Play | [Interactive Hero Backgrounds](https://21st.dev/@ravikatiyar162/components/interactive-hero-backgrounds) | Seven shaded spheres float, repel the pointer, collide, and scatter on click before returning to their home positions. |
| Botanical | [Isoline Bloom](https://21st.dev/@kedhareswer/components/isoline-bloom) | Organic green contours bend toward the pointer and bloom outward on click. |

`components/HeroArtwork.tsx` mounts the renderer only for fine-pointer, hover-capable desktops at least 1024px wide. `lib/hero-artwork.ts` is dynamically imported for that surface; no new dependency or WebGL context is needed. Pointer coordinates and simulation state stay outside React renders. A native button supports keyboard activation, descriptive labels, and a visible focus ring.

The scenes use the current light/dark tokens. Artwork is translucent and continuous beneath the heading, profile, and introduction; only the top and bottom edges fade. The heading and profile block stay static. Heading copy updates immediately when the theme changes, without an entrance or floating animation. Hero spacing and content remain in normal flow. Hero background clicks only play the artwork response. On hover-capable, fine-pointer desktops at least 900px wide, clicking the profile block advances styles in the existing order; its project link retains navigation. A small “Tap to change theme” button at the bottom-right of the profile provides the same action for keyboard users. Background clicks outside the hero also advance themes; links, controls, and touch input are excluded. Mobile and coarse-pointer layouts hide this note and do not cycle themes from page or profile taps. The appearance picker remains available on every screen.

The profile has a transparent, outlined container with the current theme's panel corners and responsive inner padding. It has no fill, blur, floating motion, or hover movement, so the artwork remains visible beneath it. The desktop outline changes color on hover or keyboard focus to make its theme-switching area clear; mobile keeps the outline without the theme action or note.

Hero text does not allow selection highlighting. Profile gestures that move more than 8px are treated as drags and do not cycle themes.

The global motion switch and OS reduced-motion preference produce static artwork and disable its effect button. Intersection and document-visibility observers stop animation frames offscreen or in a hidden tab. Pixel density is capped at 2. Resize, visibility, and pointer listeners are removed when a scene is replaced or unmounted. Mobile and touch retain the existing content-first hero and lightweight atmosphere.
