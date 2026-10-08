# Cat companion

The companion's local behavior system controls its movement, facing direction, emotions, cooldowns, and appearance suggestions. AI is optional and supplies only an occasional short comment. The page works with local dialogue when AI is disabled, slow, unavailable, or rate limited.

## On-page behavior

The cat looks for open space before roaming or approaching a resting cursor. Hovering nearby gives a cuddle reaction; clicking or tapping gives a boop. One reaction is active at a time, with discoveries and direct interactions taking priority over ambient chatter. Pause and more controls appear on hover or keyboard focus; a touch tap reveals them through focus.

Each main section and exploration chapter gets a relevant comment after scrolling settles for about a second. Cooldowns belong to the individual page area, so moving to another chapter does not silence its greeting. Passing through quickly skips the greeting. The first edit in a contact-form visit gets one local typing reaction, then the cat stays put and quiet while the visitor writes. Moving between fields or adding more characters does not repeat it; form contents are never read by the companion or sent to AI.

Lingering over a control for 1.6 seconds can get a curious comment when the cat is free. Using buttons, changing choices, and opening notes get context-specific local responses, with cooldowns shared across controls. Existing discovery, theme, navigation, and form reactions retain priority; hovering does not queue chatter behind an active reaction. The cat's own controls and contact inputs are excluded from generic control commentary.

Scrolling keeps the cat's current perch when it is clear. If content ends up underneath it, it moves smoothly to the nearest clear space after scrolling stops. Height-only viewport changes, such as a mobile browser toolbar opening or closing, preserve the perch and only clamp it if it would leave the screen. They do not choose a new random position or disable movement transitions.

The transparent hero-artwork surface does not block roaming space. Text, foreground controls, media, and live previews still do. Hover and keyboard-focus flags are reconciled with the current browser state so a disappearing bubble or a touch interaction cannot leave the cat stuck.

Roaming favors a different horizontal position when clear space permits, so mobile visits can explore both margins rather than only moving up and down the right edge. A blocked margin still loses to content clearance. On mobile the cat faces its direction of travel, then turns inward after settling at either screen edge; sleeping and paused cats also settle facing into the page. An interrupted trip cancels the old facing timer, and resizing rechecks the resting direction without moving the cat unnecessarily.

Between reactions, a shuffled activity cycle gives it short moments of grooming, eating, scratching a paper scrap, playing with a cloth, stretching, yawning, sniffing, and waving a paw. Each lasts 3–5 seconds, with roughly 7–12 seconds between actions when uninterrupted. Roaming becomes eligible every 14–20 seconds and happens between activities, choosing a different clear perch when space allows. Hover, keyboard focus, direct reactions, hidden tabs, and motion preferences cancel ambient activities cleanly rather than stacking or replaying them. Mouse focus alone does not leave it permanently parked. Props stay beside the cat and never change the actual page.

A sleeping cat breathes gently with staggered floating `z z Z` letters. The letters remain after its comment closes. “Take a little nap” is a separate resting mode: it keeps those sleep animations while stopping roaming, activities, and comments until the visitor wakes the cat. Clicking or tapping the sleeping cat, choosing “Come explore with me,” or asking for help wakes it. Nap and pause preferences survive a reload within the tab. The separate Pause control and reduced motion keep the illustration still.

Its ordinary resting pose also has subtle breathing, weight shifts, and occasional blinks. This base motion yields completely to a reaction or activity rather than layering conflicting pose animations.

“Do something silly” in the cat controls requests an immediate activity from the same shuffled bag. It plays for its normal duration while the visitor watches, even if the controls retain focus, and direct interactions can cancel it. The control is absent when motion is reduced.

The visible cat is 76px wide on desktop and 48px on mobile. Its cheek is clean: there is no blush overlay, and the native eye is fully covered before drawing an animated expression. Emotion symbols sit just above its forehead and change sides with its facing direction; sleeping letters float a little higher.

Drag the cat with a mouse, pen, or touch. A small movement threshold preserves ordinary tap-to-pet behavior. While carried, it lifts and sways with horizontal movement and gives one rotating pickup comment. That comment stays while carried and closes shortly after release; it is local dialogue and does not request AI. The cat faces its direction of travel during dragging, roaming, and keyboard moves, with cursor tracking resuming after arrival. It settles with a soft landing. Drops stay inside the viewport and prefer the nearest clear space when text or controls are underneath. Automatic roaming waits at least ten seconds after a manual placement. Keyboard users can focus the cat and move it with arrow keys, or hold Shift for smaller steps; Enter still pets it. Reduced motion preserves direct dragging without the decorative sway or landing bounce.

Comments have an emotion icon directly in the sentence and reveal quickly over roughly 0.3–1.2 seconds. The full text height is reserved from the start, and a replacement comment cancels the previous reveal. Hovering or focusing the bubble pauses its dismissal timer. Screen readers receive complete comments rather than individual characters, and reduced motion shows the text immediately and stops automatic roaming and activities.

After three minutes of engaged viewing in an appearance mode, the cat can suggest trying the other mode. Each mode gets one suggestion per tab session; appearance changes only when the visitor chooses the action.

After 90 seconds of engaged viewing in the same theme, a separate style invitation can offer a different named theme. It waits until there is no active comment, appears at most once per visit, and remains until chosen or dismissed. “Suggest a theme” in the cat controls can request one directly. The button changes the theme only when clicked; existing appearance, form, and discovery feedback keeps priority. These suggestions use local copy and do not request AI.

## Optional AI setup

1. Add these server environment variables in your hosting settings or your private `.env.local` file. Preserve your existing contact settings.

   ```dotenv
   CAT_AI_ENABLED=true
   OPENAI_API_KEY=your-server-api-key
   OPENAI_CAT_MODEL=gpt-5.6-terra
   ```

2. Restart the development server or redeploy after changing server environment variables. `GET /api/cat-comment` returns only `{ "enabled": true }` when both the explicit enable flag and a nonempty API key exist. Readiness checks do not contact OpenAI or verify model access.
3. To turn AI off, set `CAT_AI_ENABLED=false`. The companion retains its local reactions.

Never put the API key in a `NEXT_PUBLIC_` variable, browser code, or a committed file. No key was configured as part of this change, and verification uses mocked responses without paid requests.

The default model is `gpt-5.6-terra` with reasoning disabled for short comments. OpenAI's [GPT-5 Mini model page](https://developers.openai.com/api/docs/models/gpt-5-mini) currently recommends GPT-5.6 Terra for new low-latency, high-volume work. Its [model page](https://developers.openai.com/api/docs/models/gpt-5.6-terra) confirms Responses API, Structured Outputs, and `reasoning.effort: none` support. Availability depends on your API project; `OPENAI_CAT_MODEL` can select another model with these capabilities. Documentation verified October 8, 2026.

## Request boundary

The same-origin client can send `POST /api/cat-comment` with exactly four enum fields:

```json
{ "signal": "discovery", "section": "playground", "appearance": "light", "theme": "blueprint" }
```

- `signal`: `section`, `project`, `discovery`, `appearance-change`, `help`, or `pet`.
- `section`: `intro`, `playground`, `work`, `about`, or `contact`.
- `appearance`: `light` or `dark`.
- `theme`: `editorial`, `swiss`, `blueprint`, `play`, or `botanical`.

Success returns `{ "text": "A little curiosity. An excellent discovery." }`, at most 140 characters. Other statuses return an empty text value; the client keeps its local line. Model output never contains a page action, emotion, or movement instruction. The client should discard responses if their reaction is no longer current.

No typed visitor messages, contact form contents, pointer coordinates, browsing history, or visitor identity are sent to OpenAI. The endpoint constructs the payload from validated enum fields rather than forwarding arbitrary request content. It does not record prompts, responses, keys, or visitor activity in application logs. A temporary salted address hash is kept in server memory solely for request throttling; it is not sent to OpenAI.

## Latency and cost controls

- Requests have a 1 KiB body limit and must use JSON from the same origin.
- The endpoint limits each address to six requests per ten minutes and keeps at most 2,000 temporary address hashes.
- Responses are cached for 30 minutes by the four enum fields; simultaneous identical requests share one generation. There are at most 128 cached comments.
- Each server process allows at most 40 generation attempts per hour and 100 per UTC day, including failures. Each generation has a 128-token output cap and a five-second timeout, with no automatic retries.
- The client additionally spaces requests and limits its session usage; pointer motion does not trigger AI calls.

These in-memory limits reset on process restart and apply separately to each serverless instance. They are a development safety net, **not a deployment-wide spending cap**. Before enabling AI on a public deployment, add a shared durable limiter or gateway with a hard global request budget, configure API project usage controls, and ensure your hosting proxy overwrites forwarding headers. Same-origin checks prevent routine cross-site browser calls; they do not authenticate visitors or prevent scripts from forging HTTP headers. Leave AI disabled until these operating controls match the desired public exposure.

The endpoint uses native server `fetch`, not a client SDK. Requests use the [Responses API](https://developers.openai.com/api/docs/guides/migrate-to-responses), `store: false`, and a strict [Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses) schema. `store: false` disables stored response state; it does not imply zero data retention for every platform control. See OpenAI's [data controls](https://developers.openai.com/api/docs/guides/your-data) for account-specific retention behavior.

## Offline verification

Run `node scripts/check-cat-ai.cjs` to check request validation, the disabled gate, cache sharing, per-client limits, hourly and daily budgets, and invalid or failed upstream responses. The script isolates its environment and mocks `fetch`; it never reads your environment files or contacts OpenAI.
