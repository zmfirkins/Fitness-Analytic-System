const fs = require('fs');
const csv = require('csv-parser');

async function readWorkoutData(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .on('error', () => reject(new Error('Error reading workout file')))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results));
  });
}

async function workoutCalculator(filePath) {
  try {
    const workouts = await readWorkoutData(filePath);
    const totalWorkouts = workouts.length;
    const totalMinutes = workouts.reduce((sum, w) => sum + Number(w.minutes || 0), 0);
    console.log(`Total workouts: ${totalWorkouts}`);
    console.log(`Total minutes: ${totalMinutes}`);
    return { totalWorkouts, totalMinutes };
  } catch (err) {
    console.error(err.message);
    return { totalWorkouts: 0, totalMinutes: 0 };
  }
}

module.exports = { readWorkoutData, workoutCalculator };
