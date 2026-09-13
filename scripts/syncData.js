const fs = require('fs');
const path = require('path');

function syncData() {
  const dataPath = path.join(__dirname, '..', 'data', 'data.json');
  // Validate it parses before copying.
  JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  fs.copyFileSync(dataPath, path.join(__dirname, '..', 'src', 'data.json'));

  console.log('Sync complete.');
}

syncData();
