import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '..', 'dist');
const PORT = 4175;

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

server.listen(PORT, async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 768, height: 1024 });
  await page.goto(`http://127.0.0.1:${PORT}`, { waitUntil: 'networkidle0' });

  const children = await page.evaluate(() => {
    const parent = document.querySelector('#experimental-design > div');
    const res = [];
    Array.from(parent.children).forEach((c, i) => {
      res.push({
        idx: i,
        tag: c.tagName,
        cls: c.className,
        offsetWidth: c.offsetWidth,
        scrollWidth: c.scrollWidth,
        clientW: c.clientWidth
      });
      c.querySelectorAll('*').forEach(sub => {
        if (sub.scrollWidth > 720 || sub.offsetWidth > 720) {
          res.push({
            subIdx: i,
            subTag: sub.tagName,
            subCls: sub.className,
            offsetWidth: sub.offsetWidth,
            scrollWidth: sub.scrollWidth,
            text: sub.innerText ? sub.innerText.slice(0, 30).replace(/\n/g, ' ') : ''
          });
        }
      });
    });
    return res;
  });

  console.log('Detailed child elements:', JSON.stringify(children, null, 2));

  await browser.close();
  server.close();
  process.exit(0);
});
