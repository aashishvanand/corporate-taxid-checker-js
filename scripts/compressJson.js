const jsonpack = require('jsonpack');
const fs = require('fs');
const path = require('path');

async function compressJSON() {
  const dataPath = path.join(__dirname, '..', 'data', 'data.json');
  const originalData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  const packedData = jsonpack.pack(originalData);

  fs.writeFileSync(path.join(__dirname, '..', 'data', 'data.compressed'), packedData, 'utf8');
  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data.compressed'), packedData, 'utf8');

  console.log('Compression complete.');
}

compressJSON().catch(err => {
  console.error('Error during compression:', err);
});
