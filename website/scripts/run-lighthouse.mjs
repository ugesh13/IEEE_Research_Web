import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const repoRoot = path.resolve(__dirname, '..', '..');
const docsDir = path.resolve(repoRoot, 'docs');
const desktopOut = path.resolve(docsDir, 'lighthouse-desktop.json');
const mobileOut = path.resolve(docsDir, 'lighthouse-mobile.json');
const PORT = 4173;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
  const filePath = path.join(distDir, reqPath);
  const ext = path.extname(filePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else if (reqPath === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('User-agent: *\nAllow: /\n');
  } else {
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  }
});

function runCommand(cmd) {
  return new Promise((resolve) => {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const env = { ...process.env, CHROME_PATH: chromePath };
    exec(cmd, { env, maxBuffer: 30 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) resolve({ err, stdout, stderr });
      else resolve({ stdout, stderr });
    });
  });
}

server.listen(PORT, async () => {
  console.log(`[server] Running on http://127.0.0.1:${PORT}`);
  const chromeFlags = '--headless=new --no-sandbox --disable-gpu';

  console.log('\n[lighthouse] Running MOBILE audit...');
  const mobileCmd = `npx lighthouse http://127.0.0.1:${PORT} --output=json --output-path="${mobileOut}" --only-categories=performance,accessibility,best-practices,seo --chrome-flags="${chromeFlags}" --quiet`;
  const mobileRes = await runCommand(mobileCmd);
  if (mobileRes.err) {
    console.error('[mobile error]:', mobileRes.stderr || mobileRes.err);
  }

  console.log('\n[lighthouse] Running DESKTOP audit...');
  const desktopCmd = `npx lighthouse http://127.0.0.1:${PORT} --preset=desktop --throttling-method=simulate --output=json --output-path="${desktopOut}" --only-categories=performance,accessibility,best-practices,seo --chrome-flags="${chromeFlags}" --quiet`;
  const desktopRes = await runCommand(desktopCmd);
  if (desktopRes.err) {
    console.error('[desktop error]:', desktopRes.stderr || desktopRes.err);
  }

  const scores = {};

  if (fs.existsSync(mobileOut)) {
    const report = JSON.parse(fs.readFileSync(mobileOut, 'utf8'));
    scores.mobile = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
    };
  }

  if (fs.existsSync(desktopOut)) {
    const report = JSON.parse(fs.readFileSync(desktopOut, 'utf8'));
    scores.desktop = {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
    };
  }

  console.log('\n========================================');
  console.log('       LIGHTHOUSE 8 SCORES REPORT       ');
  console.log('========================================');
  console.log(`Mobile Performance:    ${scores.mobile?.performance} / 100 (Target: >=90)`);
  console.log(`Mobile Accessibility:  ${scores.mobile?.accessibility} / 100 (Target: >=90)`);
  console.log(`Mobile Best Practices: ${scores.mobile?.bestPractices} / 100 (Target: >=90)`);
  console.log(`Mobile SEO:            ${scores.mobile?.seo} / 100 (Target: >=90)`);
  console.log('----------------------------------------');
  console.log(`Desktop Performance:   ${scores.desktop?.performance} / 100 (Target: >=95)`);
  console.log(`Desktop Accessibility: ${scores.desktop?.accessibility} / 100 (Target: >=95)`);
  console.log(`Desktop Best Practices:${scores.desktop?.bestPractices} / 100 (Target: >=95)`);
  console.log(`Desktop SEO:           ${scores.desktop?.seo} / 100 (Target: >=95)`);
  console.log('========================================');

  let pass = true;
  if (!scores.mobile || scores.mobile.performance < 90 || scores.mobile.accessibility < 90 || scores.mobile.bestPractices < 90 || scores.mobile.seo < 90) pass = false;
  if (!scores.desktop || scores.desktop.performance < 95 || scores.desktop.accessibility < 95 || scores.desktop.bestPractices < 95 || scores.desktop.seo < 95) pass = false;

  server.close();
  if (pass) {
    console.log('\n[PASS] All 8 Lighthouse scores meet or exceed targets!');
    process.exit(0);
  } else {
    console.error('\n[FAIL] One or more Lighthouse scores did not meet target!');
    process.exit(1);
  }
});
