const fs = require('fs');
const csv = require('csv-parser');

/**
 * Reads CSV workout data and calculates total workouts and minutes
 * @param {string} filePath - Path to the CSV workout data file
 * @returns {Promise<Object>} - Object with totalWorkouts and totalMinutes
 */
function workoutCalculator(filePath) {
  return new Promise((resolve, reject) => {
    // Check if file exists first
    if (!fs.existsSync(filePath)) {
      const error = new Error(`Workout data file not found: ${filePath}`);
      console.error(`Error: File not found at ${filePath}`);
      reject(error);
      return;
    }

    const workouts = [];
    let hasError = false;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        workouts.push(row);
      })
      .on('end', () => {
        if (!hasError) {
          const totalWorkouts = workouts.length;
          
          // Calculate total minutes using a basic for loop
          let totalMinutes = 0;
          for (let i = 0; i < workouts.length; i++) {
            const duration = parseInt(workouts[i].duration);
            if (!isNaN(duration)) {
              totalMinutes += duration;
            }
          }
          
          console.log(`Total workouts: ${totalWorkouts}`);
          console.log(`Total minutes: ${totalMinutes}`);
          
          resolve({ totalWorkouts, totalMinutes });
        }
      })
      .on('error', (error) => {
        hasError = true;
        console.error(`Error reading workout data: ${error.message}`);
        reject(new Error(`Error processing CSV file: ${error.message}`));
      });
  });
}

/**
 * Reads CSV workout data and returns all workout entries
 * @param {string} filePath - Path to the CSV workout data file
 * @returns {Promise<Array>} - Array of workout objects
 */
function readWorkoutData(filePath) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(filePath)) {
      reject(new Error(`Workout data file not found: ${filePath}`));
      return;
    }

    const workouts = [];
    let hasError = false;

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        workouts.push(row);
      })
      .on('end', () => {
        if (!hasError) {
          resolve(workouts);
        }
      })
      .on('error', (error) => {
        hasError = true;
        reject(new Error(`Error processing CSV file: ${error.message}`));
      });
  });
}

module.exports = {
  workoutCalculator,
  readWorkoutData
};