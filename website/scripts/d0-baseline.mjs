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
const outDir = path.resolve(rootDir, 'docs', 'ui-before');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// MIME types for static preview server
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

const PORT = 5178;

server.listen(PORT, async () => {
  console.log(`[D0] Server listening on http://localhost:${PORT}`);
  
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = fs.existsSync(chromePath)
    ? { executablePath: chromePath, headless: true }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  const widths = [375, 768, 1280, 1728];
  const results = [];

  try {
    for (const w of widths) {
      const page = await browser.newPage({
        viewport: { width: w, height: 900 }
      });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000);

      const metrics = await page.evaluate(() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = docEl.clientWidth;
        const overflow = scrollWidth - clientWidth;
        return {
          scrollWidth,
          clientWidth,
          overflow,
          hasHorizontalScroll: overflow > 0
        };
      });

      const shotPath = path.join(outDir, `viewport-${w}px.png`);
      await page.screenshot({ path: shotPath, fullPage: true });

      results.push({
        width: w,
        ...metrics,
        screenshot: path.relative(rootDir, shotPath).replace(/\\/g, '/')
      });

      await page.close();
    }
  } catch (err) {
    console.error('[D0] Error measuring viewports:', err);
  } finally {
    await browser.close();
    server.close();
  }

  console.log('\n--- D0 BASELINE MEASUREMENTS (docs/ui-before/) ---');
  for (const r of results) {
    console.log(
      `Viewport ${r.width}px: clientWidth=${r.clientWidth}px, scrollWidth=${r.scrollWidth}px, overflow=${r.overflow}px, horizontalScroll=${r.hasHorizontalScroll}`
    );
    console.log(`  Screenshot saved: ${r.screenshot}`);
  }
  console.log('--------------------------------------------------\n');
});

