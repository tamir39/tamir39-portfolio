"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const revealTrigger = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);
  const navigationTrigger = useRef<HTMLButtonElement>(null);
  const hidden = collapsed && !hovered && !focused && !navigationOpen;

  useEffect(() => {
    setNavigationOpen(false);
    setCollapsed(false);
  }, [pathname]);

  useEffect(() => {
    let lastY = window.scrollY;
    let travel = 0;
    let frame = 0;
    let settleFrame = 0;
    let appearanceScroll = false;
    const resetScroll = () => {
      lastY = Math.max(0, window.scrollY);
      travel = 0;
    };
    // A new typeface can move the browser's scroll anchor without user scrolling.
    // Rebase after layout and scroll anchoring settle, preserving the header state.
    const appearanceObserver = new MutationObserver(() => {
      appearanceScroll = true;
      cancelAnimationFrame(settleFrame);
      resetScroll();
      settleFrame = requestAnimationFrame(() => {
        resetScroll();
        settleFrame = requestAnimationFrame(() => {
          resetScroll();
          appearanceScroll = false;
          settleFrame = 0;
        });
      });
    });
    appearanceObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme", "data-appearance"] });
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY;
      lastY = y;
      if (appearanceScroll) { travel = 0; return; }
      if (y < 96) { setCollapsed(false); travel = 0; return; }
      const keyboardFocus = header.current?.contains(document.activeElement) && document.activeElement?.matches(":focus-visible");
      if (navigationOpen || keyboardFocus || hovered) { travel = 0; return; }
      travel = Math.sign(delta) === Math.sign(travel) ? travel + delta : delta;
      if (travel > 28 && y > 180) { setCollapsed(true); travel = 0; }
      if (travel < -16) { setCollapsed(false); travel = 0; }
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      appearanceObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      cancelAnimationFrame(settleFrame);
    };
  }, [navigationOpen, hovered]);

  useEffect(() => {
    if (!navigationOpen) return;
    const onOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) {
        setNavigationOpen(false);
      }
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, [navigationOpen]);

  const closePanels = () => setNavigationOpen(false);

  return <>
    <div id="top" className="site-header-space" aria-hidden="true" />
    <header ref={header} className="site-header" data-hidden={hidden} data-theme-cycle-ignore
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => { setFocused(event.target !== revealTrigger.current && event.target.matches(":focus-visible")); }}
      onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); closePanels(); } }}
      onKeyDown={event => {
        if (event.key !== "Escape") return;
        if (navigationOpen) { setNavigationOpen(false); navigationTrigger.current?.focus(); }
        else if (window.scrollY > 180) {
          setHovered(false); setFocused(false); setCollapsed(true);
          requestAnimationFrame(() => revealTrigger.current?.focus());
        }
      }}>
      <div className="header-surface">
      <div className="header-bar">
        <Link href="/" aria-label="Tamir — home" className="header-brand" onClick={closePanels}>
          <span className="header-logo brand-mark" aria-hidden="true" />
          <span className="header-brand-name">Tamir</span>
        </Link>
        <nav id="header-navigation" aria-label="Main navigation" className="header-navigation" data-open={navigationOpen} onClick={closePanels}>
          <Link href="/#lab">Playground</Link><Link href="/#work">Work</Link><Link href="/#about">About</Link>
          <Link href="/#contact-end" className="header-contact">Let’s connect<ArrowUpRight size={15} aria-hidden="true" /></Link>
        </nav>
        <div className="header-actions">
          <Link href="/#about" className="header-avatar" aria-label="About Tamir" onClick={closePanels}>
            <Image src="/avatar.jpg" alt="" width={88} height={88} sizes="40px" quality={95} className="header-avatar-image" />
          </Link>
          <button ref={navigationTrigger} type="button" className="header-mobile-toggle header-icon-button" aria-label={navigationOpen ? "Close navigation" : "Open navigation"} aria-expanded={navigationOpen} aria-controls="header-navigation"
            onClick={() => { setNavigationOpen(!navigationOpen); setCollapsed(false); }}>
            {navigationOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
      </div>
      <button ref={revealTrigger} type="button" className="header-reveal" aria-label="Show navigation" aria-expanded={!hidden} aria-controls="header-navigation"
        onKeyDown={event => { if (event.key === "Enter" || event.key === " ") setCollapsed(false); }}
        onClick={() => setHovered(true)}>
      </button>
    </header>
  </>;
}
