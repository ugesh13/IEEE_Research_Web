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

const PORT = 5230;

server.listen(PORT, async () => {
  console.log(`[PASS TEST AXE] Running axe-core accessibility audit in light theme (both views) on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  let failed = false;

  try {
    for (const view of ['interactive', 'paper']) {
      const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      if (view === 'paper') {
        await page.evaluate(() => {
          const btns = Array.from(document.querySelectorAll('button'));
          const paperBtn = btns.find(b => b.textContent && b.textContent.includes('Paper'));
          if (paperBtn) paperBtn.click();
        });
        await page.waitForTimeout(600);
      }

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      const seriousOrCritical = results.violations.filter(
        (v) => v.impact === 'serious' || v.impact === 'critical'
      );

      console.log(`\n--- AXE-CORE REPORT (${view.toUpperCase()} VIEW, LIGHT THEME) ---`);
      console.log(`Total violations: ${results.violations.length}`);
      console.log(`Serious / Critical: ${seriousOrCritical.length}`);

      if (seriousOrCritical.length > 0) {
        console.error(`[FAIL] Serious or critical violations found in ${view} view:`);
        for (const v of seriousOrCritical) {
          console.error(`- [${v.impact.toUpperCase()}] ${v.id}: ${v.description}`);
          for (const node of v.nodes) {
            console.error(`    target: ${node.target.join(' ')}`);
            console.error(`    html: ${node.html}`);
            console.error(`    failureSummary: ${node.failureSummary}`);
          }
        }
        failed = true;
      } else {
        console.log(`[PASS] 0 serious or critical violations in ${view} view.`);
      }

      await context.close();
    }
  } catch (err) {
    console.error(err);
    failed = true;
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
});
