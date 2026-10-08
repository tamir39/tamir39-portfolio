"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePortfolioTheme } from "./providers/ThemeProvider";

// Enhance the server-rendered page without turning every content section into a client component.
export function PageMotion() {
  const pathname = usePathname();
  const { reduced, theme } = usePortfolioTheme();
  useEffect(() => {
    if (reduced || document.documentElement.dataset.motion === "off" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const animations = new Set<Animation>();
    const elements = new Set<Element>();
    const revealed = new WeakSet<Element>();
    const sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) entry.target.toggleAttribute("data-scene-visible", entry.isIntersecting);
    }, { rootMargin: "0px", threshold: 0 });
    const revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting || revealed.has(entry.target)) continue;
        const el = entry.target as HTMLElement;
        revealed.add(el);
        revealObserver.unobserve(el);
        const heading = el.matches("h1,h2,h3");
        const from = theme === "swiss" ? { translate: "-32px 0" }
          : theme === "play" ? { translate: "0 32px", rotate: "-2deg", scale: "0.97" }
          : { translate: `0 ${heading ? 36 : 24}px` };
        const animation = el.animate([
          { opacity: 0, clipPath: heading ? "inset(-0.2em -0.12em 100% -0.12em)" : "none", ...from },
          { opacity: 1, translate: "0 0", rotate: "0deg", scale: "1", clipPath: heading ? "inset(-0.2em -0.12em -0.2em -0.12em)" : "none" },
        ], { duration: theme === "swiss" ? 450 : theme === "botanical" ? 850 : 700,
          easing: "cubic-bezier(.16,1,.3,1)", fill: "none" });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => {});
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -32px 0px" });
    function scan() {
      if (["loading", "playing", "exiting"].includes(document.documentElement.dataset.pageIntro ?? "")) return;
      document.querySelectorAll("main section, footer, .studio-workbench, .hero-layout").forEach(el => {
        if (!elements.has(el)) { elements.add(el); sceneObserver.observe(el); }
      });
      document.querySelectorAll("main h1:not(.hero-title), main h2, main .section-eyebrow, .portfolio-project, #academic article, .game-project-card, .independent-slideshow, .profile-card, #experience, main section ol > li, footer .contact-heading, footer .contact-form").forEach(el => {
        if (el.closest(".hero-layout")) return;
        if (!elements.has(el)) { elements.add(el); revealObserver.observe(el); }
      });
    }
    scan();
    const mutations = new MutationObserver(scan);
    mutations.observe(document.querySelector("main") ?? document.body, { childList: true, subtree: true });
    mutations.observe(document.documentElement, { attributes: true, attributeFilter: ["data-page-intro"] });
    return () => {
      mutations.disconnect(); sceneObserver.disconnect(); revealObserver.disconnect();
      animations.forEach(animation => animation.cancel());
      elements.forEach(el => el.removeAttribute("data-scene-visible"));
    };
  }, [pathname, reduced, theme]);
  return null;
}
