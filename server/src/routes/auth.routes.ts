import express, { Router } from 'express';
import { AuthService } from '../services/auth.service';

const router = express.Router();
const authService = new AuthService();

// Register route
router.post('/register', (req, res) => authService.register(req, res));

// Login route  
router.post('/login', (req, res) => authService.login(req, res));

// Get current user route
router.get('/me', (req, res) => authService.getCurrentUser(req, res));

export default router;