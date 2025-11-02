const fs = require('fs').promises;

async function readHealthData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    return jsonData;
  } catch (err) {
    throw new Error(`Error reading health data: ${err.message}`);
  }
}

async function countHealthEntries(filePath) {
  try {
    const data = await readHealthData(filePath);
    console.log(`Total health entries: ${data.length}`);
    return data.length;
  } catch (err) {
    console.error(err.message);
    return 0;
  }
}

module.exports = { readHealthData, countHealthEntries };
