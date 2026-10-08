/** Wait for the first screen, without blocking on lazy projects or video embeds. */
export function waitForHeroReadiness(signal: AbortSignal): Promise<void> {
  return new Promise(resolve => {
    let settled = false;
    let fontsReady = !document.fonts;
    const finish = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      document.removeEventListener("DOMContentLoaded", check);
      document.removeEventListener("load", check, true);
      document.removeEventListener("error", check, true);
      signal.removeEventListener("abort", finish);
      resolve();
    };
    const check = () => {
      if (signal.aborted) { finish(); return; }
      if (!fontsReady || document.readyState === "loading" || !document.querySelector(".hero-layout[data-hero-ready]")) return;
      const images = Array.from(document.querySelectorAll<HTMLImageElement>(".hero-profile img, .header-avatar img"));
      if (images.every(image => image.complete)) finish();
    };
    const observer = new MutationObserver(check);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["data-hero-ready", "src", "srcset"] });
    document.addEventListener("DOMContentLoaded", check);
    document.addEventListener("load", check, true);
    document.addEventListener("error", check, true);
    signal.addEventListener("abort", finish, { once: true });
    if (document.fonts) void document.fonts.ready.then(() => { fontsReady = true; check(); });
    check();
  });
}
