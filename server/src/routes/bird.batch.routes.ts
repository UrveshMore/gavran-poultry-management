import express, { Router } from 'express';
import { BirdBatchService } from '../services/bird.batch.service';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();
const batchService = new BirdBatchService();

// Apply authentication middleware to all bird batch routes
router.use(authenticateToken);

// Create bird batch route
router.post('/batches', (req, res) => batchService.createBatch(req, res));

// Get batches for a farm
router.get('/batches', (req, res) => batchService.getBatches(req, res));

// Record mortality for a batch
router.post('/batches/mortality', (req, res) => batchService.recordMortality(req, res));

// Get batch summary including mortality
router.get('/batches/:id/summary', (req, res) => batchService.getBatchSummary(req, res));

export default router;