import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

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

const PORT = 5180;

server.listen(PORT, async () => {
  console.log(`[PASS TEST D1] Checking scrollWidth <= clientWidth on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });

  const widths = [375, 768, 1280, 1728];
  let failed = false;

  for (const view of ['interactive', 'paper']) {
    console.log(`\n--- Testing View: ${view.toUpperCase()} ---`);
    for (const w of widths) {
      const page = await browser.newPage({ viewport: { width: w, height: 900 } });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      if (view === 'paper') {
        // click the Paper View switch button
        await page.click('button:has-text("Paper View")');
        await page.waitForTimeout(600);
      }

      const res = await page.evaluate(() => {
        const docEl = document.documentElement;
        return {
          scrollWidth: docEl.scrollWidth,
          clientWidth: docEl.clientWidth,
          overflow: docEl.scrollWidth - docEl.clientWidth
        };
      });

      const pass = res.scrollWidth <= res.clientWidth;
      console.log(
        `[${pass ? 'PASS' : 'FAIL'}] Width ${w}px (${view}): scrollWidth=${res.scrollWidth}px, clientWidth=${res.clientWidth}px, overflow=${res.overflow}px`
      );

      if (!pass) {
        failed = true;
        // Identify culprits
        const culprits = await page.evaluate((vw) => {
          return Array.from(document.querySelectorAll('*'))
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.right > vw + 1 || r.left < -1;
            })
            .map((el) => ({
              tag: el.tagName,
              id: el.id,
              class: el.className?.toString?.().slice(0, 50),
              right: Math.round(el.getBoundingClientRect().right)
            }))
            .slice(0, 5);
        }, w);
        console.log(`   Culprits:`, culprits);
      }

      await page.close();
    }
  }

  await browser.close();
  server.close();

  if (failed) {
    console.error('\n[D1 FAILED] Overflow detected on one or more viewports.');
    process.exit(1);
  } else {
    console.log('\n[D1 PASSED] document.documentElement.scrollWidth <= clientWidth on all viewports and both views.');
    process.exit(0);
  }
});
