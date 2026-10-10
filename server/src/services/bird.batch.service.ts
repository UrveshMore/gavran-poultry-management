import { Request, Response } from 'express';
import pool from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class BirdBatchService {
  async createBatch(req: Request, res: Response): Promise<Response> {
    try {
      const { name, code, breed, quantity, startDate, shedId, farmId } = req.body;
      const userId = (req as any).userId;

      // Validate input
      if (!name || !code || !farmId) {
        return res.status(400).json({
          error: 'Name, code, and farmId are required'
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

      // Check if batch code already exists for this farm
      const [existingBatch] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM BirdBatch WHERE farmId = ? AND batchCode = ?',
        [farmId, code]
      );

      if (existingBatch.length > 0) {
        return res.status(409).json({
          error: 'A batch with this code already exists for this farm'
        });
      }

      // Create new batch
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO BirdBatch (id, farmId, shedId, batchCode, birdType, source, hatchDate, acquisitionDate, initialQuantity, currentQuantity, maleQuantity, femaleQuantity, status, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          null, // id will be auto-generated
          farmId,
          shedId || null,
          code, 
          breed || null,
          null,
          null,
          new Date(),
          quantity || 0,
          quantity || 0,
          0, // maleQuantity
          0, // femaleQuantity  
          'active', // status
          null // notes
        ]
      );

      const batchId = result.insertId;

      // Get the created batch 
      const [createdBatch] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM BirdBatch WHERE id = ?',
        [batchId]
      );

      return res.status(201).json({
        batch: createdBatch[0]
      });
    } catch (error) {
      console.error('Error creating batch:', error);
      return res.status(500).json({
        error: 'Failed to create bird batch'
      });
    }
  }

  async getBatches(req: Request, res: Response): Promise<Response> {
    try {
      const { farmId } = req.query;
      const userId = (req as any).userId;

      // Validate input
      if (!farmId) {
        return res.status(400).json({
          error: 'Farm ID is required'
        });
      }

      // Check user access to farm  
      const [membership] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM FarmMembership WHERE userId = ? AND farmId = ?',
        [userId, farmId]
      );

      if (!membership || membership.length === 0) {
        return res.status(403).json({
          error: 'Access denied - you do not have access to this farm'
        });
      }

      // Get all batches for the farm
      const [batches] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM BirdBatch WHERE farmId = ? ORDER BY createdAt DESC',
        [farmId]
      );

      return res.status(200).json({
        batches: batches
      });
    } catch (error) {
      console.error('Error fetching batches:', error);
      return res.status(500).json({
        error: 'Failed to fetch bird batches'
      });
    }
  }

  async recordMortality(req: Request, res: Response): Promise<Response> {
    try {
      const { batchId, mortalityCount, date, reason } = req.body;
      const userId = (req as any).userId;

      if (!batchId || !mortalityCount) {
        return res.status(400).json({
          error: 'Batch ID and mortality count are required'
        });
      }

      // Check that batch exists and user has access
      const [batchResult] = await pool.execute<RowDataPacket[]>(
        `SELECT b.*, f.id as farm_id FROM BirdBatch b 
         JOIN Farm f ON b.farmId = f.id
         JOIN FarmMembership fm ON f.id = fm.farmId
         WHERE b.id = ? AND fm.userId = ?`,
        [batchId, userId]
      );

      if (!batchResult || batchResult.length === 0) {
        return res.status(404).json({
          error: 'Batch not found or access denied'
        });
      }

      const batch = batchResult[0];

      // Record mortality
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO MortalityRecord (id, batchId, count, date, reason) VALUES (?, ?, ?, ?, ?)',
        [
          null,
          batchId,
          mortalityCount,
          date || new Date(),
          reason || null
        ]
      );

      // Update batch current quantity
      const [batchDetails] = await pool.execute<RowDataPacket[]>(
        'SELECT currentQuantity FROM BirdBatch WHERE id = ?',
        [batchId]
      );

      const newQuantity = Math.max(0, (batchDetails[0] as any).currentQuantity - mortalityCount);

      await pool.execute<ResultSetHeader>(
        'UPDATE BirdBatch SET currentQuantity = ?, updatedAt = NOW() WHERE id = ?',
        [newQuantity, batchId]
      );

      return res.status(201).json({
        message: 'Mortality recorded successfully'
      });
    } catch (error) {
      console.error('Error recording mortality:', error);
      return res.status(500).json({
        error: 'Failed to record mortality'
      });
    }
  }

  async getBatchSummary(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      if (!id) {
        return res.status(400).json({
          error: 'Batch ID is required'
        });
      }

      // Check that batch exists and user has access
      const [batchResult] = await pool.execute<RowDataPacket[]>(
        `SELECT b.*, f.id as farm_id FROM BirdBatch b 
         JOIN Farm f ON b.farmId = f.id
         JOIN FarmMembership fm ON f.id = fm.farmId
         WHERE b.id = ? AND fm.userId = ?`,
        [id, userId]
      );

      if (!batchResult || batchResult.length === 0) {
        return res.status(404).json({
          error: 'Batch not found or access denied'
        });
      }

      const batch = batchResult[0];

      // Get mortality records for this batch
      const [mortalityRecords] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM MortalityRecord WHERE batchId = ? ORDER BY date DESC',
        [id]
      );

      // Calculate total mortality
      const totalMortality = (mortalityRecords as any[]).reduce((sum, record) => sum + record.count, 0);

      return res.status(200).json({
        batch: {
          ...batch,
          totalMortality
        },
        mortalityRecords: mortalityRecords
      });
    } catch (error) {
      console.error('Error fetching batch summary:', error);
      return res.status(500).json({
        error: 'Failed to fetch batch summary'
      });
    }
  }

  async getBatchById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      if (!id) {
        return res.status(400).json({
          error: 'Batch ID is required'
        });
      }

      // Check that batch exists and user has access
      const [batchResult] = await pool.execute<RowDataPacket[]>(
        `SELECT b.*, f.id as farm_id FROM BirdBatch b 
         JOIN Farm f ON b.farmId = f.id
         JOIN FarmMembership fm ON f.id = fm.farmId
         WHERE b.id = ? AND fm.userId = ?`,
        [id, userId]
      );

      if (!batchResult || batchResult.length === 0) {
        return res.status(404).json({
          error: 'Batch not found or access denied'
        });
      }

      return res.status(200).json({
        batch: batchResult[0]
      });
    } catch (error) {
      console.error('Error fetching batch:', error);
      return res.status(500).json({
        error: 'Failed to fetch batch'
      });
    }
  }
}