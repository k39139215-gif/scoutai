import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const artifactDir = 'C:\\Users\\kartik\\.gemini\\antigravity\\brain\\0b1f1eec-5af9-4400-982a-0836f7601c07';

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('Connecting to browser and capturing Untitled Studio views...');
  const browser = await chromium.launch({ headless: true });

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // 1. Table View (Untitled UI Exact Layout)
    await page.goto('http://localhost:4173/?view=untitled-studio', { waitUntil: 'networkidle' });
    await wait(1000);
    await page.screenshot({
      path: path.join(artifactDir, '16-untitled-studio-table-view.png'),
      fullPage: true,
    });
    console.log('Saved 16-untitled-studio-table-view.png');

    // 2. Open Action Dropdown Menu (Image 5 exact menu)
    // Find the more vertical button in the first candidate row
    const moreBtn = await page.locator('tbody tr button').first();
    if (await moreBtn.isVisible()) {
      await moreBtn.click();
      await wait(500);
      await page.screenshot({
        path: path.join(artifactDir, '16-untitled-studio-dropdown-menu.png'),
        fullPage: true,
      });
      console.log('Saved 16-untitled-studio-dropdown-menu.png');
    }

    // 3. Trigger action to show Image 5 floating Undo Toast
    const shortlistBtn = page.getByRole('button', { name: /shortlist for client/i });
    if (await shortlistBtn.isVisible()) {
      await shortlistBtn.click();
      await wait(500);
      await page.screenshot({
        path: path.join(artifactDir, '16-untitled-studio-undo-toast.png'),
        fullPage: false,
      });
      console.log('Saved 16-untitled-studio-undo-toast.png');
    }

    // 4. Switch to Kanban Board View (Gr8r Studio)
    const kanbanBtn = page.getByRole('button', { name: /kanban board/i });
    if (await kanbanBtn.isVisible()) {
      await kanbanBtn.click();
      await wait(500);
      await page.screenshot({
        path: path.join(artifactDir, '16-untitled-studio-kanban-view.png'),
        fullPage: true,
      });
      console.log('Saved 16-untitled-studio-kanban-view.png');
    }

    // 5. Mobile responsive viewport (390 x 844 iPhone)
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.goto('http://localhost:4173/?view=untitled-studio', { waitUntil: 'networkidle' });
    await wait(800);
    await mobilePage.screenshot({
      path: path.join(artifactDir, '16-untitled-studio-mobile.png'),
      fullPage: true,
    });
    console.log('Saved 16-untitled-studio-mobile.png');

    await mobileContext.close();
    await context.close();
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
