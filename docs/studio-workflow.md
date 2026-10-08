# Design workflow study

The fifth Exploration chapter shows one T / Studio composition evolving through four decisions:

- **Idea:** type, palette, and a short purpose sit above a faint draft.
- **Structure:** a wireframe gives the content and action a hierarchy.
- **Build:** the wireframe becomes a themed interface with a component annotation.
- **Refine:** typography, spacing, and saved-state feedback complete the composition.

On desktop, the preview follows normal page scrolling through four short process notes in `#studio-workflow`. A note becomes current when its top reaches 52% of the viewport height. Scrolling back reverses the stages. The preview's numbered progress line exposes the current step without adding buttons or focus stops; a polite status region explains the current decision. Wheel, touchpad, and native keyboard scrolling work without scroll trapping. The reading position is recalculated after resizing.

The current note's heading grows and takes the accent color; the previous heading returns to its normal size. This uses actual font sizing rather than scaling the text. With reduced motion or animations switched off, the emphasis changes immediately.

The preview window uses the panel radius rather than the control radius, so Editorial's pill-shaped controls cannot turn the window into an oval. Its chrome stays inside the frame, and grid centering avoids scaling the finished content. The workflow does not cycle the portfolio theme or add a discovery requirement to the four existing games.

Mobile shows the finished composition with a brief staged entrance and a static process line, without game controls. The global motion preference and OS reduced-motion setting disable the entrance and desktop transitions. Playback is limited to the visible study.

`components/WorkflowStudy.tsx` owns the study. `app/workflow.css` uses the existing theme tokens for all five styles and both appearances.
