require('dotenv').config();

const { healthMetricsCounter } = require('./healthReader');
const { workoutCalculator } = require('./workoutReader');

/**
 * Main function to process fitness data files
 */
async function processFiles() {
  try {
    // Get environment variables
    const userName = process.env.USER_NAME;
    const weeklyGoal = parseInt(process.env.WEEKLY_GOAL);

    // Validate environment variables
    if (!userName) {
      throw new Error('USER_NAME environment variable is not set');
    }
    if (!weeklyGoal || isNaN(weeklyGoal)) {
      throw new Error('WEEKLY_GOAL environment variable is not set or invalid');
    }

    console.log(`Processing data for: ${userName}`);
    
    // Read workout data
    console.log('📁 Reading workout data...');
    const workoutData = await workoutCalculator('./data/workouts.csv');
    
    // Read health data
    console.log('📁 Reading health data...');
    const healthEntries = await healthMetricsCounter('./data/health-metrics.json');
    
    // Display summary
    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workoutData.totalWorkouts}`);
    console.log(`Total workout minutes: ${workoutData.totalMinutes}`);
    console.log(`Health entries found: ${healthEntries}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);
    
    // Check if weekly goal was met
    if (workoutData.totalMinutes >= weeklyGoal) {
      console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
    } else {
      const remaining = weeklyGoal - workoutData.totalMinutes;
      console.log(`💪 Keep going ${userName}! You need ${remaining} more minutes to reach your weekly goal.`);
    }
    
  } catch (error) {
    console.error('\n❌ Error processing files:');
    console.error(error.message);
    console.error('\nPlease check that:');
    console.error('1. Your .env file exists with USER_NAME and WEEKLY_GOAL variables');
    console.error('2. Your data files exist in the ./data/ directory');
    console.error('3. Your files are properly formatted');
  }
}

// Run the main function
processFiles();

module.exports = { processFiles };