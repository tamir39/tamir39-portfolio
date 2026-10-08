const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadTs(file, imports = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, require: name => imports[name] });
  return exports;
}
const themeModule = loadTs('lib/themes.ts');
const appearance = loadTs('lib/appearance.ts', { './themes': themeModule });
const keys = { theme: themeModule.THEME_STORAGE_KEY, appearance: appearance.APPEARANCE_STORAGE_KEY, motion: themeModule.MOTION_STORAGE_KEY };
function initialize(saved, systemDark, blocked = false) {
  const root = { dataset: {} };
  vm.runInNewContext(appearance.appearanceInitScript, {
    document: { documentElement: root },
    localStorage: { getItem: key => { if (blocked) throw Error('Storage disabled'); return saved[key] ?? null; } },
    window: { matchMedia: () => ({ matches: systemDark }) },
  });
  return { ...root.dataset };
}
for (const systemDark of [false, true]) {
  const expected = systemDark ? 'dark' : 'light';
  assert.equal(initialize({}, systemDark).appearance, expected);
  assert.equal(initialize({}, systemDark, true).appearance, expected);
  assert.equal(initialize({ [keys.appearance]: 'invalid' }, systemDark).appearance, expected);
  for (const choice of ['light', 'dark']) {
    const root = initialize({ [keys.appearance]: choice, [keys.theme]: 'blueprint', [keys.motion]: 'off' }, systemDark);
    assert.deepEqual(root, { theme: 'blueprint', appearancePreference: choice, appearance: choice, motion: 'off' });
  }
}
assert.equal(initialize({ [keys.theme]: 'invalid' }, false).theme, 'editorial');
console.log('First paint: saved preferences, system light/dark, invalid values and blocked storage passed.');

// Exercise the provider's real event handlers without changing OS settings.
const effects = [], states = [], listeners = new Map();
const root = { dataset: initialize({ [keys.appearance]: 'dark' }, false) };
const media = { matches: false, addEventListener: (_, fn) => listeners.set('media', fn), removeEventListener: () => listeners.delete('media') };
const react = {
  createContext: () => ({ Provider: 'provider' }), useContext: () => null,
  useState: initial => { const index = states.length; states.push(initial); return [initial, next => { states[index] = next; }]; },
  useCallback: fn => fn, useMemo: fn => fn(), useEffect: fn => effects.push(fn),
};
const providerCode = ts.transpileModule(fs.readFileSync('components/providers/ThemeProvider.tsx', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const providerExports = {};
vm.runInNewContext(providerCode, {
  exports: providerExports,
  require: name => ({ react, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }) }, 'framer-motion': { MotionConfig: 'motion' }, 'next/navigation': { usePathname: () => '/' }, '@/lib/hooks/usePrefersReducedMotion': { usePrefersReducedMotion: () => false }, '@/lib/themes': themeModule, '@/lib/appearance': appearance })[name],
  document: { documentElement: root, head: {}, querySelector: () => null, querySelectorAll: () => [] },
  MutationObserver: class { observe() {} disconnect() {} },
  window: { matchMedia: () => media, addEventListener: (name, fn) => listeners.set(name, fn), removeEventListener: name => listeners.delete(name) },
  localStorage: { setItem() {} }, getComputedStyle: () => ({ getPropertyValue: () => '#19151e' }),
});
const rendered = providerExports.ThemeProvider({ children: null });
const context = rendered.props.value;
const cleanup = effects.map(fn => fn());
assert.equal(root.dataset.appearance, 'dark', 'Mount must retain the pre-paint saved mode');
context.setAppearance('light');
media.matches = true; listeners.get('media')();
assert.equal(root.dataset.appearance, 'light', 'Explicit light overrides a system change');
context.setAppearance('system');
assert.equal(root.dataset.appearance, 'dark');
media.matches = false; listeners.get('media')();
assert.equal(root.dataset.appearance, 'light', 'System mode follows live OS changes');
listeners.get('storage')({ key: keys.appearance, newValue: 'dark' });
assert.equal(root.dataset.appearance, 'dark', 'Another tab updates the mode');
listeners.get('storage')({ key: keys.theme, newValue: 'play' });
assert.equal(root.dataset.theme, 'play', 'Another tab updates the style');
listeners.get('storage')({ key: keys.motion, newValue: 'off' });
assert.equal(root.dataset.motion, 'off');
listeners.get('storage')({ key: null, newValue: null });
assert.deepEqual({ ...root.dataset }, { theme: 'editorial', appearancePreference: 'system', appearance: 'light', motion: 'on' });
cleanup.forEach(fn => fn?.());
assert.equal(listeners.size, 0, 'Unsubscribe on unmount');
console.log('Provider: explicit overrides, live system changes, cross-tab preferences, storage reset and cleanup passed.');

function variables(block) {
  return Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[\da-f]{6});/gi)].map(match => [match[1], match[2]]));
}
const globals = fs.readFileSync('app/globals.css', 'utf8');
const light = fs.readFileSync('app/themes.css', 'utf8');
const dark = fs.readFileSync('app/appearance.css', 'utf8');
const defaults = { ...variables(globals.match(/@theme\s*{([^}]+)/)[1]), ...variables(light.match(/:root\s*{([^}]+)/)[1]) };
function luminance(hex) {
  const [r, g, b] = hex.slice(1).match(/../g).map(n => parseInt(n, 16) / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4);
  return r * .2126 + g * .7152 + b * .0722;
}
function ratio(a, b) { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); }
let checks = 0;
for (const theme of themeModule.themes) {
  const lightBlock = light.match(new RegExp(`html\\[data-theme="${theme.id}"\\]\\s*{([^}]+)`));
  const darkBlock = dark.match(new RegExp(`html\\[data-theme="${theme.id}"\\]\\[data-appearance="dark"\\]\\s*{([^}]+)`));
  assert.ok(darkBlock, `Missing dark palette: ${theme.id}`);
  for (const mode of ['light', 'dark']) {
    const colors = { ...defaults, ...variables(lightBlock?.[1] ?? ''), ...(mode === 'dark' ? variables(darkBlock[1]) : {}) };
    for (const foreground of ['--color-ink', '--color-muted', '--color-accent']) {
      for (const background of ['--color-paper', '--theme-panel', '--color-surface', '--theme-tint-a', '--theme-tint-b', '--theme-tint-c']) {
        const contrast = ratio(colors[foreground], colors[background]);
        assert.ok(contrast >= 4.5, `${theme.id} ${mode} ${foreground} on ${background}: ${contrast.toFixed(2)}`);
        checks++;
      }
    }
    for (const background of ['--theme-action', '--theme-action-hover']) {
      const contrast = ratio(colors['--theme-on-action'], colors[background]);
      assert.ok(contrast >= 4.5, `${theme.id} ${mode} action label: ${contrast.toFixed(2)}`);
      checks++;
    }
    assert.ok(ratio(colors['--theme-note-ink'], colors['--theme-note']) >= 4.5);
    checks++;
    if (mode === 'dark') {
      assert.equal(appearance.darkSwatches[theme.id].ink, colors['--color-accent']);
      assert.equal(appearance.darkSwatches[theme.id].paper, colors['--color-paper']);
    }
  }
}
console.log(`${checks} text, muted text, accent, action and note contrast checks passed across all ten palettes.`);
