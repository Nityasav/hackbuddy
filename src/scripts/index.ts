import seedDummyUsers from './seedDummyUsers';

const runAllSeeds = async () => {
  try {
    console.log('Starting database seeding...');
    
    // Run user seeding
    await seedDummyUsers();
    
    console.log('All seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

// Only run if this file is executed directly
if (require.main === module) {
  runAllSeeds();
}

export default runAllSeeds; 