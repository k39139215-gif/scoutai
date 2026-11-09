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

const views = [
  { id: 'dashboard', name: '01-dashboard' },
  { id: 'jobs', name: '02-job-requisitions' },
  { id: 'candidates', name: '03-candidates-directory' },
  { id: 'talent-studio', name: '04-talent-studio' },
  { id: 'sourcing', name: '05-candidate-matching' },
  { id: 'outreach', name: '06-outreach-cadence' },
  { id: 'interviews', name: '07-interviews-schedule' },
  { id: 'tasks', name: '08-recruitment-tasks' },
  { id: 'ai-activity', name: '09-ai-audit-trail' },
  { id: 'analytics', name: '10-pipeline-analytics' },
  { id: 'clients', name: '11-client-accounts' },
  { id: 'privacy', name: '12-data-compliance-gdpr' },
  { id: 'security', name: '13-security-access' },
  { id: 'settings', name: '14-system-settings' },
];

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Building app for baseline capture...');
  const buildProc = spawn('npm.cmd', ['run', 'build'], { cwd: rootDir, stdio: 'inherit', shell: true });
  await new Promise((resolve, reject) => {
    buildProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Build failed with code ${code}`));
    });
  });

  console.log('Starting preview server on port 4173...');
  const previewProc = spawn('npm.cmd', ['run', 'preview', '--', '--port', '4173', '--strictPort'], {
    cwd: rootDir,
    stdio: 'ignore',
    shell: true,
  });

  // Wait for server to be responsive
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

  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop captures (1440x900)
    const desktopContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
    });
    const desktopPage = await desktopContext.newPage();

    // Export localStorage demo data state from initial load
    await desktopPage.goto('http://localhost:4173/?view=dashboard', { waitUntil: 'networkidle' });
    await wait(500);

    const demoState = await desktopPage.evaluate(() => {
      const state = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('scoutai_')) {
          try {
            state[key] = JSON.parse(localStorage.getItem(key));
          } catch {
            state[key] = localStorage.getItem(key);
          }
        }
      }
      return state;
    });

    const statePath = path.join(baselineDir, 'demo-data-state.json');
    fs.writeFileSync(statePath, JSON.stringify(demoState, null, 2), 'utf-8');
    console.log(`Saved demo state (${Object.keys(demoState).length} keys) to: ${statePath}`);

    for (const v of views) {
      console.log(`Capturing desktop [1440x900]: ${v.name} (${v.id})...`);
      await desktopPage.goto(`http://localhost:4173/?view=${v.id}`, { waitUntil: 'networkidle' });
      await wait(600);
      const outPath = path.join(desktopDir, `${v.name}.png`);
      await desktopPage.screenshot({ path: outPath, fullPage: true });
    }
    await desktopContext.close();

    // 2. Mobile captures (390x844)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 1,
    });
    const mobilePage = await mobileContext.newPage();

    for (const v of views) {
      console.log(`Capturing mobile [390x844]: ${v.name} (${v.id})...`);
      await mobilePage.goto(`http://localhost:4173/?view=${v.id}`, { waitUntil: 'networkidle' });
      await wait(600);
      const outPath = path.join(mobileDir, `${v.name}.png`);
      await mobilePage.screenshot({ path: outPath, fullPage: true });
    }
    await mobileContext.close();

    console.log('Visual baseline capture complete!');
  } finally {
    await browser.close();
    previewProc.kill();
  }
}

main().catch((err) => {
  console.error('Error during baseline capture:', err);
  process.exit(1);
});
