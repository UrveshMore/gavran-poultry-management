import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class AuthService {
  private secretKey = process.env.JWT_SECRET || 'change_this_secret_for_production';

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Validate input
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({
          error: 'Email, password, firstName, and lastName are required'
        });
      }

      // Check if user already exists
      const [existingUser] = await pool.execute<RowDataPacket[]>(
        'SELECT id FROM User WHERE email = ?',
        [email]
      );
      
      if (existingUser.length > 0) {
        return res.status(409).json({
          error: 'User with this email already exists'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create new user in database
      const [result] = await pool.execute<ResultSetHeader>(
        'INSERT INTO User (id, email, passwordHash, firstName, lastName, phone, isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [
          null,
          email,
          hashedPassword,
          firstName,
          lastName,
          null,
          1 // isActive
        ]
      );

      const userId = result.insertId;

      // Get created user details 
      const [createdUser] = await pool.execute<RowDataPacket[]>(
        'SELECT id, email, firstName, lastName, createdAt FROM User WHERE id = ?',
        [userId]
      );

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId,
          email,
          firstName,
          lastName
        },
        this.secretKey,
        { expiresIn: '24h' }
      );

      return res.status(201).json({
        user: createdUser[0],
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({
        error: 'Internal server error during registration'
      });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required'
        });
      }

      // Find user by email
      const [user] = await pool.execute<RowDataPacket[]>(
        'SELECT id, email, firstName, lastName, passwordHash, isActive FROM User WHERE email = ?',
        [email]
      );

      if (!user || user.length === 0) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      const userData = user[0];

      // Check if user is active
      if (!userData.isActive) {
        return res.status(401).json({
          error: 'Account deactivated'
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, userData.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        { 
          userId: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        },
        this.secretKey,
        { expiresIn: '24h' }
      );

      return res.json({
        user: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        error: 'Internal server error during login'
      });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;

      // Get user details
      const [user] = await pool.execute<RowDataPacket[]>(
        'SELECT id, email, firstName, lastName, createdAt FROM User WHERE id = ?',
        [userId]
      );

      if (!user || user.length === 0) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      return res.json({ user: user[0] });
    } catch (error) {
      console.error('Get user error:', error);
      return res.status(500).json({
        error: 'Internal server error during user retrieval'
      });
    }
  }
}