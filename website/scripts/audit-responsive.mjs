import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const screenshotsDir = path.resolve(__dirname, '..', 'screenshots');
const PORT = 4174;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const viewports = [
  { name: 'mobile-375', width: 375, height: 812, isMobile: true },
  { name: 'tablet-768', width: 768, height: 1024, isMobile: false },
  { name: 'desktop-1440', width: 1440, height: 900, isMobile: false },
];

const sections = [
  'hero',
  'approach',
  'dataset',
  'leakage-design',
  'experimental-design',
  'results',
  'explainability',
  'subgroups',
  'robustness',
  'discussion',
  'resources',
];

server.listen(PORT, async () => {
  console.log(`[server] Running on http://127.0.0.1:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  const overflowIssues = [];

  for (const vp of viewports) {
    console.log(`\n--- Testing Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 2, isMobile: vp.isMobile });
    await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0' });

    // Test Light Mode Overflow
    const lightOverflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const sectionOverflows = [];
      document.querySelectorAll('section').forEach(sec => {
        if (sec.scrollWidth > winW) {
          sectionOverflows.push({ id: sec.id, scrollW: sec.scrollWidth, winW });
        }
      });
      return { hasOverflow: docW > winW, docW, winW, sectionOverflows };
    });

    console.log(`[Light Mode] Document width: ${lightOverflow.docW}px, window: ${lightOverflow.winW}px. Overflow: ${lightOverflow.hasOverflow}`);
    if (lightOverflow.hasOverflow) {
      overflowIssues.push({ vp: vp.name, mode: 'light', ...lightOverflow });
    }

    // Toggle Dark Mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // Test Dark Mode Overflow
    const darkOverflow = await page.evaluate(() => {
      const docW = document.documentElement.scrollWidth;
      const winW = window.innerWidth;
      const sectionOverflows = [];
      document.querySelectorAll('section').forEach(sec => {
        if (sec.scrollWidth > winW) {
          sectionOverflows.push({ id: sec.id, scrollW: sec.scrollWidth, winW });
        }
      });
      return { hasOverflow: docW > winW, docW, winW, sectionOverflows };
    });

    console.log(`[Dark Mode] Document width: ${darkOverflow.docW}px, window: ${darkOverflow.winW}px. Overflow: ${darkOverflow.hasOverflow}`);
    if (darkOverflow.hasOverflow) {
      overflowIssues.push({ vp: vp.name, mode: 'dark', ...darkOverflow });
    }

    // Take sample screenshots for 375, 768, 1440
    for (const secId of ['hero', 'results', 'explainability', 'subgroups']) {
      const el = await page.$(`#${secId}`);
      if (el) {
        const outPath = path.join(screenshotsDir, `${secId}_${vp.name}_dark.png`);
        await el.screenshot({ path: outPath });
      }
    }
  }

  console.log('\n=== RESPONSIVE AUDIT RESULTS ===');
  console.log('Total overflow issues found:', overflowIssues.length);
  overflowIssues.forEach(iss => {
    console.log(`  * ${iss.vp} (${iss.mode}): docW=${iss.docW} vs winW=${iss.winW}`);
    iss.sectionOverflows.forEach(s => console.log(`      - Section #${s.id}: scrollWidth=${s.scrollW}`));
  });

  await browser.close();
  server.close();
  process.exit(0);
});

