const fs = require('fs');
const path = require('path');

const root = '.'; // root of your repo
const output = [];
const existingMetadataPath = 'metadata.json';

let existingMetadata = [];

// Load existing metadata.json if it exists
if (fs.existsSync(existingMetadataPath)) {
  existingMetadata = JSON.parse(fs.readFileSync(existingMetadataPath, 'utf8'));
}

// Map from file path to YouTube link
const youtubeMap = {};
existingMetadata.forEach(entry => {
  if (entry.path) {
    youtubeMap[entry.path] = entry.youtube || "";
  }
});

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    const relPath = fullPath.replace(/^\.\//, '').replace(/\\/g, '/');

    // Skip OLD folder, .git, and .github
    if (
      relPath.startsWith('OLD/') ||
      relPath.startsWith('.git/') ||
      relPath.startsWith('.github/')
    ) return;

    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else if (file.toLowerCase().endsWith('.mid')) {
      callback(relPath);
    }
  });
}

// Walk the repo and collect MIDI metadata
walkDir(root, (relPath) => {
  output.push({
    title: path.basename(relPath, '.mid'),
    path: relPath,
    youtube: youtubeMap[relPath] || ""
  });
});

// Write updated metadata
fs.writeFileSync(existingMetadataPath, JSON.stringify(output, null, 2));
console.log('metadata.json generated.');
