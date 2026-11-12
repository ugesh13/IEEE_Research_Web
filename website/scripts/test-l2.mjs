import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDir = path.resolve(__dirname, '..');
const rootDir = path.resolve(websiteDir, '..');
const distDir = path.resolve(websiteDir, 'dist');
const outDir = path.resolve(rootDir, 'docs', 'l-after');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

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

const PORT = 5198;

server.listen(PORT, async () => {
  console.log(`[PASS TEST L2] Running View Switch alignment & Brand check on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = fs.existsSync(chromePath)
    ? { executablePath: chromePath, headless: true }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  let failed = false;
  const testWidths = [375, 768, 1280, 1920];

  try {
    for (const w of testWidths) {
      const page = await browser.newPage({
        viewport: { width: w, height: 900 }
      });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // (1) Assert no element with text "OULAD Study" or "Kumar & Sharma (2026)" exists in the top 80px
      const topBrandElements = await page.evaluate(() => {
        const matching = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while ((node = walker.nextNode())) {
          const txt = node.textContent?.trim() || '';
          if (txt.includes('OULAD Study') || txt.includes('Kumar & Sharma (2026)')) {
            const rect = node.parentElement?.getBoundingClientRect();
            if (rect && rect.top < 80) {
              matching.push({ text: txt, top: rect.top, bottom: rect.bottom });
            }
          }
        }
        return matching;
      });

      console.log(`[Width ${w}px] Top brand elements in top 80px: ${topBrandElements.length}`);
      if (topBrandElements.length > 0) {
        console.error(`FAIL: Found brand block in top 80px:`, topBrandElements);
        failed = true;
      }

      // (2) Assert switch's center x equals metric-row center x (+-2px) and switch bottom < metric-row top
      const alignment = await page.evaluate(() => {
        const switchEl = document.querySelector('[data-testid="view-switch-container"]') || document.getElementById('hero-view-switch');
        const metricRow = document.querySelector('[data-testid="metric-cards-row"]') || document.getElementById('metric-cards-row');
        if (!switchEl || !metricRow) return null;

        const sRect = switchEl.getBoundingClientRect();
        const mRect = metricRow.getBoundingClientRect();

        const sCenterX = sRect.left + sRect.width / 2;
        const mCenterX = mRect.left + mRect.width / 2;
        const deltaX = Math.abs(sCenterX - mCenterX);
        const gap = mRect.top - sRect.bottom;

        // Also check switch inner segmented control height
        const segmented = switchEl.querySelector('[role="radiogroup"]');
        const segHeight = segmented ? segmented.getBoundingClientRect().height : sRect.height;

        return {
          switchCenterX: Math.round(sCenterX * 10) / 10,
          metricCenterX: Math.round(mCenterX * 10) / 10,
          deltaX: Math.round(deltaX * 10) / 10,
          switchBottom: Math.round(sRect.bottom),
          metricTop: Math.round(mRect.top),
          gap: Math.round(gap),
          switchHeight: Math.round(segHeight)
        };
      });

      console.log(`[Width ${w}px] Alignment:`, alignment);
      if (!alignment) {
        console.error(`FAIL: ViewSwitch or MetricRow not found at ${w}px`);
        failed = true;
      } else {
        if (alignment.deltaX > 2.0) {
          console.error(`FAIL: Center X mismatch at ${w}px: deltaX=${alignment.deltaX}px > 2px`);
          failed = true;
        }
        if (alignment.switchBottom >= alignment.metricTop) {
          console.error(`FAIL: Switch bottom not strictly less than metric top at ${w}px: bottom=${alignment.switchBottom}, top=${alignment.metricTop}`);
          failed = true;
        }
        if (alignment.switchHeight < 44) {
          console.error(`FAIL: Switch height ${alignment.switchHeight}px < 44px on touch/display`);
          failed = true;
        }
      }

      // Save screenshots for 375 and 1440 as requested by prompt
      if (w === 375 || w === 1440) {
        const shotPath = path.join(outDir, `l2-switch-${w}px.png`);
        await page.screenshot({ path: shotPath, fullPage: false });
        console.log(`Saved screenshot to docs/l-after/l2-switch-${w}px.png`);
      }

      await page.close();
    }

    // Also check 1440 viewport specifically for screenshot
    {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      const shotPath = path.join(outDir, `l2-switch-1440px.png`);
      await page.screenshot({ path: shotPath, fullPage: false });
      console.log(`Saved screenshot to docs/l-after/l2-switch-1440px.png`);
      await page.close();
    }

  } catch (err) {
    console.error('L2 test runner error:', err);
    failed = true;
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) {
    console.error('\n[L2 PASS TEST FAILED]');
    process.exit(1);
  } else {
    console.log('\n[L2 PASS TEST SUCCEEDED - ALL INVARIANTS VERIFIED]');
    process.exit(0);
  }
});
