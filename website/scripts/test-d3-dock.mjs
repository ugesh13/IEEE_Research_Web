import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const websiteDir = path.resolve(__dirname, '..');
const distDir = path.resolve(websiteDir, 'dist');

const expectedLabels = [
  'Overview',
  'Approach',
  'Dataset',
  'Leakage Gate',
  'Experiments',
  'Results',
  'Explainability',
  'Subgroups',
  'Robustness',
  'Discussion',
  'Claims',
  'Reproduction',
  'Supplement',
  'Resources',
  'PDF',
  'GitHub'
];

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

const PORT = 5181;

server.listen(PORT, async () => {
  console.log(`[PASS TEST D3] Testing Dock on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({ executablePath: chromePath, headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  let failed = false;

  // 1. Check top bar does NOT contain the 16 labels
  const topBarText = await page.evaluate(() => {
    const header = document.querySelector('header');
    return header ? header.textContent : '';
  });

  console.log('[D3] Checking top bar does not contain dock labels...');
  for (const label of expectedLabels) {
    if (topBarText.includes(label) && label !== 'Overview' && label !== 'PDF') {
      console.error(`[FAIL] Top bar contains dock label "${label}"`);
      failed = true;
    }
  }
  if (!failed) {
    console.log('[PASS] None of the section nav links exist in the top bar.');
  }

  // 2. Check Dock items
  const dockLabels = await page.evaluate(() => {
    const items = Array.from(document.querySelectorAll('[data-dock-item]'));
    return items.map((el) => el.getAttribute('data-label') || el.getAttribute('aria-label') || '');
  });

  console.log(`[D3] Found ${dockLabels.length} dock items:`, dockLabels);
  if (dockLabels.length !== 16) {
    console.error(`[FAIL] Expected exactly 16 dock items, found ${dockLabels.length}`);
    failed = true;
  } else {
    console.log('[PASS] Dock contains exactly 16 interactive items.');
  }

  for (let i = 0; i < expectedLabels.length; i++) {
    if (dockLabels[i] !== expectedLabels[i]) {
      console.error(`[FAIL] Item ${i}: expected "${expectedLabels[i]}", got "${dockLabels[i]}"`);
      failed = true;
    }
  }

  // 3. Test scrolling to section for all 14 in-page items
  console.log('\n[D3] Testing scroll positioning (section top <= 120px from viewport top)...');
  for (let i = 0; i < 14; i++) {
    const label = expectedLabels[i];
    const selector = `[data-dock-item][data-label="${label}"]`;
    await page.click(selector);
    await page.waitForTimeout(700);

    const sectionTop = await page.evaluate((lbl) => {
      const itemsMap = {
        'Overview': 'hero',
        'Approach': 'approach',
        'Dataset': 'dataset',
        'Leakage Gate': 'leakage-design',
        'Experiments': 'experimental-design',
        'Results': 'results',
        'Explainability': 'explainability',
        'Subgroups': 'subgroups',
        'Robustness': 'robustness',
        'Discussion': 'discussion',
        'Claims': 'claims',
        'Reproduction': 'reproduction',
        'Supplement': 'supplementary',
        'Resources': 'resources'
      };
      const id = itemsMap[lbl];
      const el = document.getElementById(id);
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return Math.round(rect.top);
    }, label);

    if (sectionTop === null) {
      console.error(`[FAIL] Section for "${label}" not found!`);
      failed = true;
    } else {
      const isWithin120 = sectionTop >= -50 && sectionTop <= 120;
      console.log(
        `[${isWithin120 ? 'PASS' : 'FAIL'}] "${label}" clicked -> section top = ${sectionTop}px (expected <= 120px)`
      );
      if (!isWithin120) failed = true;
    }
  }

  await browser.close();
  server.close();

  if (failed) {
    console.error('\n[D3 FAILED] One or more tests failed.');
    process.exit(1);
  } else {
    console.log('\n[D3 PASSED] All 16 dock items verified and scroll tests passed within 120px threshold.');
    process.exit(0);
  }
});
