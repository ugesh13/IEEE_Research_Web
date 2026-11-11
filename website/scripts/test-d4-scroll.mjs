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

const PORT = 5182;

server.listen(PORT, async () => {
  console.log(`[PASS TEST D4] Testing scroll smoothness & CLS on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const context = await browser.newContext();
  await context.tracing.start({ screenshots: true, snapshots: true });

  const page = await context.newPage();
  
  // Inject observers for CLS and Long Tasks before navigation
  await page.addInitScript(() => {
    window.__cls = 0;
    window.__longTasks = [];

    // CLS observer
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!entry.hadRecentInput) {
            window.__cls += entry.value;
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (e) {}

    // Long Tasks observer
    try {
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          window.__longTasks.push({
            duration: entry.duration,
            startTime: entry.startTime,
            name: entry.name
          });
        }
      }).observe({ entryTypes: ['longtask'] });
    } catch (e) {}
  });

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // Mark start of scrolling
  const scrollStartTime = await page.evaluate(() => performance.now());

  // Scripted full page scroll
  console.log('[D4] Scripting full-page scroll from top to bottom...');
  const maxScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
  const steps = 25;
  const stepSize = maxScroll / steps;

  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), i * stepSize);
    await page.waitForTimeout(40);
  }

  // Scroll back to top
  for (let i = steps; i >= 0; i--) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), i * stepSize);
    await page.waitForTimeout(20);
  }

  await page.waitForTimeout(500);

  const metrics = await page.evaluate((startTime) => {
    const scrollTasks = (window.__longTasks || []).filter(t => t.startTime >= startTime && t.duration > 50);
    return {
      cls: window.__cls,
      allLongTasksCount: (window.__longTasks || []).length,
      scrollLongTasks: scrollTasks
    };
  }, scrollStartTime);

  await context.tracing.stop({ path: path.resolve(websiteDir, '..', 'docs', 'scroll-trace.zip') });
  await browser.close();
  server.close();

  console.log('\n--- D4 METRICS REPORT ---');
  console.log(`Cumulative Layout Shift (CLS): ${metrics.cls.toFixed(4)} (threshold: < 0.05)`);
  console.log(`Total Long Tasks (>50ms): ${metrics.scrollLongTasks.length}`);
  if (metrics.scrollLongTasks.length > 0) {
    console.log('Long tasks detail:', metrics.scrollLongTasks);
  }
  console.log('-------------------------\n');

  const clsPass = metrics.cls < 0.05;
  const longTaskPass = metrics.scrollLongTasks.length === 0;

  if (clsPass && longTaskPass) {
    console.log(`[D4 PASSED] CLS = ${metrics.cls.toFixed(4)} (< 0.05) and 0 long tasks > 50ms from scroll handlers.`);
    process.exit(0);
  } else {
    console.error(`[D4 FAILED] clsPass=${clsPass}, longTaskPass=${longTaskPass}`);
    process.exit(1);
  }
});
