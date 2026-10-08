import Link from "next/link";
import { BrandScene } from "@/components/BrandScene";

export default function NotFound() {
  return <main id="main-content" className="page-state">
    <BrandScene />
    <div className="page-state-copy">
      <p className="page-state-code">404 / Page not found</p>
      <h1>A little off the path.</h1>
      <p className="page-state-description">This page may have moved, or the link is incomplete. There’s plenty to explore back home.</p>
      <div className="page-state-actions"><Link href="/" className="page-state-primary">Back to home</Link><Link href="/#work">Explore my work</Link></div>
    </div>
  </main>;
}
