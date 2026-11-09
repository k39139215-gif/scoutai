import fs from 'fs';
import path from 'path';

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx?|css)$/.test(f)) {
      const content = fs.readFileSync(p, 'utf8');
      const lines = content.split('\n');
      lines.forEach((l, idx) => {
        if (/font-?size[:=]\s*["']?(?:[5-9]|10|11)(?:\.[0-9]+)?px?["']?/i.test(l) || /fontSize:\s*(?:[5-9]|10|11)(?:\.[0-9]+)?\b/.test(l)) {
          console.log(`${p}:${idx+1} -> ${l.trim()}`);
        }
      });
    }
  }
}
walk('src');
