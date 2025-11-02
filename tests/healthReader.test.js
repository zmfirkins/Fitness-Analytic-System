const fs = require('fs').promises;
const { healthMetricsCounter, readHealthData } = require('../healthReader');

// Mock fs.promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
  }
}));

describe('healthReader.js', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Spy on console methods
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('healthMetricsCounter', () => {
    test('should count health entries from valid JSON file', async () => {
      const mockData = {
        user: "Alex",
        metrics: [
          { date: '2024-01-01', type: 'sleep', duration: '7.5' },
          { date: '2024-01-01', type: 'nutrition', calories: '2100' },
          { date: '2024-01-02', type: 'sleep', duration: '8.0' }
        ]
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      
      const result = await healthMetricsCounter('./data/health-metrics.json');
      
      expect(result).toBe(3);
      expect(console.log).toHaveBeenCalledWith('Total health entries: 3');
    });

    test('should handle empty metrics array', async () => {
      const mockData = {
        user: "Alex",
        metrics: []
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      
      const result = await healthMetricsCounter('./data/health-metrics.json');
      
      expect(result).toBe(0);
      expect(console.log).toHaveBeenCalledWith('Total health entries: 0');
    });

    test('should throw error when file is not found', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);
      
      await expect(healthMetricsCounter('./data/missing.json'))
        .rejects
        .toThrow('Health data file not found');
      
      expect(console.error).toHaveBeenCalled();
    });

    test('should throw error when JSON is invalid', async () => {
      fs.readFile.mockResolvedValue('{ invalid json }');
      
      await expect(healthMetricsCounter('./data/health-metrics.json'))
        .rejects
        .toThrow('Invalid JSON format in health data file');
      
      expect(console.error).toHaveBeenCalled();
    });

    test('should throw error when JSON does not have metrics array', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify({ data: 'no metrics' }));
      
      await expect(healthMetricsCounter('./data/health-metrics.json'))
        .rejects
        .toThrow('Invalid JSON format: expected an object with a "metrics" array');
    });

    test('should throw error when metrics is not an array', async () => {
      const mockData = {
        user: "Alex",
        metrics: "not an array"
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      
      await expect(healthMetricsCounter('./data/health-metrics.json'))
        .rejects
        .toThrow('Invalid JSON format: expected an object with a "metrics" array');
    });
  });

  describe('readHealthData', () => {
    test('should return health data object with metrics array from valid JSON file', async () => {
      const mockData = {
        user: "Alex",
        metrics: [
          { date: '2024-01-01', type: 'sleep', duration: '7.5' },
          { date: '2024-01-01', type: 'nutrition', calories: '2100' }
        ]
      };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      
      const result = await readHealthData('./data/health-metrics.json');
      
      expect(result).toEqual(mockData);
      expect(result.user).toBe('Alex');
      expect(result.metrics.length).toBe(2);
      expect(Array.isArray(result.metrics)).toBe(true);
    });

    test('should throw error when file is not found', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);
      
      await expect(readHealthData('./data/missing.json'))
        .rejects
        .toThrow('Health data file not found');
    });

    test('should throw error when JSON is invalid', async () => {
      fs.readFile.mockResolvedValue('not valid json');
      
      await expect(readHealthData('./data/health-metrics.json'))
        .rejects
        .toThrow('Invalid JSON format in health data file');
    });

    test('should throw error when metrics property is missing', async () => {
      const mockData = { user: "Alex" };
      
      fs.readFile.mockResolvedValue(JSON.stringify(mockData));
      
      await expect(readHealthData('./data/health-metrics.json'))
        .rejects
        .toThrow('Invalid JSON format: expected an object with a "metrics" array');
    });
  });
});