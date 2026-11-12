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

const PORT = 5225;

const VIEWPORTS = [
  { width: 320, height: 640, label: '320x640 (small mobile)' },
  { width: 375, height: 812, label: '375x812 (iPhone X/mini)' },
  { width: 390, height: 844, label: '390x844 (iPhone 12/13/14)' },
  { width: 412, height: 915, label: '412x915 (Pixel 7/Galaxy)' },
  { width: 768, height: 1024, label: '768x1024 (iPad portrait)' },
  { width: 820, height: 1180, label: '820x1180 (iPad Air portrait)' },
  { width: 1024, height: 768, label: '1024x768 (iPad landscape)' },
  { width: 1280, height: 800, label: '1280x800 (small laptop)' },
  { width: 1440, height: 900, label: '1440x900 (laptop desktop)' },
  { width: 1920, height: 1080, label: '1920x1080 (FHD desktop)' },
  { width: 2560, height: 1440, label: '2560x1440 (QHD desktop)' },
  { width: 812, height: 375, label: '812x375 (landscape phone)' }
];

server.listen(PORT, async () => {
  console.log(`[PASS TEST L4] Measuring Dock Clearance and Dock Scroll Target on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = fs.existsSync(chromePath)
    ? { executablePath: chromePath, headless: true }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  let failed = false;
  const clearanceRows = [];

  try {
    for (const viewMode of ['interactive', 'paper']) {
      for (const vp of VIEWPORTS) {
        const page = await browser.newPage({
          viewport: { width: vp.width, height: vp.height }
        });
        await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
        await page.waitForTimeout(400);

        if (viewMode === 'paper') {
          await page.evaluate(() => {
            const btns = Array.from(document.querySelectorAll('button'));
            const paperBtn = btns.find(b => b.textContent && b.textContent.includes('Paper'));
            if (paperBtn) paperBtn.click();
          });
          await page.waitForTimeout(500);
        }

        const metrics = await page.evaluate(async ({ vm }) => {
          // Scroll to the absolute bottom
          window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
          await new Promise(r => setTimeout(r, 400));

          const dock = document.querySelector('nav.dock-container div') || document.querySelector('nav.dock-container') || document.querySelector('[role="navigation"]');
          const dockRect = dock ? dock.getBoundingClientRect() : null;

          // Find the last visible text node/element in the page content (not the dock)
          const searchContainer = vm === 'paper' ? (document.querySelector('article') || document.body) : (document.querySelector('footer') || document.body);
          const textNodes = [];
          const walker = document.createTreeWalker(searchContainer, NodeFilter.SHOW_TEXT);
          let n;
          while ((n = walker.nextNode())) {
            const txt = n.textContent?.trim();
            if (txt && n.parentElement && !dock?.contains(n.parentElement)) {
              const r = n.parentElement.getBoundingClientRect();
              if (r.height > 0 && r.width > 0) {
                textNodes.push({ text: txt.slice(0, 35), bottom: r.bottom, top: r.top });
              }
            }
          }

          textNodes.sort((a, b) => b.bottom - a.bottom);
          const lastEl = textNodes[0] || null;

          let clearance = null;
          let pass = false;
          if (dockRect && lastEl) {
            clearance = dockRect.top - lastEl.bottom;
            pass = clearance >= 16;
          }

          return {
            dockTop: dockRect ? Math.round(dockRect.top) : null,
            dockHeight: dockRect ? Math.round(dockRect.height) : null,
            lastElBottom: lastEl ? Math.round(lastEl.bottom) : null,
            lastElText: lastEl ? lastEl.text : null,
            clearance: clearance !== null ? Math.round(clearance) : null,
            pass
          };
        }, { vm: viewMode });

        if (!metrics.pass) {
          console.error(`FAIL clearance at [${viewMode} | ${vp.width}x${vp.height}]: clearance=${metrics.clearance}px < 16px`);
          failed = true;
        }

        clearanceRows.push({
          View: viewMode,
          Viewport: `${vp.width}x${vp.height}`,
          'Dock Top': metrics.dockTop,
          'Dock Height': metrics.dockHeight,
          'Last Text Bottom': metrics.lastElBottom,
          'Clearance (px)': metrics.clearance,
          'Target >= 16px': metrics.pass ? 'PASS' : 'FAIL',
          'Dock Covers Line?': metrics.clearance < 0 ? 'YES' : 'NO'
        });

        await page.close();
      }
    }

    console.log('\n============================= L4 DOCK CLEARANCE TABLE =============================');
    console.table(clearanceRows);
    console.log('===================================================================================\n');

    // Section Scroll Verification from 16 dock items
    console.log('[L4] Verifying scroll-to-section lands within 120px of viewport top for all 16 items...');
    {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const navItems = await page.evaluate(() => {
        const anchors = Array.from(document.querySelectorAll('[data-dock-item]'));
        return anchors.map(a => ({
          label: a.getAttribute('data-dock-item'),
          href: a.getAttribute('href')
        })).filter(item => item.href && item.href.startsWith('#'));
      });

      console.log(`Found ${navItems.length} anchor dock navigation items to test.`);
      const scrollResults = [];

      for (const item of navItems) {
        const targetId = item.href.replace('#', '');
        await page.evaluate((id) => {
          const el = document.getElementById(id);
          if (el) {
            const offsetTop = el.getBoundingClientRect().top + window.pageYOffset - 70;
            window.scrollTo({ top: Math.max(0, offsetTop), behavior: 'instant' });
          }
        }, targetId);
        await page.waitForTimeout(200);

        const landTop = await page.evaluate((id) => {
          const el = document.getElementById(id);
          return el ? Math.round(el.getBoundingClientRect().top) : null;
        }, targetId);

        const ok = landTop !== null && landTop >= 0 && landTop <= 120;
        if (!ok) {
          console.error(`FAIL: dock item "${item.label}" target ${targetId} landed at top=${landTop}px (expected 0-120px)`);
          failed = true;
        }
        scrollResults.push({
          Item: item.label,
          Target: targetId,
          'Landed Top (px)': landTop,
          'Within 120px': ok ? 'PASS' : 'FAIL'
        });
      }

      console.table(scrollResults);
      await page.close();
    }

    fs.writeFileSync(path.join(outDir, 'l4-clearance-results.json'), JSON.stringify(clearanceRows, null, 2));

  } catch (err) {
    console.error('L4 test runner error:', err);
    failed = true;
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) {
    console.error('[L4 PASS TEST FAILED]');
    process.exit(1);
  } else {
    console.log('[L4 PASS TEST SUCCEEDED - ALL DOCK CLEARANCES >=16px & SCROLL TARGETS VERIFIED]');
    process.exit(0);
  }
});
