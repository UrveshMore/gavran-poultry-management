import { Request, Response } from 'express';
import pool from '../db/database';
import { RowDataPacket } from 'mysql2';

export class DashboardService {
  async getDashboardStats(req: Request, res: Response): Promise<Response> {
    try {
      const farmId = req.query.farmId as string;
      const userId = (req as any).userId;

      if (!farmId) {
        return res.status(400).json({
          error: 'Farm ID is required'
        });
      }

      // Check that user has access to this farm
      const [membership] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM FarmMembership WHERE userId = ? AND farmId = ?',
        [userId, farmId]
      );

      if (!membership || membership.length === 0) {
        return res.status(403).json({
          error: 'Access denied - you do not have access to this farm'
        });
      }

      // Get farm statistics
      const stats = {
        totalBirds: 0,
        totalSheds: 0,
        totalBatches: 0,
        totalMortality: 0,
        totalEggs: 0,
        recentActivity: []
      };

      // Count sheds
      const [shedCount] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM Shed WHERE farmId = ? AND active = 1',
        [farmId]
      );
      stats.totalSheds = shedCount[0].count;

      // Count batches  
      const [batchCount] = await pool.execute<RowDataPacket[]>(
        'SELECT COUNT(*) as count FROM BirdBatch WHERE farmId = ? AND active = 1',
        [farmId]
      );
      stats.totalBatches = batchCount[0].count;

      // Get recent mortality records
      const [recentMortality] = await pool.execute<RowDataPacket[]>(
        'SELECT mr.id, mr.date, mr.quantity, bb.name as batchName FROM MortalityRecord mr ' +
        'JOIN BirdBatch bb ON mr.batchId = bb.id ' +
        'WHERE bb.farmId = ? ' +
        'ORDER BY mr.date DESC ' +
        'LIMIT 5',
        [farmId]
      );
      
      stats.recentActivity = recentMortality;
      
      // Count total birds from batches (approximation)
      const [totalBirdsInBatches] = await pool.execute<RowDataPacket[]>(
        'SELECT SUM(quantity) as total FROM BirdBatch WHERE farmId = ? AND active = 1',
        [farmId]
      );
      
      stats.totalBirds = totalBirdsInBatches[0].total || 0;

      // Count total mortality
      const [totalMortality] = await pool.execute<RowDataPacket[]>(
        'SELECT SUM(quantity) as total FROM MortalityRecord mr ' +
        'JOIN BirdBatch bb ON mr.batchId = bb.id ' +
        'WHERE bb.farmId = ?',
        [farmId]
      );
      
      stats.totalMortality = totalMortality[0].total || 0;

      return res.json({ stats });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      return res.status(500).json({
        error: 'Internal server error during dashboard stats retrieval'
      });
    }
  }
}