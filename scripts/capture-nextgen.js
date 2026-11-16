import { chromium } from 'playwright';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const baselineDir = path.join(rootDir, 'baseline');
const desktopDir = path.join(baselineDir, 'desktop');
const mobileDir = path.join(baselineDir, 'mobile');

fs.mkdirSync(desktopDir, { recursive: true });
fs.mkdirSync(mobileDir, { recursive: true });

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Starting preview server on port 4173...');
  const previewProc = spawn('npm.cmd', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
    cwd: rootDir,
    stdio: 'ignore',
    shell: true,
  });

  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch('http://localhost:4173/');
      if (res.ok) {
        ready = true;
        break;
      }
    } catch (e) {
      // retry
    }
    await wait(300);
  }

  if (!ready) {
    previewProc.kill();
    throw new Error('Preview server did not start in time');
  }

  console.log('Launching browser to capture Untitled UI & Gr8r Studio adapted views...');
  const browser = await chromium.launch({ headless: true });

  try {
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await desktopContext.newPage();

    // 1. Table View (Untitled UI Exact Layout from Image 3 & 4)
    await page.goto('http://localhost:4173/?view=nextgen', { waitUntil: 'networkidle' });
    await wait(800);
    await page.screenshot({ path: path.join(desktopDir, '15-next-gen-command-center.png'), fullPage: true });
    await page.screenshot({ path: path.join(desktopDir, '15-untitled-ui-all-candidates.png'), fullPage: true });

    // 2. Open Action Dropdown Menu (Image 5 exact menu)
    const menuBtn = await page.$('table tbody tr:first-child button');
    if (menuBtn) {
      await menuBtn.click();
      await wait(400);
      await page.screenshot({ path: path.join(desktopDir, '15-untitled-ui-dropdown-menu.png'), fullPage: true });

      // Click "Shortlist for Client" to trigger the exact toast from Image 5
      const shortlistBtn = await page.$('button:has-text("Shortlist for Client")');
      if (shortlistBtn) {
        await shortlistBtn.click();
        await wait(400);
        await page.screenshot({ path: path.join(desktopDir, '15-untitled-ui-toast.png'), fullPage: true });
      }
    }

    // 3. Switch to Kanban Board View
    const kanbanBtn = await page.$('button:has-text("Kanban Board")');
    if (kanbanBtn) {
      await kanbanBtn.click();
      await wait(500);
      await page.screenshot({ path: path.join(desktopDir, '15-untitled-ui-kanban.png'), fullPage: true });
    }

    await desktopContext.close();

    // 4. Mobile Capture
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:4173/?view=nextgen', { waitUntil: 'networkidle' });
    await wait(800);
    await mobilePage.screenshot({ path: path.join(mobileDir, '15-next-gen-command-center.png'), fullPage: true });
    await mobileContext.close();

    console.log('All Untitled UI views captured successfully.');
  } finally {
    await browser.close();
    previewProc.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
