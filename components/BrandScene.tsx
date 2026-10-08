import { brandMarkMask } from "@/lib/brand-mark";

/** Shared identity for the homepage introduction and page states. */
export function BrandScene({ loading = false, variant = "identity" }: { loading?: boolean; variant?: "identity" | "loading" }) {
  return <div className="brand-scene" data-loading={loading} data-variant={variant} aria-hidden="true">
    <div className="brand-scene-wordmark">
      <span className="brand-scene-mark brand-mark" style={{ maskImage: brandMarkMask, WebkitMaskImage: brandMarkMask }} />
      {variant === "identity" && <span className="brand-scene-name">Tamir<span className="brand-scene-dot">.</span></span>}
    </div>
    <span className="brand-scene-rule" />
    <p className="brand-scene-caption">{variant === "loading" ? "Loading…" : "Frontend & UI/UX"}</p>
  </div>;
}
