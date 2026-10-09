const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");
const ts = require("typescript");

function loadSource(file, imports, globals = {}) {
  const filename = path.join(__dirname, "..", file);
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  });
  const module = { exports: {} };
  vm.runInNewContext(compiled.outputText, {
    module, exports: module.exports, require: name => imports[name], ...globals,
  }, { filename });
  return module.exports;
}

test("the theme provider renders the same motion state on the server and a reduced-motion phone", () => {
  const themes = loadSource("lib/themes.ts", {});
  const appearance = loadSource("lib/appearance.ts", { "./themes": themes });
  function initialRender(browser) {
    const react = {
      createContext: () => ({ Provider: "provider" }),
      useState: initial => [initial, () => {}],
      useRef: initial => ({ current: initial }),
      useEffect: () => {}, useMemo: fn => fn(), useCallback: fn => fn,
    };
    const hook = loadSource("lib/hooks/usePrefersReducedMotion.ts", { react });
    const provider = loadSource("components/providers/ThemeProvider.tsx", {
      react,
      "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
      // A render-time media preference would differ between these environments.
      "framer-motion": { MotionConfig: "motion", useReducedMotion: () => browser ? true : null },
      "next/navigation": { usePathname: () => "/" },
      "@/lib/hooks/usePrefersReducedMotion": hook,
      "@/lib/themes": themes, "@/lib/appearance": appearance,
    });
    return provider.ThemeProvider({ children: null }).props.value.reduced;
  }
  assert.equal(initialRender(false), false);
  assert.equal(initialRender(true), initialRender(false));
});

test("device motion preferences apply after hydration, follow changes, and unsubscribe", () => {
  let preference = false;
  let reads = 0;
  let listener;
  const effects = [];
  const media = {
    matches: true,
    addEventListener: (type, handler) => { assert.equal(type, "change"); listener = handler; },
    removeEventListener: (type, handler) => { assert.equal(type, "change"); assert.equal(handler, listener); listener = undefined; },
  };
  const hook = loadSource("lib/hooks/usePrefersReducedMotion.ts", {
    react: {
      useState: initial => { preference = initial; return [initial, next => { preference = next; }]; },
      useEffect: effect => effects.push(effect),
    },
  }, {
    window: { matchMedia: query => { reads++; assert.equal(query, "(prefers-reduced-motion: reduce)"); return media; } },
  });
  assert.equal(hook.usePrefersReducedMotion(), false);
  assert.equal(reads, 0, "do not read browser-only preferences during hydration");
  const cleanup = effects[0]();
  assert.equal(preference, true);
  listener({ matches: false });
  assert.equal(preference, false);
  listener({ matches: true });
  assert.equal(preference, true);
  cleanup();
  assert.equal(listener, undefined);
});
