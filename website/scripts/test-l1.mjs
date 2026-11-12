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

const PORT = 5195;

server.listen(PORT, async () => {
  console.log(`[PASS TEST L1] Running Light-Theme Invariants on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = fs.existsSync(chromePath)
    ? { executablePath: chromePath, headless: true }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  let failed = false;

  try {
    // Test (a): Emulated prefers-color-scheme: dark -> body background must still be rgb(255, 255, 255)
    {
      const context = await browser.newContext({
        colorScheme: 'dark'
      });
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      const bg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      const dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
      const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));

      console.log(`Test (a) Emulated dark colorScheme: body background=${bg}, data-theme=${dataTheme}, darkClass=${hasDarkClass}`);
      if (bg !== 'rgb(255, 255, 255)' || hasDarkClass) {
        console.error(`FAIL: Expected rgb(255, 255, 255) and no dark class, got ${bg}, hasDark=${hasDarkClass}`);
        failed = true;
      } else {
        console.log(`PASS Test (a): Emulated dark colorScheme defaults to pure light theme.`);
      }
      await context.close();
    }

    // Test (b): localStorage theme preset to dark -> still light on load
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      // Pre-seed localStorage before navigation
      await page.addInitScript(() => {
        try {
          localStorage.setItem('theme', 'dark');
        } catch (e) {}
      });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      const bg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      const hasDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));

      console.log(`Test (b) LocalStorage preset to dark: body background=${bg}, darkClass=${hasDarkClass}`);
      if (bg !== 'rgb(255, 255, 255)' || hasDarkClass) {
        console.error(`FAIL: Expected light theme even when localStorage has theme=dark`);
        failed = true;
      } else {
        console.log(`PASS Test (b): Pre-set dark in localStorage is ignored; page loads light.`);
      }
      await context.close();
    }

    // Test (c): Toggle to dark in memory, then reload -> returns to light
    {
      const context = await browser.newContext();
      const page = await context.newPage();
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      
      // Click toggle button
      const toggleBtn = page.locator('button[aria-label*="dark mode"], button[aria-label*="light mode"], button[aria-label*="Switch to"]').first();
      await toggleBtn.click();
      await page.waitForTimeout(300);

      const toggledDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      console.log(`Test (c) Toggled in-memory: darkClass=${toggledDarkClass}`);

      // Now reload
      await page.reload({ waitUntil: 'networkidle' });
      await page.waitForTimeout(300);

      const reloadedBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor;
      });
      const reloadedDarkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'));
      console.log(`Test (c) After reload: body background=${reloadedBg}, darkClass=${reloadedDarkClass}`);

      if (reloadedBg !== 'rgb(255, 255, 255)' || reloadedDarkClass) {
        console.error(`FAIL: Expected reload to return to light theme, got bg=${reloadedBg}, dark=${reloadedDarkClass}`);
        failed = true;
      } else {
        console.log(`PASS Test (c): Reload after toggling to dark returns to light.`);
      }
      await context.close();
    }

  } catch (err) {
    console.error('L1 test runner error:', err);
    failed = true;
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) {
    console.error('\n[L1 PASS TEST FAILED]');
    process.exit(1);
  } else {
    console.log('\n[L1 PASS TEST SUCCEEDED - ALL 3 INVARIANTS VERIFIED]');
    process.exit(0);
  }
});
