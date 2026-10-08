"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandScene } from "@/components/BrandScene";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { document.documentElement.dataset.pageIntro = "complete"; }, []);

  return <main id="main-content" className="page-state">
    <BrandScene />
    <div className="page-state-copy">
      <p className="page-state-code">Something went wrong</p>
      <h1>Let’s try that again.</h1>
      <p className="page-state-description">This page couldn’t finish loading. Try again, or head back to the homepage.</p>
      <div className="page-state-actions"><button type="button" className="page-state-primary" onClick={reset}>Try again</button><Link href="/">Back to home</Link></div>
    </div>
  </main>;
}
