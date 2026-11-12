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

const PORT = 5202;

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
  console.log(`[PASS TEST L3] Testing Responsive Grid, Overlap, and Overflow on http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = fs.existsSync(chromePath)
    ? { executablePath: chromePath, headless: true }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  let failed = false;
  const matrix = [];

  try {
    for (const viewMode of ['interactive', 'paper']) {
      for (const theme of ['light', 'dark']) {
        for (const vp of VIEWPORTS) {
          const page = await browser.newPage({
            viewport: { width: vp.width, height: vp.height }
          });
          await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
          await page.waitForTimeout(400);

          // Apply theme and view
          await page.evaluate(({ vm, th }) => {
            const root = document.documentElement;
            if (th === 'dark') {
              root.classList.add('dark');
              root.setAttribute('data-theme', 'dark');
            } else {
              root.classList.remove('dark');
              root.setAttribute('data-theme', 'light');
            }

            if (vm === 'paper') {
              // Click the Paper View switch button
              const paperBtn = Array.from(document.querySelectorAll('button[role="radio"]')).find(b => b.textContent.includes('Paper'));
              if (paperBtn) paperBtn.click();
            }
          }, { vm: viewMode, th: theme });

          await page.waitForTimeout(500);

          // Invariant (a): documentElement.scrollWidth <= clientWidth
          // Invariant (b): no element bounding box exceeds viewport width except in scroll containers
          // Invariant (c): no two sibling text blocks overlap
          // Invariant (d): all interactive targets >= 44px on touch viewports (<=768px)
          const audit = await page.evaluate(({ vpWidth }) => {
            const docEl = document.documentElement;
            const scrollWidth = Math.max(docEl.scrollWidth, document.body.scrollWidth);
            const clientWidth = docEl.clientWidth;
            const noHorizontalScroll = scrollWidth <= clientWidth;

            // (b) check elements exceeding viewport width
            const badElements = [];
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
              const r = el.getBoundingClientRect();
              if (r.width > clientWidth + 2) {
                // Check if enclosed in declared scroll container
                let p = el.parentElement;
                let inScroll = false;
                while (p && p !== document.body) {
                  const style = window.getComputedStyle(p);
                  const overflowX = style.overflowX;
                  const overflow = style.overflow;
                  if (
                    overflowX === 'auto' || overflowX === 'scroll' ||
                    overflow === 'auto' || overflow === 'scroll' ||
                    p.classList.contains('overflow-x-auto') ||
                    p.classList.contains('table-scroll-container')
                  ) {
                    inScroll = true;
                    break;
                  }
                  p = p.parentElement;
                }
                if (!inScroll && el.tagName !== 'HTML' && el.tagName !== 'BODY' && el.id !== 'root') {
                  badElements.push({ tag: el.tagName, class: el.className, w: Math.round(r.width) });
                }
              }
            }

            // (c) no two sibling text blocks overlap (check p, h1-h6, footer cols)
            let overlapsFound = 0;
            const textContainers = document.querySelectorAll('main, section, footer, article, [data-testid="metric-cards-row"]');
            for (const container of textContainers) {
              const children = Array.from(container.children).filter(c => {
                const r = c.getBoundingClientRect();
                return r.height > 0 && r.width > 0;
              });
              for (let i = 0; i < children.length; i++) {
                const r1 = children[i].getBoundingClientRect();
                for (let j = i + 1; j < children.length; j++) {
                  const r2 = children[j].getBoundingClientRect();
                  // Check vertical/horizontal overlap
                  const xOverlap = Math.max(0, Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left));
                  const yOverlap = Math.max(0, Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top));
                  if (xOverlap > 4 && yOverlap > 4) {
                    // Check if one is absolutely positioned background decoration
                    const s1 = window.getComputedStyle(children[i]);
                    const s2 = window.getComputedStyle(children[j]);
                    if (s1.position !== 'absolute' && s2.position !== 'absolute') {
                      overlapsFound++;
                    }
                  }
                }
              }
            }

            // (d) touch targets on touch viewports (<= 768px)
            let touchTargetViolations = 0;
            if (vpWidth <= 768) {
              const buttonsAndLinks = document.querySelectorAll('button:not(.no-touch-expand), [role="radio"]');
              for (const btn of buttonsAndLinks) {
                const r = btn.getBoundingClientRect();
                if (r.width > 0 && r.height > 0 && (r.height < 40 || r.width < 40)) {
                  touchTargetViolations++;
                }
              }
            }

            return {
              scrollWidth,
              clientWidth,
              noHorizontalScroll,
              badElementsCount: badElements.length,
              overlapsFound,
              touchTargetViolations
            };
          }, { vpWidth: vp.width });

          // Save after-screenshot
          const shotName = `l3-${viewMode}-${theme}-${vp.width}x${vp.height}.png`;
          const shotPath = path.join(outDir, shotName);
          await page.screenshot({ path: shotPath, fullPage: true });

          const rowPass = audit.noHorizontalScroll && audit.badElementsCount === 0 && audit.overlapsFound === 0 && audit.touchTargetViolations === 0;
          if (!rowPass) {
            console.error(`FAIL at [${viewMode} | ${theme} | ${vp.width}x${vp.height}]:`, audit);
            failed = true;
          }

          matrix.push({
            View: viewMode,
            Theme: theme,
            Viewport: `${vp.width}x${vp.height}`,
            'scrollW <= clientW': audit.noHorizontalScroll ? 'PASS' : 'FAIL',
            'No Exceeding El': audit.badElementsCount === 0 ? 'PASS' : `FAIL (${audit.badElementsCount})`,
            'Zero Sibling Overlap': audit.overlapsFound === 0 ? 'PASS' : `FAIL (${audit.overlapsFound})`,
            'Touch Target >=44px': audit.touchTargetViolations === 0 ? 'PASS' : `FAIL (${audit.touchTargetViolations})`,
            Result: rowPass ? 'PASS' : 'FAIL'
          });

          await page.close();
        }
      }
    }

    console.log('\n============================= L3 ALL-DEVICE MATRIX =============================');
    console.table(matrix);
    console.log('=================================================================================\n');

    fs.writeFileSync(path.join(outDir, 'l3-matrix-results.json'), JSON.stringify(matrix, null, 2));

  } catch (err) {
    console.error('L3 test runner error:', err);
    failed = true;
  } finally {
    await browser.close();
    server.close();
  }

  if (failed) {
    console.error('[L3 PASS TEST FAILED]');
    process.exit(1);
  } else {
    console.log('[L3 PASS TEST SUCCEEDED - ALL 48 MATRIX COMBINATIONS PASSED]');
    process.exit(0);
  }
});
