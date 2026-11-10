import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = 4173;

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

function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 10 * 1024 * 1024 }, (err, stdout, stderr) => {
      if (err) resolve({ err, stdout, stderr });
      else resolve({ stdout, stderr });
    });
  });
}

server.listen(PORT, async () => {
  console.log(`[server] Running on http://127.0.0.1:${PORT}`);
  
  const desktopOut = path.resolve(__dirname, 'lighthouse-desktop.json');
  const mobileOut = path.resolve(__dirname, 'lighthouse-mobile.json');

  const chromeFlags = '--headless=new --no-sandbox --disable-gpu';

  console.log('[lighthouse] Running desktop audit...');
  const desktopCmd = `npx lighthouse http://127.0.0.1:${PORT} --preset=desktop --output=json --output-path="${desktopOut}" --chrome-flags="${chromeFlags}" --quiet`;
  await runCommand(desktopCmd);

  console.log('[lighthouse] Running mobile audit...');
  const mobileCmd = `npx lighthouse http://127.0.0.1:${PORT} --form-factor=mobile --output=json --output-path="${mobileOut}" --chrome-flags="${chromeFlags}" --quiet`;
  await runCommand(mobileCmd);

  function parseReport(file, name) {
    if (!fs.existsSync(file)) {
      console.error(`[error] ${name} report not found`);
      return;
    }
    const report = JSON.parse(fs.readFileSync(file, 'utf8'));
    const categories = report.categories;
    console.log(`\n=== LIGHTHOUSE SCORES: ${name.toUpperCase()} ===`);
    for (const [key, cat] of Object.entries(categories)) {
      const score = Math.round(cat.score * 100);
      console.log(`- ${cat.title}: ${score}/100`);
    }

    // List audits below 90
    console.log(`\nIssues / Opportunities in ${name}:`);
    for (const [key, audit] of Object.entries(report.audits)) {
      if (audit.score !== null && audit.score < 0.9 && audit.title) {
        console.log(`  * [${audit.score}] ${audit.title}: ${audit.description?.slice(0, 100)}...`);
      }
    }
  }

  parseReport(desktopOut, 'Desktop');
  parseReport(mobileOut, 'Mobile');

  server.close();
  process.exit(0);
});

