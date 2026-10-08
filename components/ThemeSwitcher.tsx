"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useId } from "react";
import { themes } from "@/lib/themes";
import { darkSwatches } from "@/lib/appearance";
import { usePortfolioTheme } from "./providers/ThemeProvider";

const modes = [{ id: "light", name: "Light", icon: Sun }, { id: "dark", name: "Dark", icon: Moon }, { id: "system", name: "System", icon: Monitor }] as const;

export function ThemeSwitcher() {
  const labelId = useId();
  const { theme, setTheme, appearance, resolvedAppearance, setAppearance } = usePortfolioTheme();
  const current = themes.find(item => item.id === theme)!;
  return <div className="appearance-controls" aria-labelledby={labelId}>
    <div className="appearance-heading"><p id={labelId}>Same studio. Different feelings.</p><p>Watch the preview adapt, from color to type and motion.</p></div>
    <fieldset className="appearance-modes"><legend>Color mode</legend><div>{modes.map(mode => <button key={mode.id} type="button" aria-pressed={appearance === mode.id} onClick={() => setAppearance(mode.id)}><mode.icon size={15} aria-hidden="true" />{mode.name}</button>)}</div></fieldset>
    <fieldset className="appearance-styles"><legend>Visual style</legend><div className="theme-options">{themes.map(item => {
      const swatch = resolvedAppearance === "dark" ? darkSwatches[item.id] : { ink: item.color, paper: item.paper };
      return <button key={item.id} type="button" className="theme-option" aria-label={`${item.name} style`} aria-pressed={theme === item.id} onClick={() => setTheme(item.id)} style={{ "--swatch-ink": swatch.ink, "--swatch-paper": swatch.paper } as React.CSSProperties}>
        <span className={`theme-swatch swatch-${item.id}`} aria-hidden="true">{item.symbol}</span><span className="appearance-style-name">{item.name}<small>{item.motion}</small></span><Check className="theme-choice-check" size={16} aria-hidden="true" />
      </button>;
    })}</div></fieldset>
    <p className="appearance-status" role="status">{current.name} · {appearance === "system" ? `System (${resolvedAppearance})` : resolvedAppearance === "dark" ? "Dark" : "Light"}<span>{current.description}</span></p>
  </div>;
}
