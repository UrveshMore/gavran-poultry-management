import { Request, Response } from 'express';
import pool from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class ShedService {
  async createShed(req: Request, res: Response): Promise<Response> {
    try {
      const { name, code, capacity, shedType } = req.body;
      const farmId = req.body.farmId; // This should come from the request or be validated
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

      // Create new shed
      const [newShed] = await pool.execute<ResultSetHeader>(
        'INSERT INTO Shed (name, code, farmId, capacity, shedType, active) VALUES (?, ?, ?, ?, ?, 1)',
        [name, code, farmId, capacity || null, shedType || null]
      );

      return res.status(201).json({
        shed: {
          id: newShed.insertId,
          name: name,
          code: code,
          farmId: farmId,
          capacity: capacity,
          shedType: shedType,
          active: true,
          createdAt: new Date()
        }
      });
    } catch (error) {
      console.error('Create shed error:', error);
      return res.status(500).json({
        error: 'Internal server error during shed creation'
      });
    }
  }

  async getSheds(req: Request, res: Response): Promise<Response> {
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

      // Get sheds for this farm
      const [sheds] = await pool.execute<RowDataPacket[]>(
        'SELECT id, name, code, capacity, shedType, active, createdAt FROM Shed WHERE farmId = ? AND active = 1',
        [farmId]
      );

      return res.json({ sheds });
    } catch (error) {
      console.error('Get sheds error:', error);
      return res.status(500).json({
        error: 'Internal server error during shed retrieval'
      });
    }
  }
}