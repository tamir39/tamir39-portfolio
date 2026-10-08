// Keep the supplied silhouette inside a padded circle so tab colors cannot swallow it.
const fs = require('node:fs/promises');
const vm = require('node:vm');
const ts = require('typescript');
const sharp = require('sharp');
async function load(file, imports = {}) {
  const exports = {};
  vm.runInNewContext(ts.transpileModule(await fs.readFile(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, require: name => imports[name] });
  return exports;
}
(async () => {
  const themes = await load('lib/themes.ts');
  const { darkSwatches } = await load('lib/appearance.ts', { './themes': themes });
  const directory = 'public/brand/favicons';
  await fs.mkdir(directory, { recursive: true });
  const alpha = await sharp('public/brand/cat-monochrome.png').trim().resize(44, 44, { fit: 'contain', background: '#00000000' }).extractChannel('alpha').raw().toBuffer();
  for (const theme of themes.themes) {
    for (const mode of ['light', 'dark']) {
      // A light badge in both modes stays distinct on dark, light, and colored tabs.
      const ink = mode === 'dark' ? darkSwatches[theme.id].paper : theme.color;
      const paper = mode === 'dark' ? darkSwatches[theme.id].ink : theme.paper;
      const circle = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="30" fill="${paper}" stroke="${ink}" stroke-opacity=".3" stroke-width="1.5"/></svg>`);
      const logo = await sharp({ create: { width: 44, height: 44, channels: 3, background: ink } }).joinChannel(alpha, { raw: { width: 44, height: 44, channels: 1 } }).png().toBuffer();
      const png = await sharp(circle).composite([{ input: logo, left: 10, top: 10 }]).png().toBuffer();
      await fs.writeFile(`${directory}/${theme.id}-${mode}.png`, png);
      if (theme.id === 'editorial' && mode === 'light') await fs.writeFile('app/icon.png', png);
    }
  }
  console.log('Created ten padded circular theme favicons and updated the default app icon.');
})();
