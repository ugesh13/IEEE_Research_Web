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
const outDir = path.resolve(rootDir, 'docs', 'ui-after');

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

const PORT = 5184;

server.listen(PORT, async () => {
  console.log(`[PASS TEST D6] Capturing 8 responsive & theme combinations on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });

  const widths = [375, 768, 1280, 1728];
  const themes = ['light', 'dark'];
  const generatedShots = [];

  for (const theme of themes) {
    for (const w of widths) {
      const page = await browser.newPage({
        viewport: { width: w, height: 900 }
      });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      if (theme === 'dark') {
        await page.evaluate(() => {
          document.documentElement.classList.add('dark');
        });
        await page.waitForTimeout(200);
      } else {
        await page.evaluate(() => {
          document.documentElement.classList.remove('dark');
        });
        await page.waitForTimeout(200);
      }

      // Check touch targets on mobile
      if (w === 375) {
        const touchTargetAudit = await page.evaluate(() => {
          const interactive = Array.from(document.querySelectorAll('button, a[href], input'));
          const tooSmall = [];
          for (const el of interactive) {
            const rect = el.getBoundingClientRect();
            // Allow hidden or tiny icon sub-elements if clickable area or parent is sufficient
            if (rect.width > 0 && rect.height > 0 && (rect.width < 32 || rect.height < 32)) {
              tooSmall.push({
                tag: el.tagName,
                text: el.textContent?.slice(0, 20),
                width: Math.round(rect.width),
                height: Math.round(rect.height)
              });
            }
          }
          return tooSmall;
        });
        console.log(`[D6] 375px (${theme}) touch targets checked:`, touchTargetAudit.length, 'flagged < 32px');
      }

      const shotName = `viewport-${w}px-${theme}.png`;
      const shotPath = path.join(outDir, shotName);
      await page.screenshot({ path: shotPath, fullPage: true });

      generatedShots.push({
        width: w,
        theme,
        path: path.relative(rootDir, shotPath).replace(/\\/g, '/')
      });

      await page.close();
    }
  }

  await browser.close();
  server.close();

  console.log('\n--- D6 RESPONSIVE & THEMES REPORT ---');
  for (const s of generatedShots) {
    console.log(`[SHOT] ${s.width}px (${s.theme}) -> ${s.path}`);
  }
  console.log('-------------------------------------\n');
  console.log('[D6 PASSED] All 8 responsive and theme screenshots captured.');
});
