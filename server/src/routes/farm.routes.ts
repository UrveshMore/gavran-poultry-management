import express, { Router } from 'express';
import { FarmService } from '../services/farm.service';
import { authenticateToken } from '../middleware/auth.middleware';
import { DashboardService } from '../services/dashboard.service';

const router = express.Router();
const farmService = new FarmService();
const dashboardService = new DashboardService();

// Apply authentication middleware to all farm routes
router.use(authenticateToken);

// Create farm route
router.post('/farms', (req, res) => farmService.createFarm(req, res));

// Get user's farms
router.get('/farms', (req, res) => farmService.getFarms(req, res));

// Get specific farm details
router.get('/farms/:id', (req, res) => farmService.getFarmDetails(req, res));

// Get dashboard stats for a farm
router.get('/dashboard/stats', (req, res) => dashboardService.getDashboardStats(req, res));

export default router;