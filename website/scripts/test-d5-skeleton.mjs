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
const outDir = path.resolve(rootDir, 'docs', 'ui-loading');

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

const PORT = 5183;

server.listen(PORT, async () => {
  console.log(`[PASS TEST D5] Testing skeleton loading on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));

  // Track CLS
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}
  });

  // Load initial page first
  console.log('[D5] Loading initial page...');
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Now attach CDP session and throttle to Slow 4G for lazy chunk fetch
  console.log('[D5] Enabling Slow 4G throttle for async chunk loading...');
  const cdp = await context.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 300,
    downloadThroughput: (400 * 1024) / 8, // 400 kbps
    uploadThroughput: (400 * 1024) / 8,
    connectionType: 'cellular3g'
  });

  // Switch to Paper View to trigger lazy import and Suspense fallback
  console.log('[D5] Triggering lazy load of Paper View chunk...');
  await page.click('button:has-text("Paper View")');

  // Immediately check for skeleton in DOM
  await page.waitForTimeout(100);
  const loadingShot = path.join(outDir, 'slow4g-loading.png');
  await page.screenshot({ path: loadingShot });
  console.log(`[D5] Captured loading screenshot: ${path.relative(rootDir, loadingShot).replace(/\\/g, '/')}`);

  const hasSkeleton = await page.evaluate(() => {
    return !!document.querySelector('[aria-busy="true"]');
  });
  console.log(`[D5] Skeleton elements detected while loading: ${hasSkeleton}`);

  // Restore network speed so chunk resolves
  await cdp.send('Network.emulateNetworkConditions', {
    offline: false,
    latency: 0,
    downloadThroughput: -1,
    uploadThroughput: -1
  });

  // Wait for Paper View to finish loading
  await page.waitForSelector('h1', { timeout: 15000 });
  await page.waitForTimeout(400);

  const loadedShot = path.join(outDir, 'slow4g-loaded.png');
  await page.screenshot({ path: loadedShot });
  console.log(`[D5] Captured loaded screenshot: ${path.relative(rootDir, loadedShot).replace(/\\/g, '/')}`);

  const cls = await page.evaluate(() => window.__cls);
  console.log(`\n--- D5 SKELETON REPORT ---`);
  console.log(`Loading screenshot: ${path.relative(rootDir, loadingShot).replace(/\\/g, '/')}`);
  console.log(`Loaded screenshot:  ${path.relative(rootDir, loadedShot).replace(/\\/g, '/')}`);
  console.log(`Skeleton detected:  ${hasSkeleton}`);
  console.log(`Cumulative Layout Shift (CLS): ${cls.toFixed(4)} (threshold: < 0.05)`);
  console.log('--------------------------\n');

  await browser.close();
  server.close();

  if (hasSkeleton && cls < 0.05) {
    console.log('[D5 PASSED] Skeleton appeared during Slow 4G loading and CLS < 0.05.');
    process.exit(0);
  } else {
    console.error(`[D5 FAILED] hasSkeleton=${hasSkeleton}, cls=${cls}`);
    process.exit(1);
  }
});
