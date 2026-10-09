"use client";

import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import type { HeroOpeningStage } from "@/components/HeroIntro";

/** The cat owns the opening; the profile never waits for a visitor choice. */
export function useHeroOpening(hero: RefObject<HTMLDivElement | null>, theme: string, reduced: boolean) {
  const [stage, setStage] = useState<HeroOpeningStage>("ready");
  const before = useRef<DOMRect | null>(null);
  const entrance = useRef<Animation | null>(null);
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.heroOpening ??= "pending";
    const read = () => {
      const next = root.dataset.heroOpening;
      const value: HeroOpeningStage = next === "pending" || next === "showcase" ? "showcase" : next === "settling" ? "settling" : next === "revealing" ? "revealing" : "ready";
      if (value !== "showcase" && hero.current?.dataset.heroStage === "showcase") before.current = hero.current.querySelector("h1.hero-title > [data-hero-line] .hero-title-letter")?.getBoundingClientRect() ?? null;
      setStage(value);
    };
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-hero-opening"] });
    read();
    return () => { observer.disconnect(); entrance.current?.cancel(); };
  }, [hero]);

  useLayoutEffect(() => {
    const element = hero.current;
    const heading = element?.querySelector<HTMLElement>("h1.hero-title");
    if (!element || !heading) return;
    const measure = () => {
      if (stage !== "showcase") return;
      const box = heading.getBoundingClientRect();
      const old = Number.parseFloat(element.style.getPropertyValue("--hero-showcase-offset")) || 0;
      const samples = Array.from(heading.querySelectorAll(".hero-title-sample"));
      const height = Math.max(box.height, ...samples.map(sample => sample.getBoundingClientRect().height));
      const header = document.querySelector("header")?.getBoundingClientRect().bottom ?? 80;
      const index = element.querySelector(".hero-index")?.getBoundingClientRect().bottom ?? header;
      const pet = window.innerWidth < 600 ? 61 : 97;
      const minimum = Math.max(header + 12, index + 12) + pet + 26 + 36 + height / 2;
      const content = document.querySelector("#exploration")?.getBoundingClientRect().top ?? window.innerHeight;
      const maximum = Math.min(window.innerHeight - 12, content - 24) - height / 2;
      if (minimum > maximum || reduced) { document.documentElement.dataset.heroOpening = "ready"; return; }
      const center = Math.max(minimum, Math.min(maximum, (header + window.innerHeight) / 2));
      element.style.setProperty("--hero-showcase-offset", `${center - (box.y + box.height / 2 - old)}px`);
    };
    entrance.current?.cancel();
    if (stage === "showcase") measure();
    else if (before.current) {
      const previous = before.current;
      before.current = null;
      if (stage === "settling" && !reduced) {
        const next = heading.querySelector(".hero-title-letter")?.getBoundingClientRect() ?? heading.getBoundingClientRect();
        entrance.current = heading.animate([
          { transform: `translate(${previous.x - next.x}px, ${previous.y - next.y}px)` },
          { transform: "translate(0, 0)" },
        ], { duration: 320, easing: "cubic-bezier(.2,0,0,1)" });
        void entrance.current.finished.then(() => {
          if (document.documentElement.dataset.heroOpening === "settling") document.documentElement.dataset.heroOpening = "revealing";
        }).catch(() => {});
      } else if (stage === "settling") {
        document.documentElement.dataset.heroOpening = "ready";
      }
    } else if (stage === "settling") {
      document.documentElement.dataset.heroOpening = "ready";
    }
    const skip = (event: Event) => { if (event.isTrusted && stage === "settling") document.documentElement.dataset.heroOpening = "ready"; };
    window.addEventListener("resize", measure);
    if (stage === "settling") {
      document.addEventListener("pointerdown", skip, true);
      document.addEventListener("keydown", skip, true);
      window.addEventListener("scroll", skip, { passive: true });
    }
    return () => {
      window.removeEventListener("resize", measure);
      document.removeEventListener("pointerdown", skip, true);
      document.removeEventListener("keydown", skip, true);
      window.removeEventListener("scroll", skip);
    };
  }, [hero, stage, theme, reduced]);
  return stage;
}
