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

  console.log('Launching browser to capture Next-Gen views...');
  const browser = await chromium.launch({ headless: true });

  try {
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const page = await desktopContext.newPage();

    // 1. Kanban Board (Default)
    await page.goto('http://localhost:4173/?view=nextgen', { waitUntil: 'networkidle' });
    await wait(800);
    await page.screenshot({ path: path.join(desktopDir, '15-next-gen-command-center.png'), fullPage: true });

    // 1b. Waterfall Analytics View (Halo Reference HWyDSHebIAAJF8n)
    const waterfallBtn = await page.$('button:has-text("Waterfall Analytics")');
    if (waterfallBtn) {
      await waterfallBtn.click();
      await wait(500);
      await page.screenshot({ path: path.join(desktopDir, '15-next-gen-waterfall-view.png'), fullPage: true });
    }

    // 2. Table Grid
    const tableBtn = await page.$('button:has-text("Table Grid")');
    if (tableBtn) {
      await tableBtn.click();
      await wait(500);
      await page.screenshot({ path: path.join(desktopDir, '15-next-gen-table-view.png'), fullPage: true });
    }

    // 3. Radar Matrix
    const radarBtn = await page.$('button:has-text("Radar Matrix")');
    if (radarBtn) {
      await radarBtn.click();
      await wait(500);
      await page.screenshot({ path: path.join(desktopDir, '15-next-gen-radar-view.png'), fullPage: true });
    }

    // Return to board view
    const boardBtn = await page.$('button:has-text("Board")');
    if (boardBtn) {
      await boardBtn.click();
      await wait(400);
    }

    // 4. Connectors Popover Open
    const connBtn = await page.$('button:has-text("Connectors")');
    if (connBtn) {
      await connBtn.click();
      await wait(400);
      await page.screenshot({ path: path.join(desktopDir, '15-next-gen-connectors-popover.png'), fullPage: true });
      await connBtn.click(); // close it
      await wait(200);
    }

    // 5. AI Copilot Drawer Open
    const copilotBtn = await page.$('button:has-text("AI Copilot")');
    if (copilotBtn) {
      await copilotBtn.click();
      await wait(400);
      await page.screenshot({ path: path.join(desktopDir, '15-next-gen-with-copilot.png'), fullPage: true });
    }

    await desktopContext.close();

    // 6. Mobile capture
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:4173/?view=nextgen', { waitUntil: 'networkidle' });
    await wait(800);
    await mobilePage.screenshot({ path: path.join(mobileDir, '15-next-gen-command-center.png'), fullPage: true });
    await mobileContext.close();

    console.log('All 6 Next-Gen screenshots captured successfully.');
  } finally {
    await browser.close();
    previewProc.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
