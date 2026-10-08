"use client";

import type { CSSProperties } from "react";
import { BrandScene } from "@/components/BrandScene";
import "./intro.css";

// This boundary replaces the root layout, so its brand and colors must stand alone.
const fallbackStyle = {
  margin: 0, background: "#fbf8f5", color: "#332b49", fontFamily: "Arial, sans-serif",
  "--color-paper": "#fbf8f5", "--color-ink": "#332b49", "--color-muted": "#655c7e",
  "--color-accent": "#75618d", "--theme-line": "#d8cfe0", "--theme-action": "#493b61",
} as CSSProperties;

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={fallbackStyle}>
    <style>{`.brand-mark{display:inline-block;background:var(--color-accent);mask:url('/brand/cat-monochrome.png') center/contain no-repeat;-webkit-mask:url('/brand/cat-monochrome.png') center/contain no-repeat}.page-state{min-height:100svh;box-sizing:border-box}.page-state-actions a{color:inherit;text-decoration:none}.page-state-actions button{font-family:inherit}.page-state-actions :focus-visible{outline:2px solid #75618d;outline-offset:4px}`}</style>
    <main className="page-state">
      <BrandScene />
      <div className="page-state-copy">
        <p className="page-state-code">Something went wrong</p>
        <h1>Let’s start fresh.</h1>
        <p className="page-state-description">The page couldn’t load. Try again, or return to the homepage.</p>
        <div className="page-state-actions"><button type="button" className="page-state-primary" onClick={reset}>Try again</button><a href="/">Back to home</a></div>
      </div>
    </main>
  </body></html>;
}
