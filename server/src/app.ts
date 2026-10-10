import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/auth.routes';
import farmRoutes from './routes/farm.routes';
import shedRoutes from './routes/shed.routes';
import batchRoutes from './routes/bird.batch.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', farmRoutes);
app.use('/api', shedRoutes);
app.use('/api', batchRoutes);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'gavran-poultry-server'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler - should be last middleware
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;