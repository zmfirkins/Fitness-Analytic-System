const fs = require('fs').promises;

/**
 * Reads and counts health entries from a JSON file
 * @param {string} filePath - Path to the JSON health data file
 * @returns {Promise<number>} - Total number of health entries
 */
async function healthMetricsCounter(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const healthData = JSON.parse(data);
    
    // Check if data has the expected structure with metrics array
    if (!healthData.metrics || !Array.isArray(healthData.metrics)) {
      throw new Error('Invalid JSON format: expected an object with a "metrics" array');
    }
    
    const totalEntries = healthData.metrics.length;
    console.log(`Total health entries: ${totalEntries}`);
    return totalEntries;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Error: File not found at ${filePath}`);
      throw new Error(`Health data file not found: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      console.error('Error: Invalid JSON format in health data file');
      throw new Error('Invalid JSON format in health data file');
    } else {
      console.error(`Error reading health data: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Reads health data and returns the full metrics array
 * @param {string} filePath - Path to the JSON health data file
 * @returns {Promise<Object>} - Object with user and metrics array
 */
async function readHealthData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    const healthData = JSON.parse(data);
    
    if (!healthData.metrics || !Array.isArray(healthData.metrics)) {
      throw new Error('Invalid JSON format: expected an object with a "metrics" array');
    }
    
    return healthData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Health data file not found: ${filePath}`);
    } else if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON format in health data file');
    } else {
      throw error;
    }
  }
}

module.exports = {
  healthMetricsCounter,
  readHealthData
};