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
const outDir = path.resolve(rootDir, 'docs', 'l-before');

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

const PORT = 5192;

const VIEWPORTS = [
  { width: 320, height: 640, label: '320x640' },
  { width: 375, height: 812, label: '375x812' },
  { width: 390, height: 844, label: '390x844' },
  { width: 412, height: 915, label: '412x915' },
  { width: 768, height: 1024, label: '768x1024' },
  { width: 820, height: 1180, label: '820x1180' },
  { width: 1024, height: 768, label: '1024x768' },
  { width: 1280, height: 800, label: '1280x800' },
  { width: 1440, height: 900, label: '1440x900' },
  { width: 1920, height: 1080, label: '1920x1080' },
  { width: 2560, height: 1440, label: '2560x1440' },
  { width: 812, height: 375, label: '812x375' }
];

server.listen(PORT, async () => {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const launchOptions = fs.existsSync(chromePath)
    ? { executablePath: chromePath, headless: true }
    : { headless: true };

  const browser = await chromium.launch(launchOptions);
  const rows = [];

  try {
    for (const vp of VIEWPORTS) {
      const page = await browser.newPage({
        viewport: { width: vp.width, height: vp.height }
      });
      await page.goto(`http://localhost:${PORT}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(600);

      const shotFile = `l0-${vp.width}x${vp.height}.png`;
      const shotPath = path.join(outDir, shotFile);
      await page.screenshot({ path: shotPath, fullPage: true });

      const metrics = await page.evaluate(async () => {
        // Scroll down in steps and wait for any smooth scroll to settle
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
        await new Promise(r => setTimeout(r, 400));

        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth);
        const clientWidth = docEl.clientWidth;
        const overflow = Math.max(0, scrollWidth - clientWidth);

        // Find dock
        const dock = document.querySelector('nav.fixed') || document.querySelector('[role="navigation"]') || document.querySelector('.fixed.bottom-4');
        let dockRect = null;
        if (dock) {
          dockRect = dock.getBoundingClientRect();
        }

        // Find footer
        const footer = document.querySelector('footer');
        let lastElRect = null;
        let lastElText = '';
        if (footer) {
          const textNodes = [];
          const walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
          let n;
          while ((n = walker.nextNode())) {
            const txt = n.textContent?.trim();
            if (txt && n.parentElement) {
              const r = n.parentElement.getBoundingClientRect();
              if (r.height > 0) {
                textNodes.push({ text: txt, bottom: r.bottom, top: r.top });
              }
            }
          }
          if (textNodes.length > 0) {
            textNodes.sort((a, b) => b.bottom - a.bottom);
            lastElRect = textNodes[0];
            lastElText = textNodes[0].text;
          }
        }

        let clearance = null;
        let dockCoversLastLine = false;
        if (dockRect && lastElRect) {
          // Clearance between top of dock and bottom of last text element in the viewport
          clearance = dockRect.top - lastElRect.bottom;
          dockCoversLastLine = clearance < 0;
        }

        return {
          scrollWidth,
          clientWidth,
          overflow,
          dockTop: dockRect ? Math.round(dockRect.top) : null,
          dockHeight: dockRect ? Math.round(dockRect.height) : null,
          lastElBottom: lastElRect ? Math.round(lastElRect.bottom) : null,
          lastElText: lastElText ? lastElText.slice(0, 35) : '',
          clearance: clearance !== null ? Math.round(clearance) : null,
          dockCoversLastLine
        };
      });

      rows.push({
        viewport: `${vp.width}x${vp.height}`,
        label: vp.label,
        scrollWidth: metrics.scrollWidth,
        clientWidth: metrics.clientWidth,
        overflow: metrics.overflow,
        dockTop: metrics.dockTop,
        dockHeight: metrics.dockHeight,
        lastElBottom: metrics.lastElBottom,
        lastElText: metrics.lastElText,
        clearance: metrics.clearance,
        dockCoversLastLine: metrics.dockCoversLastLine ? 'YES (COVERED)' : 'NO (CLEAR)'
      });

      await page.close();
    }

    console.log('\n============================= L0 BASELINE AUDIT TABLE =============================');
    console.table(rows.map(r => ({
      Viewport: r.viewport,
      'ScrollW / ClientW': `${r.scrollWidth} / ${r.clientWidth}`,
      'Overflow (px)': r.overflow,
      'Dock Top': r.dockTop,
      'Last Text Bottom': r.lastElBottom,
      'Clearance (px)': r.clearance,
      'Dock Covers Last Line?': r.dockCoversLastLine
    })));
    console.log('===================================================================================\n');

    fs.writeFileSync(path.join(outDir, 'baseline-results.json'), JSON.stringify(rows, null, 2));
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await browser.close();
    server.close();
  }
});
