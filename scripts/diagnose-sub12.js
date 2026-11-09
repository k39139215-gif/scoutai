import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const previewProc = spawn('npm.cmd', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
    cwd: rootDir,
    stdio: 'ignore',
    shell: true,
  });

  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:4173/');
      if (res.ok) break;
    } catch {}
    await wait(300);
  }

  const browser = await chromium.launch({ headless: true });
  try {
    const routes = ['dashboard', 'jobs', 'candidates', 'outreach'];
    for (const r of routes) {
      const page = await browser.newPage();
      await page.goto(`http://localhost:4173/?view=${r}`);
      await wait(300);
      const sub12 = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('body *:not(script):not(style)'));
        const found = [];
        for (const el of els) {
          if (el.children.length === 0 && el.textContent.trim().length > 0) {
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden' && parseFloat(style.opacity) > 0) {
              const fs = parseFloat(style.fontSize);
              if (fs < 11.95) {
                found.push({ text: el.textContent.trim().slice(0, 40), size: fs, tag: el.tagName, cls: el.className });
              }
            }
          }
        }
        return found;
      });
      console.log(`Route [${r}] sub12 elements:`, sub12);
      await page.close();
    }
  } finally {
    await browser.close();
    previewProc.kill();
  }
}

main().catch(console.error);
