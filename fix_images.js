const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
  });
}

const sizesStr = 'sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"';

walkDir('e:/Crestal Global/premium-cresta/src', (filePath) => {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Handle multiline or single line tags manually to be safe
    const lines = content.split('\n');
    let inImageTag = false;
    let hasFill = false;
    let hasSizes = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes('<Image') && !line.includes('//')) {
            inImageTag = true;
            hasFill = false;
            hasSizes = false;
        }

        if (inImageTag) {
            if (line.match(/\bfill\b/)) hasFill = true;
            if (line.includes('sizes=')) hasSizes = true;
            
            if (line.includes('/>')) {
                if (hasFill && !hasSizes) {
                    lines[i] = lines[i].replace('/>', ` ${sizesStr} />`);
                    changed = true;
                }
                inImageTag = false;
            } else if (line.includes('>') && !line.includes('=>') && !line.includes('->')) {
                // simple closing tag (rare for next/image, usually it's self closing)
                if (hasFill && !hasSizes) {
                    lines[i] = lines[i].replace('>', ` ${sizesStr} >`);
                    changed = true;
                }
                inImageTag = false;
            }
        }
    }

    if (changed) {
      fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
      console.log('Updated', filePath);
    }
  }
});
