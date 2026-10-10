import express, { Router } from 'express';
import { ShedService } from '../services/shed.service';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();
const shedService = new ShedService();

// Apply authentication middleware to all shed routes
router.use(authenticateToken);

// Create shed route
router.post('/sheds', (req, res) => shedService.createShed(req, res));

// Get sheds for a farm
router.get('/sheds', (req, res) => shedService.getSheds(req, res));

export default router;