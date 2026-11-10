import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function prerender() {
  const templatePath = path.resolve(projectRoot, 'dist', 'index.html');
  const ssrBundlePath = path.resolve(projectRoot, 'dist-ssr', 'App.js');

  if (!fs.existsSync(templatePath) || !fs.existsSync(ssrBundlePath)) {
    console.error('Template or SSR bundle missing. Ensure vite build has run.');
    process.exit(1);
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  const appModule = await import(pathToFileURL(ssrBundlePath).href);
  const App = appModule.default || appModule.App;

  const appHtml = ReactDOMServer.renderToString(React.createElement(App));
  const finalHtml = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  fs.writeFileSync(templatePath, finalHtml, 'utf-8');
  console.log(`[prerender] Pre-rendered ${appHtml.length} characters into dist/index.html`);

  // Clean up dist-ssr
  fs.rmSync(path.resolve(projectRoot, 'dist-ssr'), { recursive: true, force: true });
}

prerender().catch((err) => {
  console.error('[prerender error]', err);
  process.exit(1);
});
