// Simple test to check server functionality without database
const express = require('express');
const app = express();
app.use(express.json());

// Test endpoints
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'gavran-poultry-server-mock' });
});

app.post('/api/register', (req, res) => {
  // Mock registration response
  const { email, password, firstName, lastName } = req.body;
  
  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: 'All fields required' });
  }
  
  res.status(201).json({
    user: { id: 'mock-user-id', email, firstName, lastName },
    token: 'mock-jwt-token'
  });
});

app.post('/api/login', (req, res) => {
  // Mock login response
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  
  res.json({
    user: { id: 'mock-user-id', email, firstName: 'Mock', lastName: 'User' },
    token: 'mock-jwt-token'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});