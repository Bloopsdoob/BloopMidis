const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.toLowerCase().endsWith('.mid')) {
      callback(fullPath);
    }
  });
}

const root = '.'; // repo root
const output = [];

walkDir(root, (filePath) => {
  if (filePath.includes('.git')) return; // ignore git internals
  const relPath = filePath.replace(/^\.\//, '').replace(/\\/g, '/');
  output.push({
    title: path.basename(filePath, '.mid'),
    path: relPath,
    youtube: ""
  });
});

fs.writeFileSync('metadata.json', JSON.stringify(output, null, 2));
console.log('metadata.json generated.');
