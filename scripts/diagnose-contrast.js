import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const axeCorePath = path.join(rootDir, 'node_modules', 'axe-core', 'axe.min.js');

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const views = ['outreach', 'ai-activity'];

async function main() {
  const buildProc = spawn('npm.cmd', ['run', 'build'], { cwd: rootDir, stdio: 'inherit', shell: true });
  await new Promise((resolve, reject) => {
    buildProc.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Build failed with code ${code}`));
    });
  });

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
    for (const v of views) {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.goto(`http://localhost:4173/?view=${v}`, { waitUntil: 'networkidle' });
      await wait(500);
      await page.addScriptTag({ path: axeCorePath });
      const contrast = await page.evaluate(async () => {
        // @ts-ignore
        const res = await axe.run({
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa'],
          },
        });
        const seriousOrCritical = res.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
        return seriousOrCritical.map(viol => viol.nodes.map(n => ({
          id: viol.id,
          target: n.target.join(' '),
          html: n.html,
          summary: n.failureSummary,
        }))).flat();
      });
      console.log(`\n=== Contrast in [${v}] (${contrast.length} nodes) ===`);
      for (const c of contrast) {
        console.log(`- ID: ${c.id}`);
        console.log(`- TARGET: ${c.target}`);
        console.log(`- HTML: ${c.html}`);
        console.log(`  Summary: ${c.summary}`);
      }
      await page.close();
    }
  } finally {
    await browser.close();
    previewProc.kill();
  }
}

main().catch(console.error);
