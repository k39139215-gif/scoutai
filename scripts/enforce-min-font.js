import fs from 'fs';
import path from 'path';

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;

  // Replace inline fontSize: 9/10/11 etc.
  content = content.replace(/\bfontSize:\s*(?:[5-9]|10|11)(?:\.[0-9]+)?\b/g, 'fontSize: 12');
  content = content.replace(/\bfontSize:\s*['"](?:[5-9]|10|11)(?:\.[0-9]+)?px['"]/g, "fontSize: '12px'");
  content = content.replace(/\bfont-size:\s*(?:[5-9]|10|11)(?:\.[0-9]+)?px/g, 'font-size: 12px');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated sub-12px fonts in ${filePath}`);
  }
}

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f)) {
      processFile(p);
    }
  }
}

walk('src');
console.log('Finished updating fonts to minimum 12px.');
