require('dotenv').config();
const { countHealthEntries } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

async function processFiles() {
  const userName = process.env.USER_NAME;
  const weeklyGoal = Number(process.env.WEEKLY_GOAL);

  console.log(`Processing data for: ${userName}`);
  console.log("📁 Reading workout data...");
  const { totalWorkouts, totalMinutes } = await workoutCalculator('./data/workouts.csv');

  console.log("📁 Reading health data...");
  const totalHealthEntries = await countHealthEntries('./data/health-metrics.json');

  console.log("\n=== SUMMARY ===");
  console.log(`Workouts found: ${totalWorkouts}`);
  console.log(`Total workout minutes: ${totalMinutes}`);
  console.log(`Health entries found: ${totalHealthEntries}`);
  console.log(`Weekly goal: ${weeklyGoal} minutes`);

  if (totalMinutes >= weeklyGoal) {
    console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
  } else {
    console.log(`Keep it up ${userName}, you’re almost there! 💪`);
  }
}

processFiles().catch(err => console.error(err));

module.exports = { processFiles };
