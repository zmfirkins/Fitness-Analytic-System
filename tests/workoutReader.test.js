const fs = require('fs');
const { Readable } = require('stream');
const { workoutCalculator, readWorkoutData } = require('../workoutReader');

// Mock fs module
jest.mock('fs');

describe('workoutReader.js', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe('workoutCalculator', () => {
    test('should calculate total workouts and minutes from valid CSV', async () => {
      const csvData = `date,exercise,duration,calories
2024-01-01,Running,30,300
2024-01-02,Cycling,45,400
2024-01-03,Yoga,25,200`;

      fs.existsSync.mockReturnValue(true);
      fs.createReadStream.mockReturnValue(
        Readable.from([csvData])
      );

      const result = await workoutCalculator('./data/workouts.csv');

      expect(result.totalWorkouts).toBe(3);
      expect(result.totalMinutes).toBe(100);
      expect(console.log).toHaveBeenCalledWith('Total workouts: 3');
      expect(console.log).toHaveBeenCalledWith('Total minutes: 100');
    });

    test('should handle empty CSV file', async () => {
      const csvData = `date,exercise,duration,calories`;

      fs.existsSync.mockReturnValue(true);
      fs.createReadStream.mockReturnValue(
        Readable.from([csvData])
      );

      const result = await workoutCalculator('./data/workouts.csv');

      expect(result.totalWorkouts).toBe(0);
      expect(result.totalMinutes).toBe(0);
    });

    test('should throw error when file is not found', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(workoutCalculator('./data/missing.csv'))
        .rejects
        .toThrow('Workout data file not found');

      expect(console.error).toHaveBeenCalled();
    });

    test('should handle invalid duration values', async () => {
      const csvData = `date,exercise,duration,calories
2024-01-01,Running,30,300
2024-01-02,Cycling,invalid,400
2024-01-03,Yoga,20,200`;

      fs.existsSync.mockReturnValue(true);
      fs.createReadStream.mockReturnValue(
        Readable.from([csvData])
      );

      const result = await workoutCalculator('./data/workouts.csv');

      expect(result.totalWorkouts).toBe(3);
      expect(result.totalMinutes).toBe(50); // Only valid durations counted
    });
  });

  describe('readWorkoutData', () => {
    test('should return array of workout objects', async () => {
      const csvData = `date,exercise,duration,calories
2024-01-01,Running,30,300
2024-01-02,Cycling,45,400`;

      fs.existsSync.mockReturnValue(true);
      fs.createReadStream.mockReturnValue(
        Readable.from([csvData])
      );

      const result = await readWorkoutData('./data/workouts.csv');

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('exercise');
      expect(result[0]).toHaveProperty('duration');
    });

    test('should throw error when file is not found', async () => {
      fs.existsSync.mockReturnValue(false);

      await expect(readWorkoutData('./data/missing.csv'))
        .rejects
        .toThrow('Workout data file not found');
    });
  });
});