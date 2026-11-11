import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDir = path.resolve(__dirname, '..');
const distDir = path.resolve(websiteDir, 'dist');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 5185;

server.listen(PORT, async () => {
  console.log(`[PASS TEST AXE] Running axe-core accessibility audit on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  const seriousOrCritical = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical'
  );

  console.log('\n--- AXE-CORE AUDIT REPORT ---');
  console.log(`Total violations: ${results.violations.length}`);
  console.log(`Serious / Critical violations: ${seriousOrCritical.length}`);

  if (seriousOrCritical.length > 0) {
    console.error('[FAIL] Found serious or critical violations:');
    for (const v of seriousOrCritical) {
      console.error(`- [${v.impact.toUpperCase()}] ${v.id}: ${v.description}`);
      for (const node of v.nodes.slice(0, 3)) {
        console.error(`    Target: ${node.target.join(' ')}`);
        console.error(`    HTML:   ${node.html.slice(0, 100)}`);
      }
    }
  } else {
    console.log('[PASS] 0 serious or critical violations found by axe-core!');
  }
  console.log('-----------------------------\n');

  await browser.close();
  server.close();

  if (seriousOrCritical.length === 0) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});
