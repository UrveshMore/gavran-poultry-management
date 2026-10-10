import { Request, Response } from 'express';
import pool from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class FarmService {
  async createFarm(req: Request, res: Response): Promise<Response> {
    try {
      const { name, code, address, city, state, country, postalCode } = req.body;
      const userId = (req as any).userId;

      // Validate input
      if (!name || !code) {
        return res.status(400).json({
          error: 'Name and code are required'
        });
      }

      // Check if farm code already exists
      const [existingFarm] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM Farm WHERE code = ?',
        [code]
      );

      if (existingFarm.length > 0) {
        return res.status(409).json({
          error: 'A farm with this code already exists'
        });
      }

      // Create new farm
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO Farm (name, code, address, city, state, country, postalCode, createdBy, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [
          name,
          code,
          address || null,
          city || null,
          state || null,
          country || null,
          postalCode || null,
          userId
        ]
      );

      const farmId = result.insertId;

      // Add user to farm membership
      await pool.execute<ResultSetHeader>(
        'INSERT INTO FarmMembership (userId, farmId) VALUES (?, ?)',
        [userId, farmId]
      );

      // Get created farm details
      const [farm] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM Farm WHERE id = ?',
        [farmId]
      );

      return res.status(201).json({
        farm: farm[0]
      });
    } catch (error) {
      console.error('Error creating farm:', error);
      return res.status(500).json({
        error: 'Failed to create farm'
      });
    }
  }

  async getFarms(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;
      
      // Get farms the user has access to
      const [farmMemberships] = await pool.execute<RowDataPacket[]>(
        'SELECT farmId FROM FarmMembership WHERE userId = ?',
        [userId]
      );

      if (farmMemberships.length === 0) {
        return res.json({ farms: [] });
      }

      const farmIds = farmMemberships.map((m: any) => m.farmId);
      
      // Get farm details
      const placeholders = farmIds.map(() => '?').join(',');
      const [farms] = await pool.execute<RowDataPacket[]>(
        `SELECT id, name, code, active, createdAt FROM Farm 
         WHERE id IN (${placeholders}) AND active = 1`,
        farmIds
      );

      return res.json({ farms });
    } catch (error) {
      console.error('Get farms error:', error);
      return res.status(500).json({
        error: 'Internal server error during farm retrieval'
      });
    }
  }

  async getFarmDetails(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      if (!id) {
        return res.status(400).json({
          error: 'Farm ID is required'
        });
      }

      // Check user access to farm
      const [membership] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM FarmMembership WHERE userId = ? AND farmId = ?',
        [userId, id]
      );

      if (!membership || membership.length === 0) {
        return res.status(403).json({
          error: 'Access denied - you do not have access to this farm'
        });
      }

      // Get farm details
      const [farm] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM Farm WHERE id = ?',
        [id]
      );

      if (!farm || farm.length === 0) {
        return res.status(404).json({
          error: 'Farm not found'
        });
      }

      return res.json({ farm: farm[0] });
    } catch (error) {
      console.error('Get farm details error:', error);
      return res.status(500).json({
        error: 'Internal server error during farm detail retrieval'
      });
    }
  }

  async getFarmById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const userId = (req as any).userId;

      if (!id) {
        return res.status(400).json({
          error: 'Farm ID is required'
        });
      }

      // Check user access to farm
      const [membership] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM FarmMembership WHERE userId = ? AND farmId = ?',
        [userId, id]
      );

      if (!membership || membership.length === 0) {
        return res.status(403).json({
          error: 'Access denied - you do not have access to this farm'
        });
      }

      // Get farm details
      const [farm] = await pool.execute<RowDataPacket[]>(
        'SELECT * FROM Farm WHERE id = ?',
        [id]
      );

      if (!farm || farm.length === 0) {
        return res.status(404).json({
          error: 'Farm not found'
        });
      }

      return res.json({ farm: farm[0] });
    } catch (error) {
      console.error('Get farm by ID error:', error);
      return res.status(500).json({
        error: 'Internal server error during farm retrieval'
      });
    }
  }
}