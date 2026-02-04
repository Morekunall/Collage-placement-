// Test script to show server startup output
const app = require('./src/app');

// The app.js already starts the server, so we just need to wait a moment
// to see the output, then we can test a route

setTimeout(() => {
  console.log('\n=== Testing Routes ===');
  console.log('Server should be running now.');
  console.log('You can test routes at:');
  console.log('  - GET http://localhost:5000/api/health');
  console.log('  - GET http://localhost:5000/api/jobs');
  console.log('  - POST http://localhost:5000/api/auth/login');
  console.log('\nPress Ctrl+C to stop the server.\n');
}, 2000);
