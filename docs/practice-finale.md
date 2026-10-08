# Make it yours: the notebook finale

The sixth Exploration chapter closes with a signature poster rather than a static checklist. It progresses from a shared foundation, through a considered direction, to oversized “Make it yours” typography and a “Made with intent” stamp.

Desktop scrolling activates three short notes at the same 52% reading line as the Design workflow chapter. Both chapters share one passive, animation-frame-batched scroll listener and one resize observer. Scrolling backwards reverses the composition. The active note has larger, accented typography. The final native link continues to Selected work; the guide sources remain available in the existing disclosure.

The study never changes the portfolio theme and is not an additional discovery game. Its three progress labels are informational. Mobile shows the finished poster with one brief entrance, without controls or a scroll sequence. The global motion switch and OS reduced-motion setting disable transitions and entrance animations while preserving the final visual and normal scrolling.

`components/MakeItYoursStudy.tsx` owns the composition and shared step copy. `app/practice-finale.css` uses the current theme's colors, typography, panel corners, and shadows. The finished poster uses normal layout and font sizing, rather than scaling its text. All shapes are CSS or inline SVG; there are no new dependencies or downloaded assets.
