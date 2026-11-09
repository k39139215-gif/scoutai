import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const axeCorePath = path.join(rootDir, 'node_modules', 'axe-core', 'axe.min.js');

const view = process.argv[2] || 'dashboard';

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
    const page = await browser.newPage();
    await page.goto(`http://localhost:4173/?view=${view}`);
    await page.addScriptTag({ path: axeCorePath });
    const report = await page.evaluate(async () => {
      // @ts-ignore
      const res = await axe.run({ runOnly: ['wcag2a', 'wcag2aa'] });
      return res.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          html: n.html,
          failureSummary: n.failureSummary,
        })),
      }));
    });
    console.log(JSON.stringify(report, null, 2));
  } finally {
    await browser.close();
    previewProc.kill();
  }
}

main().catch(console.error);
