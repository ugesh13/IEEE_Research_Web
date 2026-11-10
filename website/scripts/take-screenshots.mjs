import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.resolve(projectRoot, 'dist');
const screenshotsDir = path.resolve(projectRoot, 'screenshots');

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

// Simple static server
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
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
    // SPA fallback
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

const PORT = 5199;

server.listen(PORT, async () => {
  console.log(`[server] Static preview server running at http://localhost:${PORT}`);

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  if (!fs.existsSync(chromePath)) {
    console.error('[error] Chrome executable not found at:', chromePath);
    server.close();
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const sections = [
    { id: 'hero', name: '01_hero' },
    { id: 'approach', name: '02_approach' },
    { id: 'dataset', name: '03_dataset' },
    { id: 'leakage-design', name: '04_leakage' },
    { id: 'experimental-design', name: '05_experiments' },
    { id: 'results', name: '06_results' },
    { id: 'explainability', name: '07_explainability' },
    { id: 'subgroups', name: '08_subgroups' },
    { id: 'robustness', name: '09_robustness' },
    { id: 'discussion', name: '10_discussion' },
    { id: 'resources', name: '11_resources' },
  ];

  try {
    const page = await browser.newPage();

    // 1. Desktop Screenshots
    console.log('\n--- Capturing Desktop Screenshots (1280x900) ---');
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    for (const sec of sections) {
      const el = await page.$(`#${sec.id}`);
      if (el) {
        const outPath = path.join(screenshotsDir, `${sec.name}_desktop.png`);
        await el.screenshot({ path: outPath });
        console.log(`[desktop] Captured: ${sec.name}_desktop.png`);
      } else {
        console.warn(`[desktop] Section #${sec.id} not found!`);
      }
    }

    // 2. Mobile Screenshots
    console.log('\n--- Capturing Mobile Screenshots (375x812) ---');
    await page.setViewport({ width: 375, height: 812, deviceScaleFactor: 2, isMobile: true });
    await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0' });

    for (const sec of sections) {
      const el = await page.$(`#${sec.id}`);
      if (el) {
        const outPath = path.join(screenshotsDir, `${sec.name}_mobile.png`);
        await el.screenshot({ path: outPath });
        console.log(`[mobile] Captured: ${sec.name}_mobile.png`);
      } else {
        console.warn(`[mobile] Section #${sec.id} not found!`);
      }
    }

    console.log('\n[success] All 22 section screenshots captured successfully in website/screenshots/');
  } catch (err) {
    console.error('[screenshot error]', err);
  } finally {
    await browser.close();
    server.close();
    process.exit(0);
  }
});

