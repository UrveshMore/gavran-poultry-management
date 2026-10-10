// Simple test to check API connectivity 
const axios = require('axios');

async function testAPI() {
  try {
    console.log('Testing API connectivity...');
    
    // Test health endpoint
    const healthResponse = await axios.get('http://localhost:3000/health');
    console.log('Health check:', healthResponse.data);
    
    // Test login endpoint (will fail with invalid creds but should return proper response)
    const loginResponse = await axios.post('http://localhost:3000/api/login', {
      email: 'test@example.com',
      password: 'password'
    });
  } catch (error) {
    console.log('Expected error - this is normal for test');
    console.log('Error status:', error.response?.status);
    console.log('Error data:', error.response?.data || error.message);
  }
}

testAPI();